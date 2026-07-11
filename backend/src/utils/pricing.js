const { pool } = require('../config/db');

// Given an array of extra IDs (as chosen by a customer on the product page),
// looks up the *real* extras from the DB and returns a priced snapshot.
// Never trusts a price/name sent by the client - always re-reads from the
// extras table so totals can't be tampered with from the browser.
async function resolveExtras(extraIds) {
  const ids = Array.isArray(extraIds) ? [...new Set(extraIds.map(Number).filter(Boolean))] : [];
  if (!ids.length) return [];
  const [rows] = await pool.query(
    'SELECT id, name_en, name_ar, price FROM extras WHERE id IN (?) AND is_available = 1',
    [ids]
  );
  return rows.map((r) => ({ id: r.id, name_en: r.name_en, name_ar: r.name_ar, price: Number(r.price) }));
}

function extrasTotal(extras) {
  return (extras || []).reduce((sum, e) => sum + Number(e.price || 0), 0);
}

module.exports = { resolveExtras, extrasTotal };
