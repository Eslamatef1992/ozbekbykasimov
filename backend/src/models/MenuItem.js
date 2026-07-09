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

  async create(data) {
    const { category_id, name, slug, description, price, image_url, is_featured = 0, sort_order = 0 } = data;
    const [result] = await pool.query(
      `INSERT INTO menu_items (category_id, name, slug, description, price, image_url, is_featured, sort_order)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [category_id, name, slug, description || null, price, image_url || null, is_featured ? 1 : 0, sort_order]
    );
    return result.insertId;
  },

  async update(id, data) {
    const { category_id, name, slug, description, price, image_url, is_available, is_featured, sort_order } = data;
    await pool.query(
      `UPDATE menu_items SET category_id=?, name=?, slug=?, description=?, price=?, image_url=?,
       is_available=?, is_featured=?, sort_order=? WHERE id=?`,
      [category_id, name, slug, description || null, price, image_url || null,
        is_available ? 1 : 0, is_featured ? 1 : 0, sort_order, id]
    );
  },

  async remove(id) {
    await pool.query('DELETE FROM menu_items WHERE id = ?', [id]);
  },
};

module.exports = MenuItem;
