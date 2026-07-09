const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');

function signToken(user) {
  return jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
}

function publicUser(u) {
  return { id: u.id, full_name: u.full_name, email: u.email, phone: u.phone, role: u.role };
}

// POST /api/auth/register
exports.register = asyncHandler(async (req, res) => {
  const { full_name, email, phone, password } = req.body;
  if (!full_name || !email || !password) {
    res.status(400);
    throw new Error('full_name, email and password are required');
  }
  const existing = await User.findByEmail(email);
  if (existing) {
    res.status(409);
    throw new Error('An account with this email already exists');
  }
  const password_hash = await bcrypt.hash(password, 10);
  const id = await User.create({ full_name, email, phone, password_hash });
  const user = await User.findById(id);
  const token = signToken(user);
  res.status(201).json({ token, user: publicUser(user) });
});

// POST /api/auth/login
exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findByEmail(email);
  if (!user || !(await bcrypt.compare(password, user.password_hash))) {
    res.status(401);
    throw new Error('Invalid email or password');
  }
  if (!user.is_active) {
    res.status(403);
    throw new Error('This account has been deactivated');
  }
  const token = signToken(user);
  res.json({ token, user: publicUser(user) });
});

// GET /api/auth/me
exports.me = asyncHandler(async (req, res) => {
  res.json({ user: req.user });
});
