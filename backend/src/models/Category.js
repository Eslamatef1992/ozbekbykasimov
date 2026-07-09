const { pool } = require('../config/db');

const Category = {
  async list({ onlyActive = false } = {}) {
    const where = onlyActive ? 'WHERE is_active = 1' : '';
    const [rows] = await pool.query(`SELECT * FROM categories ${where} ORDER BY sort_order ASC, name ASC`);
    return rows;
  },
  async findById(id) {
    const [rows] = await pool.query('SELECT * FROM categories WHERE id = ?', [id]);
    return rows[0] || null;
  },
  async create({ name, slug, sort_order = 0 }) {
    const [result] = await pool.query(
      'INSERT INTO categories (name, slug, sort_order) VALUES (?, ?, ?)',
      [name, slug, sort_order]
    );
    return result.insertId;
  },
  async update(id, { name, slug, sort_order, is_active }) {
    await pool.query(
      'UPDATE categories SET name = ?, slug = ?, sort_order = ?, is_active = ? WHERE id = ?',
      [name, slug, sort_order, is_active ? 1 : 0, id]
    );
  },
  async remove(id) {
    await pool.query('DELETE FROM categories WHERE id = ?', [id]);
  },
};

module.exports = Category;
