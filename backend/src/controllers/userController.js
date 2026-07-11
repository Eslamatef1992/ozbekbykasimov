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
  const { limit, offset, role } = req.query;
  res.json(await User.list({ limit: Number(limit) || 50, offset: Number(offset) || 0, role }));
});

// PATCH /api/users/:id/active  (admin)
exports.setActive = asyncHandler(async (req, res) => {
  const { is_active } = req.body;
  await User.setActive(req.params.id, is_active);
  res.json(await User.findById(req.params.id));
});

// Note: delivery fees are intentionally NOT a staff-assignable permission -
// only the true "admin" role can manage them (see requireSuperAdmin).
const PERMISSION_KEYS = ['menu', 'orders', 'reservations', 'coupons', 'cms', 'extras', 'admins'];

// GET /api/users/admins  (admin/admins permission) - list admin+staff accounts only
exports.listAdmins = asyncHandler(async (req, res) => {
  const admins = await User.list({ limit: 200, offset: 0, role: 'admin' });
  const staff = await User.list({ limit: 200, offset: 0, role: 'staff' });
  res.json([...admins, ...staff]);
});

// POST /api/users/admins  (admin/admins permission) - create a new admin or
// restricted "staff" account with a set of permission "rules".
exports.createAdmin = asyncHandler(async (req, res) => {
  const { full_name, email, phone, password, role, permissions } = req.body;
  if (!full_name || !email || !password) {
    res.status(400);
    throw new Error('full_name, email and password are required');
  }
  if (!['admin', 'staff'].includes(role)) {
    res.status(400);
    throw new Error("role must be 'admin' or 'staff'");
  }
  const existing = await User.findByEmail(email);
  if (existing) {
    res.status(409);
    throw new Error('An account with this email already exists');
  }
  const cleanPermissions = role === 'staff'
    ? (Array.isArray(permissions) ? permissions.filter((p) => PERMISSION_KEYS.includes(p)) : [])
    : null;
  const password_hash = await bcrypt.hash(password, 10);
  const id = await User.create({ full_name, email, phone, password_hash, role, permissions: cleanPermissions });
  res.status(201).json(await User.findById(id));
});

// PATCH /api/users/:id/permissions  (admin/admins permission) - change an
// existing staff/admin account's role or permission rules.
exports.updatePermissions = asyncHandler(async (req, res) => {
  const target = await User.findById(req.params.id);
  if (!target) { res.status(404); throw new Error('User not found'); }
  if (!['admin', 'staff'].includes(target.role)) {
    res.status(400);
    throw new Error('Can only edit permissions for admin/staff accounts');
  }
  const role = ['admin', 'staff'].includes(req.body.role) ? req.body.role : target.role;
  const permissions = role === 'staff'
    ? (Array.isArray(req.body.permissions) ? req.body.permissions.filter((p) => PERMISSION_KEYS.includes(p)) : target.permissions)
    : null;
  await User.setRoleAndPermissions(req.params.id, { role, permissions });
  res.json(await User.findById(req.params.id));
});
