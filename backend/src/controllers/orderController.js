const asyncHandler = require('express-async-handler');
const { pool } = require('../config/db');
const Cart = require('../models/Cart');
const Order = require('../models/Order');

const DELIVERY_FEE = 3.0; // flat fee; adjust or make configurable via site_settings later

// POST /api/orders  (checkout - matches the Figma "checkout" screen)
exports.checkout = asyncHandler(async (req, res) => {
  const { fulfillment_type, payment_method, delivery_address, delivery_city, delivery_notes, contact_phone } = req.body;

  const cartItems = await Cart.listForUser(req.user.id);
  if (!cartItems.length) { res.status(400); throw new Error('Your cart is empty'); }

  if (fulfillment_type === 'delivery' && (!delivery_address || !delivery_city)) {
    res.status(400);
    throw new Error('delivery_address and delivery_city are required for delivery orders');
  }

  const subtotal = cartItems.reduce((sum, i) => sum + Number(i.price) * i.quantity, 0);
  const delivery_fee = fulfillment_type === 'delivery' ? DELIVERY_FEE : 0;
  const total = subtotal + delivery_fee;

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const orderId = await Order.create(conn, {
      user_id: req.user.id,
      fulfillment_type: fulfillment_type || 'delivery',
      payment_method: payment_method || 'cash',
      subtotal, delivery_fee, total,
      delivery_address, delivery_city, delivery_notes, contact_phone,
    });
    for (const item of cartItems) {
      await Order.addItem(conn, orderId, {
        menu_item_id: item.menu_item_id,
        item_name: item.name,
        unit_price: item.price,
        quantity: item.quantity,
        line_total: Number(item.price) * item.quantity,
      });
    }
    await conn.commit();
    await Cart.clear(req.user.id);
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
  if (order.user_id !== req.user.id && !['admin', 'staff'].includes(req.user.role)) {
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
