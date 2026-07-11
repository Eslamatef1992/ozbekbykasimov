const { pool } = require('../config/db');

const Extra = {
  async list({ onlyAvailable = false } = {}) {
    const where = onlyAvailable ? 'WHERE is_available = 1' : '';
    const [rows] = await pool.query(`SELECT * FROM extras ${where} ORDER BY name_en ASC`);
    return rows;
  },

  async findById(id) {
    const [rows] = await pool.query('SELECT * FROM extras WHERE id = ?', [id]);
    return rows[0] || null;
  },

  async create({ name_en, name_ar, price, is_available = 1 }) {
    const [result] = await pool.query(
      'INSERT INTO extras (name_en, name_ar, price, is_available) VALUES (?, ?, ?, ?)',
      [name_en, name_ar || null, price || 0, is_available ? 1 : 0]
    );
    return result.insertId;
  },

  async update(id, { name_en, name_ar, price, is_available }) {
    await pool.query(
      'UPDATE extras SET name_en=?, name_ar=?, price=?, is_available=? WHERE id=?',
      [name_en, name_ar || null, price || 0, is_available ? 1 : 0, id]
    );
  },

  async remove(id) {
    await pool.query('DELETE FROM extras WHERE id = ?', [id]);
  },
};

module.exports = Extra;
