const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');

// GET /api/users/me
exports.me = asyncHandler(async (req, res) => {
  res.json(await User.findById(req.user.id));
});

// PATCH /api/users/me
exports.updateMe = asyncHandler(async (req, res) => {
  const { full_name, phone } = req.body;
  await User.updateProfile(req.user.id, { full_name: full_name ?? req.user.full_name, phone });
  res.json(await User.findById(req.user.id));
});

// PATCH /api/users/me/address
exports.updateAddress = asyncHandler(async (req, res) => {
  const { region, block_number, street_name, building_number, floor, flat } = req.body;
  if (!region || !block_number || !street_name || !building_number) {
    res.status(400);
    throw new Error('region, block_number, street_name and building_number are required');
  }
  await User.updateAddress(req.user.id, { region, block_number, street_name, building_number, floor, flat });
  res.json(await User.findById(req.user.id));
});

// PATCH /api/users/me/password
exports.updatePassword = asyncHandler(async (req, res) => {
  const { password, confirm } = req.body;
  if (!password || password.length < 6) {
    res.status(400);
    throw new Error('Password must be at least 6 characters');
  }
  if (password !== confirm) {
    res.status(400);
    throw new Error('Passwords do not match');
  }
  const password_hash = await bcrypt.hash(password, 10);
  await User.updatePassword(req.user.id, password_hash);
  res.json({ message: 'Password updated' });
});

// GET /api/users  (admin)
exports.list = asyncHandler(async (req, res) => {
  const { limit, offset } = req.query;
  res.json(await User.list({ limit: Number(limit) || 50, offset: Number(offset) || 0 }));
});

// PATCH /api/users/:id/active  (admin)
exports.setActive = asyncHandler(async (req, res) => {
  const { is_active } = req.body;
  await User.setActive(req.params.id, is_active);
  res.json(await User.findById(req.params.id));
});
