const asyncHandler = require('express-async-handler');
const Reservation = require('../models/Reservation');

// POST /api/reservations  (matches Figma "book a table")
exports.create = asyncHandler(async (req, res) => {
  const { full_name, phone, email, party_size, reservation_date, reservation_time, notes } = req.body;
  if (!full_name || !phone || !party_size || !reservation_date || !reservation_time) {
    res.status(400);
    throw new Error('full_name, phone, party_size, reservation_date and reservation_time are required');
  }
  const id = await Reservation.create({
    user_id: req.user ? req.user.id : null,
    full_name, phone, email, party_size, reservation_date, reservation_time, notes,
  });
  res.status(201).json({ id, status: 'pending' });
});

exports.mine = asyncHandler(async (req, res) => {
  res.json(await Reservation.listForUser(req.user.id));
});

exports.listAll = asyncHandler(async (req, res) => {
  const { status, date, limit, offset } = req.query;
  res.json(await Reservation.listAll({ status, date, limit: Number(limit) || 50, offset: Number(offset) || 0 }));
});

exports.updateStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const valid = ['pending', 'confirmed', 'cancelled', 'completed'];
  if (!valid.includes(status)) { res.status(400); throw new Error('Invalid status'); }
  await Reservation.updateStatus(req.params.id, status);
  res.json({ id: req.params.id, status });
});
