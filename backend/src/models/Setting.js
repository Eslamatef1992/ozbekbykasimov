const { pool } = require('../config/db');

const Setting = {
  async getAll() {
    const [rows] = await pool.query('SELECT setting_key, setting_value FROM site_settings');
    return rows.reduce((acc, r) => ({ ...acc, [r.setting_key]: r.setting_value }), {});
  },
  async set(key, value) {
    await pool.query(
      'INSERT INTO site_settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = ?',
      [key, value, value]
    );
  },
  async setMany(obj) {
    const entries = Object.entries(obj);
    for (const [key, value] of entries) {
      await Setting.set(key, value);
    }
  },
};

module.exports = Setting;
