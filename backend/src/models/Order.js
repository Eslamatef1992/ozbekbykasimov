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
    const [rows] = await pool.query(
      `SELECT o.*, u.full_name AS customer_name, u.email AS customer_email
       FROM orders o JOIN users u ON u.id = o.user_id WHERE o.id = ?`,
      [id]
    );
    if (!rows[0]) return null;
    const [items] = await pool.query(
      `SELECT oi.*, mi.image_url, c.name AS category_name
       FROM order_items oi
       LEFT JOIN menu_items mi ON mi.id = oi.menu_item_id
       LEFT JOIN categories c ON c.id = mi.category_id
       WHERE oi.order_id = ?`,
      [id]
    );
    return { ...rows[0], items };
  },

  async listForUser(userId) {
    const [rows] = await pool.query('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC', [userId]);
    if (!rows.length) return rows;
    const ids = rows.map((r) => r.id);
    const [items] = await pool.query(
      `SELECT oi.order_id, oi.item_name, oi.quantity, oi.unit_price, oi.line_total, mi.image_url, c.name AS category_name
       FROM order_items oi
       LEFT JOIN menu_items mi ON mi.id = oi.menu_item_id
       LEFT JOIN categories c ON c.id = mi.category_id
       WHERE oi.order_id IN (?)`,
      [ids]
    );
    const byOrder = {};
    for (const it of items) {
      (byOrder[it.order_id] ||= []).push(it);
    }
    return rows.map((r) => ({ ...r, items: byOrder[r.id] || [] }));
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
