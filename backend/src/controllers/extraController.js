const asyncHandler = require('express-async-handler');
const Extra = require('../models/Extra');

// GET /api/extras  (public - product page needs prices/names; ?all=true for admin sees unavailable too)
exports.list = asyncHandler(async (req, res) => {
  res.json(await Extra.list({ onlyAvailable: req.query.all !== 'true' }));
});

// POST /api/extras  (admin - extras permission)
exports.create = asyncHandler(async (req, res) => {
  const { name_en, name_ar, price, is_available } = req.body;
  if (!name_en) { res.status(400); throw new Error('name_en is required'); }
  const id = await Extra.create({ name_en, name_ar, price, is_available });
  res.status(201).json(await Extra.findById(id));
});

// PATCH /api/extras/:id  (admin)
exports.update = asyncHandler(async (req, res) => {
  const existing = await Extra.findById(req.params.id);
  if (!existing) { res.status(404); throw new Error('Extra not found'); }
  const { name_en, name_ar, price, is_available } = req.body;
  await Extra.update(req.params.id, {
    name_en: name_en ?? existing.name_en,
    name_ar: name_ar ?? existing.name_ar,
    price: price ?? existing.price,
    is_available: is_available ?? existing.is_available,
  });
  res.json(await Extra.findById(req.params.id));
});

// DELETE /api/extras/:id  (admin)
exports.remove = asyncHandler(async (req, res) => {
  await Extra.remove(req.params.id);
  res.status(204).send();
});
