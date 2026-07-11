const { pool } = require('../config/db');

function parseItemExtras(row) {
  if (!row) return row;
  let extras = [];
  try {
    extras = row.extras ? JSON.parse(row.extras) : [];
  } catch {
    extras = [];
  }
  return { ...row, extras };
}

const Order = {
  async create(conn, orderData) {
    const {
      user_id, guest_name, guest_email, guest_phone,
      fulfillment_type, payment_method, subtotal, delivery_fee,
      coupon_code, discount_amount, total,
      delivery_address, delivery_city, delivery_area_id, delivery_notes, contact_phone,
    } = orderData;
    const [result] = await conn.query(
      `INSERT INTO orders (user_id, guest_name, guest_email, guest_phone, fulfillment_type, payment_method,
       subtotal, delivery_fee, coupon_code, discount_amount, total,
       delivery_address, delivery_city, delivery_area_id, delivery_notes, contact_phone)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [user_id || null, guest_name || null, guest_email || null, guest_phone || null,
        fulfillment_type, payment_method, subtotal, delivery_fee,
        coupon_code || null, discount_amount || 0, total,
        delivery_address || null, delivery_city || null, delivery_area_id || null, delivery_notes || null, contact_phone || null]
    );
    return result.insertId;
  },

  async addItem(conn, orderId, item) {
    const { menu_item_id, item_name, unit_price, quantity, line_total, extras } = item;
    await conn.query(
      `INSERT INTO order_items (order_id, menu_item_id, item_name, unit_price, quantity, line_total, extras)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [orderId, menu_item_id, item_name, unit_price, quantity, line_total, extras ? JSON.stringify(extras) : null]
    );
  },

  async findById(id) {
    const [rows] = await pool.query(
      `SELECT o.*,
       COALESCE(u.full_name, o.guest_name) AS customer_name,
       COALESCE(u.email, o.guest_email) AS customer_email
       FROM orders o LEFT JOIN users u ON u.id = o.user_id WHERE o.id = ?`,
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
    return { ...rows[0], items: items.map(parseItemExtras) };
  },

  async listForUser(userId) {
    const [rows] = await pool.query('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC', [userId]);
    if (!rows.length) return rows;
    const ids = rows.map((r) => r.id);
    const [items] = await pool.query(
      `SELECT oi.order_id, oi.item_name, oi.quantity, oi.unit_price, oi.line_total, oi.extras, mi.image_url, c.name AS category_name
       FROM order_items oi
       LEFT JOIN menu_items mi ON mi.id = oi.menu_item_id
       LEFT JOIN categories c ON c.id = mi.category_id
       WHERE oi.order_id IN (?)`,
      [ids]
    );
    const byOrder = {};
    for (const it of items.map(parseItemExtras)) {
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
      `SELECT o.*,
       COALESCE(u.full_name, o.guest_name) AS full_name,
       COALESCE(u.email, o.guest_email) AS email,
       COALESCE(o.contact_phone, o.guest_phone, u.phone) AS client_phone,
       (o.user_id IS NULL) AS is_guest
       FROM orders o LEFT JOIN users u ON u.id = o.user_id
       ${where} ORDER BY o.created_at DESC LIMIT ? OFFSET ?`,
      params
    );
    if (!rows.length) return rows;
    const ids = rows.map((r) => r.id);
    const [items] = await pool.query(
      `SELECT order_id, item_name, quantity, unit_price, line_total, extras
       FROM order_items WHERE order_id IN (?)`,
      [ids]
    );
    const byOrder = {};
    for (const it of items.map(parseItemExtras)) {
      (byOrder[it.order_id] ||= []).push(it);
    }
    return rows.map((r) => ({ ...r, items: byOrder[r.id] || [] }));
  },

  async updateStatus(id, status) {
    await pool.query('UPDATE orders SET status = ? WHERE id = ?', [status, id]);
  },

  async updatePaymentStatus(id, payment_status) {
    await pool.query('UPDATE orders SET payment_status = ? WHERE id = ?', [payment_status, id]);
  },
};

module.exports = Order;
