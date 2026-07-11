const { pool } = require('../config/db');

const Coupon = {
  async list() {
    const [rows] = await pool.query('SELECT * FROM coupons ORDER BY created_at DESC');
    return rows;
  },

  async findByCode(code) {
    const [rows] = await pool.query('SELECT * FROM coupons WHERE code = ?', [code]);
    return rows[0] || null;
  },

  async findById(id) {
    const [rows] = await pool.query('SELECT * FROM coupons WHERE id = ?', [id]);
    return rows[0] || null;
  },

  async create({ code, type, value, min_order_value, max_uses, is_active, expires_at }) {
    const [result] = await pool.query(
      `INSERT INTO coupons (code, type, value, min_order_value, max_uses, is_active, expires_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [code.trim().toUpperCase(), type, value, min_order_value || 0, max_uses || null, is_active ? 1 : 0, expires_at || null]
    );
    return result.insertId;
  },

  async update(id, { code, type, value, min_order_value, max_uses, is_active, expires_at }) {
    await pool.query(
      `UPDATE coupons SET code=?, type=?, value=?, min_order_value=?, max_uses=?, is_active=?, expires_at=? WHERE id=?`,
      [code.trim().toUpperCase(), type, value, min_order_value || 0, max_uses || null, is_active ? 1 : 0, expires_at || null, id]
    );
  },

  async remove(id) {
    await pool.query('DELETE FROM coupons WHERE id = ?', [id]);
  },

  async incrementUsage(conn, id) {
    await conn.query('UPDATE coupons SET used_count = used_count + 1 WHERE id = ?', [id]);
  },

  // Validates a coupon against a subtotal and returns the discount amount.
  // Throws { status, message } style errors the controller can surface directly.
  async validate(code, subtotal) {
    if (!code) return null;
    const coupon = await Coupon.findByCode(code.trim().toUpperCase());
    if (!coupon || !coupon.is_active) {
      const err = new Error('Coupon code is not valid'); err.status = 400; throw err;
    }
    if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
      const err = new Error('Coupon has expired'); err.status = 400; throw err;
    }
    if (coupon.max_uses != null && coupon.used_count >= coupon.max_uses) {
      const err = new Error('Coupon has reached its usage limit'); err.status = 400; throw err;
    }
    if (Number(subtotal) < Number(coupon.min_order_value)) {
      const err = new Error(`Minimum order of ${Number(coupon.min_order_value).toFixed(0)} Kd required for this coupon`);
      err.status = 400; throw err;
    }
    const discount = coupon.type === 'percent'
      ? Number(subtotal) * (Number(coupon.value) / 100)
      : Number(coupon.value);
    return { coupon, discount_amount: Math.min(discount, Number(subtotal)) };
  },
};

module.exports = Coupon;
