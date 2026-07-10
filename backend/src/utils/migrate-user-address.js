// Adds the profile "Address" columns to an existing users table.
// Safe to run multiple times (skips columns that already exist).
// Usage: node src/utils/migrate-user-address.js
const mysql = require('mysql2/promise');
require('dotenv').config();

const COLUMNS = [
  ['region', 'VARCHAR(100)'],
  ['block_number', 'VARCHAR(50)'],
  ['street_name', 'VARCHAR(150)'],
  ['building_number', 'VARCHAR(50)'],
  ['floor', 'VARCHAR(50)'],
  ['flat', 'VARCHAR(50)'],
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
    for (const [name, type] of COLUMNS) {
      try {
        await connection.query(`ALTER TABLE users ADD COLUMN ${name} ${type}`);
        console.log(`Added column: ${name}`);
      } catch (err) {
        if (err.code === 'ER_DUP_FIELDNAME') {
          console.log(`Column already exists, skipping: ${name}`);
        } else {
          throw err;
        }
      }
    }
    console.log('User address migration complete.');
  } finally {
    await connection.end();
  }
})().catch((err) => {
  console.error('Migration failed:', err.message);
  process.exit(1);
});
