const { pool } = require('../config/db');

const Order = {
  async create(conn, orderData) {
    const {
      user_id, fulfillment_type, payment_method, subtotal, delivery_fee, total,
      delivery_address, delivery_city, delivery_notes, contact_phone,
    } = orderData;
    const [result] = await conn.query(
      `INSERT INTO orders (user_id, fulfillment_type, payment_method, subtotal, delivery_fee, total,
       delivery_address, delivery_city, delivery_notes, contact_phone)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [user_id, fulfillment_type, payment_method, subtotal, delivery_fee, total,
        delivery_address || null, delivery_city || null, delivery_notes || null, contact_phone || null]
    );
    return result.insertId;
  },

  async addItem(conn, orderId, item) {
    const { menu_item_id, item_name, unit_price, quantity, line_total } = item;
    await conn.query(
      `INSERT INTO order_items (order_id, menu_item_id, item_name, unit_price, quantity, line_total)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [orderId, menu_item_id, item_name, unit_price, quantity, line_total]
    );
  },

  async findById(id) {
    const [rows] = await pool.query('SELECT * FROM orders WHERE id = ?', [id]);
    if (!rows[0]) return null;
    const [items] = await pool.query('SELECT * FROM order_items WHERE order_id = ?', [id]);
    return { ...rows[0], items };
  },

  async listForUser(userId) {
    const [rows] = await pool.query('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC', [userId]);
    return rows;
  },

  async listAll({ status, limit = 50, offset = 0 } = {}) {
    const clauses = [];
    const params = [];
    if (status) {
      clauses.push('o.status = ?');
      params.push(status);
    }
    const where = clauses.length ? `WHERE ${clauses.join(' AND ')}` : '';
    params.push(limit, offset);
    const [rows] = await pool.query(
      `SELECT o.*, u.full_name, u.email FROM orders o JOIN users u ON u.id = o.user_id
       ${where} ORDER BY o.created_at DESC LIMIT ? OFFSET ?`,
      params
    );
    return rows;
  },

  async updateStatus(id, status) {
    await pool.query('UPDATE orders SET status = ? WHERE id = ?', [status, id]);
  },

  async updatePaymentStatus(id, payment_status) {
    await pool.query('UPDATE orders SET payment_status = ? WHERE id = ?', [payment_status, id]);
  },
};

module.exports = Order;
