// Adds everything needed for: admin permissions/rules, guest orders,
// discount coupons, menu item i18n (name_ar/description_ar), extras,
// menu item image galleries, extras snapshots on cart/order items, and
// per-area delivery fees.
// Safe to run multiple times (skips columns/tables that already exist).
// Usage: node src/utils/migrate-modules.js
const mysql = require('mysql2/promise');
require('dotenv').config();

const COLUMNS = [
  ['users', 'permissions', 'TEXT NULL'],
  ['menu_items', 'name_ar', 'VARCHAR(150) NULL'],
  ['menu_items', 'description_ar', 'TEXT NULL'],
  ['menu_items', 'has_extras', 'TINYINT(1) NOT NULL DEFAULT 0'],
  ['cart_items', 'extras', 'TEXT NULL'],
  ['orders', 'guest_name', 'VARCHAR(150) NULL'],
  ['orders', 'guest_email', 'VARCHAR(150) NULL'],
  ['orders', 'guest_phone', 'VARCHAR(30) NULL'],
  ['orders', 'coupon_code', 'VARCHAR(50) NULL'],
  ['orders', 'discount_amount', 'DECIMAL(10,2) NOT NULL DEFAULT 0'],
  ['order_items', 'extras', 'TEXT NULL'],
  ['categories', 'name_ar', 'VARCHAR(100) NULL'],
  ['categories', 'image_url', 'VARCHAR(500) NULL'],
  ['orders', 'delivery_area_id', 'INT NULL'],
];

const TABLES = [
  {
    name: 'menu_item_images',
    sql: `CREATE TABLE IF NOT EXISTS menu_item_images (
      id INT AUTO_INCREMENT PRIMARY KEY,
      menu_item_id INT NOT NULL,
      image_url VARCHAR(500) NOT NULL,
      sort_order INT DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (menu_item_id) REFERENCES menu_items(id) ON DELETE CASCADE
    ) ENGINE=InnoDB`,
  },
  {
    name: 'extras',
    sql: `CREATE TABLE IF NOT EXISTS extras (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name_en VARCHAR(100) NOT NULL,
      name_ar VARCHAR(100),
      price DECIMAL(10,2) NOT NULL DEFAULT 0,
      is_available TINYINT(1) NOT NULL DEFAULT 1,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB`,
  },
  {
    name: 'menu_item_extras',
    sql: `CREATE TABLE IF NOT EXISTS menu_item_extras (
      menu_item_id INT NOT NULL,
      extra_id INT NOT NULL,
      PRIMARY KEY (menu_item_id, extra_id),
      FOREIGN KEY (menu_item_id) REFERENCES menu_items(id) ON DELETE CASCADE,
      FOREIGN KEY (extra_id) REFERENCES extras(id) ON DELETE CASCADE
    ) ENGINE=InnoDB`,
  },
  {
    name: 'coupons',
    sql: `CREATE TABLE IF NOT EXISTS coupons (
      id INT AUTO_INCREMENT PRIMARY KEY,
      code VARCHAR(50) NOT NULL UNIQUE,
      type ENUM('percent','fixed') NOT NULL DEFAULT 'percent',
      value DECIMAL(10,2) NOT NULL,
      min_order_value DECIMAL(10,2) NOT NULL DEFAULT 0,
      max_uses INT NULL,
      used_count INT NOT NULL DEFAULT 0,
      is_active TINYINT(1) NOT NULL DEFAULT 1,
      expires_at DATETIME NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB`,
  },
  {
    name: 'delivery_areas',
    sql: `CREATE TABLE IF NOT EXISTS delivery_areas (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name_en VARCHAR(100) NOT NULL,
      name_ar VARCHAR(100),
      fee DECIMAL(10,2) NOT NULL DEFAULT 0,
      sort_order INT DEFAULT 0,
      is_active TINYINT(1) NOT NULL DEFAULT 1,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB`,
  },
];

(async () => {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });
  try {
    // orders.user_id must become nullable for guest orders (guest_* columns
    // are added below, but the NOT NULL constraint has to be relaxed too).
    try {
      await connection.query('ALTER TABLE orders MODIFY user_id INT NULL');
      console.log('Relaxed orders.user_id to nullable (guest orders).');
    } catch (err) {
      console.log(`Could not modify orders.user_id (may already be nullable): ${err.message}`);
    }

    for (const [table, name, type] of COLUMNS) {
      try {
        await connection.query(`ALTER TABLE ${table} ADD COLUMN ${name} ${type}`);
        console.log(`Added column: ${table}.${name}`);
      } catch (err) {
        if (err.code === 'ER_DUP_FIELDNAME') {
          console.log(`Column already exists, skipping: ${table}.${name}`);
        } else {
          throw err;
        }
      }
    }

    for (const { name, sql } of TABLES) {
      await connection.query(sql);
      console.log(`Ensured table exists: ${name}`);
    }

    console.log('Modules migration complete.');
  } finally {
    await connection.end();
  }
})().catch((err) => {
  console.error('Migration failed:', err.message);
  process.exit(1);
});
