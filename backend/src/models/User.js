const { pool } = require('../config/db');

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
    const [rows] = await pool.query(
      'SELECT id, full_name, email, phone, role, is_active, created_at FROM users WHERE id = ?',
      [id]
    );
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

  async setActive(id, is_active) {
    await pool.query('UPDATE users SET is_active = ? WHERE id = ?', [is_active ? 1 : 0, id]);
  },
};

module.exports = User;
