const { pool } = require('../config/db');

const DeliveryArea = {
  async list({ onlyActive = false } = {}) {
    const where = onlyActive ? 'WHERE is_active = 1' : '';
    const [rows] = await pool.query(`SELECT * FROM delivery_areas ${where} ORDER BY sort_order ASC, name_en ASC`);
    return rows;
  },
  async findById(id) {
    const [rows] = await pool.query('SELECT * FROM delivery_areas WHERE id = ?', [id]);
    return rows[0] || null;
  },
  async create({ name_en, name_ar, fee, sort_order = 0 }) {
    const [result] = await pool.query(
      'INSERT INTO delivery_areas (name_en, name_ar, fee, sort_order) VALUES (?, ?, ?, ?)',
      [name_en, name_ar || null, fee, sort_order]
    );
    return result.insertId;
  },
  async update(id, { name_en, name_ar, fee, sort_order, is_active }) {
    await pool.query(
      'UPDATE delivery_areas SET name_en = ?, name_ar = ?, fee = ?, sort_order = ?, is_active = ? WHERE id = ?',
      [name_en, name_ar || null, fee, sort_order, is_active ? 1 : 0, id]
    );
  },
  async remove(id) {
    await pool.query('DELETE FROM delivery_areas WHERE id = ?', [id]);
  },
};

module.exports = DeliveryArea;
