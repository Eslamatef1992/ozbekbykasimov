const asyncHandler = require('express-async-handler');
const DeliveryArea = require('../models/DeliveryArea');

// GET /api/delivery-areas  (public - customer checkout only needs active areas;
// admin passes ?all=true to also see disabled ones)
exports.list = asyncHandler(async (req, res) => {
  const onlyActive = req.query.all !== 'true';
  res.json(await DeliveryArea.list({ onlyActive }));
});

exports.create = asyncHandler(async (req, res) => {
  const { name_en, name_ar, fee, sort_order } = req.body;
  if (!name_en) { res.status(400); throw new Error('name_en is required'); }
  if (fee === undefined || fee === null || Number.isNaN(Number(fee))) {
    res.status(400); throw new Error('fee is required');
  }
  const id = await DeliveryArea.create({ name_en, name_ar, fee: Number(fee), sort_order: sort_order || 0 });
  res.status(201).json(await DeliveryArea.findById(id));
});

exports.update = asyncHandler(async (req, res) => {
  const existing = await DeliveryArea.findById(req.params.id);
  if (!existing) { res.status(404); throw new Error('Delivery area not found'); }
  const { name_en, name_ar, fee, sort_order, is_active } = req.body;
  await DeliveryArea.update(req.params.id, {
    name_en: name_en ?? existing.name_en,
    name_ar: name_ar ?? existing.name_ar,
    fee: fee !== undefined ? Number(fee) : existing.fee,
    sort_order: sort_order ?? existing.sort_order,
    is_active: is_active ?? existing.is_active,
  });
  res.json(await DeliveryArea.findById(req.params.id));
});

exports.remove = asyncHandler(async (req, res) => {
  await DeliveryArea.remove(req.params.id);
  res.status(204).send();
});
