const asyncHandler = require('express-async-handler');
const { pool } = require('../config/db');
const Cart = require('../models/Cart');
const Order = require('../models/Order');
const Coupon = require('../models/Coupon');
const MenuItem = require('../models/MenuItem');
const DeliveryArea = require('../models/DeliveryArea');
const { resolveExtras, extrasTotal } = require('../utils/pricing');

// Turns a guest-submitted `items` array ([{menu_item_id, quantity, extras: [ids]}])
// into priced line items using authoritative DB prices - never trusts price/name
// sent by the client.
async function resolveGuestItems(items) {
  if (!Array.isArray(items) || !items.length) {
    const err = new Error('items are required for a guest order'); err.status = 400; throw err;
  }
  const resolved = [];
  for (const raw of items) {
    const menuItem = await MenuItem.findById(raw.menu_item_id);
    if (!menuItem || !menuItem.is_available) {
      const err = new Error(`Menu item ${raw.menu_item_id} is not available`); err.status = 400; throw err;
    }
    const quantity = Math.max(1, Number(raw.quantity) || 1);
    const extras = await resolveExtras(raw.extras);
    resolved.push({
      menu_item_id: menuItem.id,
      name: menuItem.name,
      price: Number(menuItem.price),
      quantity,
      extras,
    });
  }
  return resolved;
}

// POST /api/orders  (checkout - matches the Figma "checkout" screen)
// Works for logged-in users (pulls the server-side cart) and guests
// (optionalAuth - req.user is undefined; the request body must carry
// `items` directly plus guest_name/guest_phone).
exports.checkout = asyncHandler(async (req, res) => {
  const {
    fulfillment_type, payment_method, delivery_address, delivery_city, delivery_area_id, delivery_notes, contact_phone,
    coupon_code, items, guest_name, guest_email, guest_phone,
  } = req.body;

  const isGuest = !req.user;
  if (isGuest && (!guest_name || !guest_phone)) {
    res.status(400);
    throw new Error('guest_name and guest_phone are required for a guest order');
  }

  const lineItems = isGuest ? await resolveGuestItems(items) : (await Cart.listForUser(req.user.id)).map((i) => ({
    menu_item_id: i.menu_item_id, name: i.name, price: Number(i.price), quantity: i.quantity, extras: i.extras || [],
  }));
  if (!lineItems.length) { res.status(400); throw new Error('Your cart is empty'); }

  if (fulfillment_type === 'delivery' && (!delivery_address || !delivery_city)) {
    res.status(400);
    throw new Error('delivery_address and delivery_city are required for delivery orders');
  }

  // Delivery fee is always looked up from the DB by area id - never trusted
  // from the client - so admins can change per-area fees without any code
  // changes and customers can't tamper with the amount charged.
  let delivery_fee = 0;
  if (fulfillment_type === 'delivery') {
    if (!delivery_area_id) { res.status(400); throw new Error('delivery_area_id is required for delivery orders'); }
    const area = await DeliveryArea.findById(delivery_area_id);
    if (!area || !area.is_active) { res.status(400); throw new Error('Selected delivery area is not available'); }
    delivery_fee = Number(area.fee);
  }

  const subtotal = lineItems.reduce((sum, i) => sum + (i.price + extrasTotal(i.extras)) * i.quantity, 0);

  let discount_amount = 0;
  let appliedCoupon = null;
  if (coupon_code) {
    const result = await Coupon.validate(coupon_code, subtotal);
    if (result) { discount_amount = result.discount_amount; appliedCoupon = result.coupon; }
  }

  const total = Math.max(0, subtotal + delivery_fee - discount_amount);

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const orderId = await Order.create(conn, {
      user_id: isGuest ? null : req.user.id,
      guest_name: isGuest ? guest_name : null,
      guest_email: isGuest ? guest_email : null,
      guest_phone: isGuest ? guest_phone : null,
      fulfillment_type: fulfillment_type || 'delivery',
      payment_method: payment_method || 'cash',
      subtotal, delivery_fee,
      coupon_code: appliedCoupon ? appliedCoupon.code : null,
      discount_amount,
      total,
      delivery_address, delivery_city, delivery_area_id: fulfillment_type === 'delivery' ? delivery_area_id : null,
      delivery_notes, contact_phone,
    });
    for (const item of lineItems) {
      await Order.addItem(conn, orderId, {
        menu_item_id: item.menu_item_id,
        item_name: item.name,
        unit_price: item.price,
        quantity: item.quantity,
        line_total: (item.price + extrasTotal(item.extras)) * item.quantity,
        extras: item.extras,
      });
    }
    if (appliedCoupon) await Coupon.incrementUsage(conn, appliedCoupon.id);
    await conn.commit();
    if (!isGuest) await Cart.clear(req.user.id);
    res.status(201).json(await Order.findById(orderId));
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
});

// GET /api/orders/mine
exports.myOrders = asyncHandler(async (req, res) => {
  res.json(await Order.listForUser(req.user.id));
});

// GET /api/orders/:id
exports.getOne = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) { res.status(404); throw new Error('Order not found'); }
  const isOwner = req.user && order.user_id === req.user.id;
  const isStaff = req.user && ['admin', 'staff'].includes(req.user.role);
  if (!isOwner && !isStaff) {
    res.status(403);
    throw new Error('Not authorized to view this order');
  }
  res.json(order);
});

// GET /api/orders  (admin)
exports.listAll = asyncHandler(async (req, res) => {
  const { status, limit, offset } = req.query;
  res.json(await Order.listAll({ status, limit: Number(limit) || 50, offset: Number(offset) || 0 }));
});

// PATCH /api/orders/:id/status  (admin)
exports.updateStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const valid = ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'completed', 'cancelled'];
  if (!valid.includes(status)) { res.status(400); throw new Error('Invalid status'); }
  await Order.updateStatus(req.params.id, status);
  res.json(await Order.findById(req.params.id));
});
