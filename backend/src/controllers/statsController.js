const asyncHandler = require('express-async-handler');
const { pool } = require('../config/db');

// GET /api/stats?from=YYYY-MM-DD&to=YYYY-MM-DD  (admin dashboard overview)
// Catalog counts (categories/extras/menu items/customers) are always
// all-time; order/revenue/reservation figures respect the date range when
// one is given, so the dashboard filter can narrow down to "today", "this
// week", etc. without hiding how big the catalog itself is.
exports.overview = asyncHandler(async (req, res) => {
  const { from, to } = req.query;
  const dateClauses = [];
  const dateParams = [];
  if (from) { dateClauses.push('o.created_at >= ?'); dateParams.push(`${from} 00:00:00`); }
  if (to) { dateClauses.push('o.created_at <= ?'); dateParams.push(`${to} 23:59:59`); }
  const dateWhere = dateClauses.length ? `AND ${dateClauses.join(' AND ')}` : '';

  const [[{ categories }]] = await pool.query('SELECT COUNT(*) AS categories FROM categories');
  const [[{ extras }]] = await pool.query('SELECT COUNT(*) AS extras FROM extras');
  const [[{ menuItems }]] = await pool.query('SELECT COUNT(*) AS menuItems FROM menu_items');
  const [[{ customers }]] = await pool.query("SELECT COUNT(*) AS customers FROM users WHERE role = 'customer'");

  const [[{ orders, revenue }]] = await pool.query(
    `SELECT COUNT(*) AS orders, COALESCE(SUM(total), 0) AS revenue
     FROM orders o WHERE status != 'cancelled' ${dateWhere}`,
    dateParams
  );
  const [[{ pendingOrders }]] = await pool.query(
    `SELECT COUNT(*) AS pendingOrders FROM orders o WHERE status = 'pending' ${dateWhere}`,
    dateParams
  );

  const reservationClauses = [];
  const reservationParams = [];
  if (from) { reservationClauses.push('created_at >= ?'); reservationParams.push(`${from} 00:00:00`); }
  if (to) { reservationClauses.push('created_at <= ?'); reservationParams.push(`${to} 23:59:59`); }
  const reservationWhere = reservationClauses.length ? `WHERE ${reservationClauses.join(' AND ')}` : '';
  const [[{ reservations }]] = await pool.query(
    `SELECT COUNT(*) AS reservations FROM reservations ${reservationWhere}`,
    reservationParams
  );

  const [topSelling] = await pool.query(
    `SELECT mi.id, mi.name, mi.image_url, SUM(oi.quantity) AS qty
     FROM order_items oi
     JOIN menu_items mi ON mi.id = oi.menu_item_id
     JOIN orders o ON o.id = oi.order_id AND o.status != 'cancelled' ${dateWhere}
     GROUP BY mi.id, mi.name, mi.image_url
     ORDER BY qty DESC
     LIMIT 5`,
    dateParams
  );

  res.json({
    categories, extras, menuItems, customers, orders, reservations,
    pendingOrders, revenue: Number(revenue),
    topSelling: topSelling.map((r) => ({ ...r, qty: Number(r.qty) })),
  });
});
