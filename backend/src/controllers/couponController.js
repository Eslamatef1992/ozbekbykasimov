const asyncHandler = require('express-async-handler');
const Coupon = require('../models/Coupon');

// GET /api/coupons  (admin - coupons permission)
exports.list = asyncHandler(async (req, res) => {
  res.json(await Coupon.list());
});

// POST /api/coupons  (admin)
exports.create = asyncHandler(async (req, res) => {
  const { code, type, value, min_order_value, max_uses, is_active, expires_at } = req.body;
  if (!code || !type || value === undefined) {
    res.status(400);
    throw new Error('code, type and value are required');
  }
  if (!['percent', 'fixed'].includes(type)) {
    res.status(400);
    throw new Error("type must be 'percent' or 'fixed'");
  }
  const existing = await Coupon.findByCode(code.trim().toUpperCase());
  if (existing) { res.status(409); throw new Error('A coupon with this code already exists'); }
  const id = await Coupon.create({ code, type, value, min_order_value, max_uses, is_active, expires_at });
  res.status(201).json(await Coupon.findById(id));
});

// PATCH /api/coupons/:id  (admin)
exports.update = asyncHandler(async (req, res) => {
  const existing = await Coupon.findById(req.params.id);
  if (!existing) { res.status(404); throw new Error('Coupon not found'); }
  const { code, type, value, min_order_value, max_uses, is_active, expires_at } = req.body;
  await Coupon.update(req.params.id, {
    code: code ?? existing.code,
    type: type ?? existing.type,
    value: value ?? existing.value,
    min_order_value: min_order_value ?? existing.min_order_value,
    max_uses: max_uses ?? existing.max_uses,
    is_active: is_active ?? existing.is_active,
    expires_at: expires_at ?? existing.expires_at,
  });
  res.json(await Coupon.findById(req.params.id));
});

// DELETE /api/coupons/:id  (admin)
exports.remove = asyncHandler(async (req, res) => {
  await Coupon.remove(req.params.id);
  res.status(204).send();
});

// POST /api/coupons/validate  (public - used at checkout)
exports.validate = asyncHandler(async (req, res) => {
  const { code, subtotal } = req.body;
  if (!code) { res.status(400); throw new Error('code is required'); }
  try {
    const result = await Coupon.validate(code, subtotal || 0);
    res.json({ valid: true, discount_amount: result.discount_amount, type: result.coupon.type, value: Number(result.coupon.value) });
  } catch (err) {
    res.status(err.status || 400).json({ valid: false, message: err.message });
  }
});
