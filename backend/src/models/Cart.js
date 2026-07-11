const { pool } = require('../config/db');

function parseExtras(row) {
  if (!row) return row;
  let extras = [];
  try {
    extras = row.extras ? JSON.parse(row.extras) : [];
  } catch {
    extras = [];
  }
  return { ...row, extras };
}

const Cart = {
  async listForUser(userId) {
    const [rows] = await pool.query(
      `SELECT ci.id, ci.quantity, ci.notes, ci.extras, m.id AS menu_item_id, m.name, m.name_ar, m.price, m.image_url, m.is_available,
       c.name AS category_name
       FROM cart_items ci JOIN menu_items m ON m.id = ci.menu_item_id
       LEFT JOIN categories c ON c.id = m.category_id
       WHERE ci.user_id = ? ORDER BY ci.created_at DESC`,
      [userId]
    );
    return rows.map(parseExtras);
  },

  // extras: array of {id, name_en, name_ar, price} snapshots. Items with the
  // same menu item but different extras are kept as separate lines so each
  // combination shows and prices correctly.
  async addItem(userId, menuItemId, quantity = 1, notes = null, extras = []) {
    const extrasJson = extras && extras.length ? JSON.stringify(extras) : null;
    const [existing] = await pool.query(
      'SELECT id, quantity FROM cart_items WHERE user_id = ? AND menu_item_id = ? AND extras <=> ?',
      [userId, menuItemId, extrasJson]
    );
    if (existing[0]) {
      await pool.query('UPDATE cart_items SET quantity = quantity + ? WHERE id = ?', [quantity, existing[0].id]);
      return existing[0].id;
    }
    const [result] = await pool.query(
      'INSERT INTO cart_items (user_id, menu_item_id, quantity, notes, extras) VALUES (?, ?, ?, ?, ?)',
      [userId, menuItemId, quantity, notes, extrasJson]
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
