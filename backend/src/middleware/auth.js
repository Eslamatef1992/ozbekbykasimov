const jwt = require('jsonwebtoken');
const { pool } = require('../config/db');

// Verifies the JWT and attaches req.user. Use on any protected route.
async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) return res.status(401).json({ message: 'Not authenticated' });

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const [rows] = await pool.query(
      'SELECT id, full_name, email, role, is_active FROM users WHERE id = ?',
      [payload.id]
    );
    const user = rows[0];
    if (!user || !user.is_active) return res.status(401).json({ message: 'Not authenticated' });

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

// Restricts a route to admin/staff. Use after requireAuth.
function requireAdmin(req, res, next) {
  if (!req.user || !['admin', 'staff'].includes(req.user.role)) {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
}

// Attaches req.user if a valid token is present, but never rejects the request.
// Used for routes like "book a table" that guests can also submit.
async function optionalAuth(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) return next();
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const [rows] = await pool.query(
      'SELECT id, full_name, email, role, is_active FROM users WHERE id = ?',
      [payload.id]
    );
    if (rows[0] && rows[0].is_active) req.user = rows[0];
    next();
  } catch (err) {
    next();
  }
}

module.exports = { requireAuth, requireAdmin, optionalAuth };
