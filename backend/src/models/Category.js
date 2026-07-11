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
  async create({ name, name_ar, slug, image_url, sort_order = 0 }) {
    const [result] = await pool.query(
      'INSERT INTO categories (name, name_ar, slug, image_url, sort_order) VALUES (?, ?, ?, ?, ?)',
      [name, name_ar || null, slug, image_url || null, sort_order]
    );
    return result.insertId;
  },
  async update(id, { name, name_ar, slug, image_url, sort_order, is_active }) {
    await pool.query(
      'UPDATE categories SET name = ?, name_ar = ?, slug = ?, image_url = ?, sort_order = ?, is_active = ? WHERE id = ?',
      [name, name_ar || null, slug, image_url || null, sort_order, is_active ? 1 : 0, id]
    );
  },
  async remove(id) {
    await pool.query('DELETE FROM categories WHERE id = ?', [id]);
  },
};

module.exports = Category;
