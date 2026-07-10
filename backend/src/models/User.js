const { pool } = require('../config/db');

const PROFILE_FIELDS =
  'id, full_name, email, phone, role, is_active, region, block_number, street_name, building_number, floor, flat, created_at';

const User = {
  async create({ full_name, email, phone, password_hash, role = 'customer' }) {
    const [result] = await pool.query(
      'INSERT INTO users (full_name, email, phone, password_hash, role) VALUES (?, ?, ?, ?, ?)',
      [full_name, email, phone || null, password_hash, role]
    );
    return result.insertId;
  },

  async findByEmail(email) {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0] || null;
  },

  async findById(id) {
    const [rows] = await pool.query(`SELECT ${PROFILE_FIELDS} FROM users WHERE id = ?`, [id]);
    return rows[0] || null;
  },

  async list({ limit = 50, offset = 0 } = {}) {
    const [rows] = await pool.query(
      'SELECT id, full_name, email, phone, role, is_active, created_at FROM users ORDER BY created_at DESC LIMIT ? OFFSET ?',
      [limit, offset]
    );
    return rows;
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
};

module.exports = User;
