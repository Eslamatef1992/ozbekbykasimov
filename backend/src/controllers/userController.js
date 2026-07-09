const asyncHandler = require('express-async-handler');
const User = require('../models/User');

// PATCH /api/users/me
exports.updateMe = asyncHandler(async (req, res) => {
  const { full_name, phone } = req.body;
  await User.updateProfile(req.user.id, { full_name: full_name ?? req.user.full_name, phone });
  res.json(await User.findById(req.user.id));
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
