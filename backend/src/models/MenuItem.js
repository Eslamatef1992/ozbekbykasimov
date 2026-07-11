const { pool } = require('../config/db');

const MenuItem = {
  async list({ categoryId, onlyAvailable = false, search } = {}) {
    const clauses = [];
    const params = [];
    if (categoryId) {
      clauses.push('m.category_id = ?');
      params.push(categoryId);
    }
    if (onlyAvailable) clauses.push('m.is_available = 1');
    if (search) {
      clauses.push('(m.name LIKE ? OR m.description LIKE ?)');
      params.push(`%${search}%`, `%${search}%`);
    }
    const where = clauses.length ? `WHERE ${clauses.join(' AND ')}` : '';
    const [rows] = await pool.query(
      `SELECT m.*, c.name AS category_name, c.slug AS category_slug
       FROM menu_items m JOIN categories c ON c.id = m.category_id
       ${where} ORDER BY m.sort_order ASC, m.name ASC`,
      params
    );
    return rows;
  },

  async findById(id) {
    const [rows] = await pool.query(
      `SELECT m.*, c.name AS category_name, c.slug AS category_slug
       FROM menu_items m JOIN categories c ON c.id = m.category_id WHERE m.id = ?`,
      [id]
    );
    return rows[0] || null;
  },

  async findBySlug(slug) {
    const [rows] = await pool.query(
      `SELECT m.*, c.name AS category_name, c.slug AS category_slug
       FROM menu_items m JOIN categories c ON c.id = m.category_id WHERE m.slug = ?`,
      [slug]
    );
    return rows[0] || null;
  },

  // Gallery sub-images, in addition to the main image_url.
  async getImages(menuItemId) {
    const [rows] = await pool.query(
      'SELECT id, image_url, sort_order FROM menu_item_images WHERE menu_item_id = ? ORDER BY sort_order ASC, id ASC',
      [menuItemId]
    );
    return rows;
  },

  async addImage(menuItemId, imageUrl, sortOrder = 0) {
    const [result] = await pool.query(
      'INSERT INTO menu_item_images (menu_item_id, image_url, sort_order) VALUES (?, ?, ?)',
      [menuItemId, imageUrl, sortOrder]
    );
    return result.insertId;
  },

  async removeImage(imageId, menuItemId) {
    await pool.query('DELETE FROM menu_item_images WHERE id = ? AND menu_item_id = ?', [imageId, menuItemId]);
  },

  // Extras assigned to this menu item (the admin-selected add-on list).
  async getExtras(menuItemId) {
    const [rows] = await pool.query(
      `SELECT e.* FROM menu_item_extras mie JOIN extras e ON e.id = mie.extra_id
       WHERE mie.menu_item_id = ? ORDER BY e.name_en ASC`,
      [menuItemId]
    );
    return rows;
  },

  async setExtras(menuItemId, extraIds) {
    await pool.query('DELETE FROM menu_item_extras WHERE menu_item_id = ?', [menuItemId]);
    const ids = Array.isArray(extraIds) ? [...new Set(extraIds.map(Number).filter(Boolean))] : [];
    if (!ids.length) return;
    const values = ids.map((extraId) => [menuItemId, extraId]);
    await pool.query('INSERT INTO menu_item_extras (menu_item_id, extra_id) VALUES ?', [values]);
  },

  async create(data) {
    const {
      category_id, name, name_ar, slug, description, description_ar, price, image_url,
      has_extras = 0, is_featured = 0, sort_order = 0,
    } = data;
    const [result] = await pool.query(
      `INSERT INTO menu_items (category_id, name, name_ar, slug, description, description_ar, price, image_url, has_extras, is_featured, sort_order)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [category_id, name, name_ar || null, slug, description || null, description_ar || null, price,
        image_url || null, has_extras ? 1 : 0, is_featured ? 1 : 0, sort_order]
    );
    return result.insertId;
  },

  async update(id, data) {
    const {
      category_id, name, name_ar, slug, description, description_ar, price, image_url,
      has_extras, is_available, is_featured, sort_order,
    } = data;
    await pool.query(
      `UPDATE menu_items SET category_id=?, name=?, name_ar=?, slug=?, description=?, description_ar=?, price=?, image_url=?,
       has_extras=?, is_available=?, is_featured=?, sort_order=? WHERE id=?`,
      [category_id, name, name_ar || null, slug, description || null, description_ar || null, price,
        image_url || null, has_extras ? 1 : 0, is_available ? 1 : 0, is_featured ? 1 : 0, sort_order, id]
    );
  },

  async remove(id) {
    await pool.query('DELETE FROM menu_items WHERE id = ?', [id]);
  },
};

module.exports = MenuItem;
