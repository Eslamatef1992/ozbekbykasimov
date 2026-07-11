const { pool } = require('../config/db');

const PROFILE_FIELDS =
  'id, full_name, email, phone, role, is_active, permissions, region, block_number, street_name, building_number, floor, flat, created_at';

function parsePermissions(row) {
  if (!row) return row;
  let permissions = [];
  try {
    permissions = row.permissions ? JSON.parse(row.permissions) : [];
  } catch {
    permissions = [];
  }
  return { ...row, permissions };
}

const User = {
  async create({ full_name, email, phone, password_hash, role = 'customer', permissions = null }) {
    const [result] = await pool.query(
      'INSERT INTO users (full_name, email, phone, password_hash, role, permissions) VALUES (?, ?, ?, ?, ?, ?)',
      [full_name, email, phone || null, password_hash, role, permissions ? JSON.stringify(permissions) : null]
    );
    return result.insertId;
  },

  async findByEmail(email) {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0] || null;
  },

  async findById(id) {
    const [rows] = await pool.query(`SELECT ${PROFILE_FIELDS} FROM users WHERE id = ?`, [id]);
    return parsePermissions(rows[0]) || null;
  },

  async list({ limit = 50, offset = 0, role } = {}) {
    const clauses = [];
    const params = [];
    if (role) { clauses.push('u.role = ?'); params.push(role); }
    const where = clauses.length ? `WHERE ${clauses.join(' AND ')}` : '';
    params.push(limit, offset);
    const [rows] = await pool.query(
      `SELECT u.id, u.full_name, u.email, u.phone, u.role, u.is_active, u.permissions, u.created_at,
       u.region, u.block_number, u.street_name, u.building_number, u.floor, u.flat,
       (SELECT COUNT(*) FROM orders o WHERE o.user_id = u.id) AS order_count,
       (SELECT COUNT(*) FROM reservations r WHERE r.user_id = u.id) AS reservation_count
       FROM users u
       ${where} ORDER BY u.created_at DESC LIMIT ? OFFSET ?`,
      params
    );
    return rows.map(parsePermissions);
  },

  async updateProfile(id, { full_name, phone }) {
    await pool.query('UPDATE users SET full_name = ?, phone = ? WHERE id = ?', [full_name, phone, id]);
  },

  async updateAddress(id, { region, block_number, street_name, building_number, floor, flat }) {
    await pool.query(
      `UPDATE users SET region = ?, block_number = ?, street_name = ?, building_number = ?, floor = ?, flat = ?
       WHERE id = ?`,
      [region || null, block_number || null, street_name || null, building_number || null, floor || null, flat || null, id]
    );
  },

  async updatePassword(id, password_hash) {
    await pool.query('UPDATE users SET password_hash = ? WHERE id = ?', [password_hash, id]);
  },

  async setActive(id, is_active) {
    await pool.query('UPDATE users SET is_active = ? WHERE id = ?', [is_active ? 1 : 0, id]);
  },

  async setRoleAndPermissions(id, { role, permissions }) {
    await pool.query('UPDATE users SET role = ?, permissions = ? WHERE id = ?', [
      role, permissions ? JSON.stringify(permissions) : null, id,
    ]);
  },
};

module.exports = User;
