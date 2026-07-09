const { pool } = require('../config/db');

const Reservation = {
  async create(data) {
    const { user_id, full_name, phone, email, party_size, reservation_date, reservation_time, notes } = data;
    const [result] = await pool.query(
      `INSERT INTO reservations (user_id, full_name, phone, email, party_size, reservation_date, reservation_time, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [user_id || null, full_name, phone, email || null, party_size, reservation_date, reservation_time, notes || null]
    );
    return result.insertId;
  },

  async listForUser(userId) {
    const [rows] = await pool.query('SELECT * FROM reservations WHERE user_id = ? ORDER BY reservation_date DESC', [userId]);
    return rows;
  },

  async listAll({ status, date, limit = 50, offset = 0 } = {}) {
    const clauses = [];
    const params = [];
    if (status) {
      clauses.push('status = ?');
      params.push(status);
    }
    if (date) {
      clauses.push('reservation_date = ?');
      params.push(date);
    }
    const where = clauses.length ? `WHERE ${clauses.join(' AND ')}` : '';
    params.push(limit, offset);
    const [rows] = await pool.query(
      `SELECT * FROM reservations ${where} ORDER BY reservation_date DESC, reservation_time DESC LIMIT ? OFFSET ?`,
      params
    );
    return rows;
  },

  async updateStatus(id, status) {
    await pool.query('UPDATE reservations SET status = ? WHERE id = ?', [status, id]);
  },
};

module.exports = Reservation;
