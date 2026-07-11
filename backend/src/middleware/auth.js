const jwt = require('jsonwebtoken');
const { pool } = require('../config/db');

function parsePermissions(user) {
  if (!user) return user;
  let permissions = [];
  try {
    permissions = user.permissions ? JSON.parse(user.permissions) : [];
  } catch {
    permissions = [];
  }
  return { ...user, permissions };
}

// Verifies the JWT and attaches req.user. Use on any protected route.
async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) return res.status(401).json({ message: 'Not authenticated' });

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const [rows] = await pool.query(
      'SELECT id, full_name, email, role, is_active, permissions FROM users WHERE id = ?',
      [payload.id]
    );
    const user = rows[0];
    if (!user || !user.is_active) return res.status(401).json({ message: 'Not authenticated' });

    req.user = parsePermissions(user);
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

// Restricts a route to the true "admin" role only - staff accounts are
// rejected even if they have every permission rule checked. Used for
// sensitive settings (like delivery fees) that shouldn't be delegable.
function requireSuperAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Super admin access required' });
  }
  next();
}

// Restricts a route to admins with a specific permission "rule". role='admin'
// always has full access; role='staff' is checked against their permissions
// JSON array (set via the Admins & Rules admin page). Use after requireAuth
// + requireAdmin (or standalone, since it implies admin access is required).
function requirePermission(key) {
  return (req, res, next) => {
    if (!req.user || !['admin', 'staff'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Admin access required' });
    }
    if (req.user.role === 'admin') return next();
    const perms = Array.isArray(req.user.permissions) ? req.user.permissions : [];
    if (!perms.includes(key)) {
      return res.status(403).json({ message: `Missing permission: ${key}` });
    }
    next();
  };
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
      'SELECT id, full_name, email, role, is_active, permissions FROM users WHERE id = ?',
      [payload.id]
    );
    if (rows[0] && rows[0].is_active) req.user = parsePermissions(rows[0]);
    next();
  } catch (err) {
    next();
  }
}

module.exports = { requireAuth, requireAdmin, requireSuperAdmin, requirePermission, optionalAuth };
