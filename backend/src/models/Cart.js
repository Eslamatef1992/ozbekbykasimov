const { pool } = require('../config/db');

const Cart = {
  async listForUser(userId) {
    const [rows] = await pool.query(
      `SELECT ci.id, ci.quantity, ci.notes, m.id AS menu_item_id, m.name, m.price, m.image_url, m.is_available
       FROM cart_items ci JOIN menu_items m ON m.id = ci.menu_item_id
       WHERE ci.user_id = ? ORDER BY ci.created_at DESC`,
      [userId]
    );
    return rows;
  },

  async addItem(userId, menuItemId, quantity = 1, notes = null) {
    const [existing] = await pool.query(
      'SELECT id, quantity FROM cart_items WHERE user_id = ? AND menu_item_id = ?',
      [userId, menuItemId]
    );
    if (existing[0]) {
      await pool.query('UPDATE cart_items SET quantity = quantity + ? WHERE id = ?', [quantity, existing[0].id]);
      return existing[0].id;
    }
    const [result] = await pool.query(
      'INSERT INTO cart_items (user_id, menu_item_id, quantity, notes) VALUES (?, ?, ?, ?)',
      [userId, menuItemId, quantity, notes]
    );
    return result.insertId;
  },

  async updateQuantity(userId, cartItemId, quantity) {
    await pool.query('UPDATE cart_items SET quantity = ? WHERE id = ? AND user_id = ?', [quantity, cartItemId, userId]);
  },

  async removeItem(userId, cartItemId) {
    await pool.query('DELETE FROM cart_items WHERE id = ? AND user_id = ?', [cartItemId, userId]);
  },

  async clear(userId) {
    await pool.query('DELETE FROM cart_items WHERE user_id = ?', [userId]);
  },
};

module.exports = Cart;
