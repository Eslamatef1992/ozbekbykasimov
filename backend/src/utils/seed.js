// Applies seed.sql (sample menu/content) and creates the first admin user.
// Usage: npm run db:seed
// Admin login after seeding: admin@ozbekbykasimov.com / ChangeMe123!
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function run() {
  const sql = fs.readFileSync(path.join(__dirname, '..', '..', 'seed.sql'), 'utf8');

  // seed.sql contains multiple statements, so this needs its own connection
  // with multipleStatements enabled - the shared pool in config/db.js
  // intentionally does not enable that (safer default for request handling).
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    multipleStatements: true,
  });

  try {
    await conn.query(sql);
    console.log('Sample menu/content seeded.');

    const [existing] = await conn.query('SELECT id FROM users WHERE email = ?', ['admin@ozbekbykasimov.com']);
    if (!existing[0]) {
      const password_hash = await bcrypt.hash('ChangeMe123!', 10);
      await conn.query(
        'INSERT INTO users (full_name, email, password_hash, role) VALUES (?, ?, ?, ?)',
        ['Site Admin', 'admin@ozbekbykasimov.com', password_hash, 'admin']
      );
      console.log('Admin user created: admin@ozbekbykasimov.com / ChangeMe123!  (change this immediately)');
    } else {
      console.log('Admin user already exists, skipping.');
    }
  } finally {
    await conn.end();
  }
}

run().catch((err) => {
  console.error('Seed failed:', err.message);
  process.exit(1);
});
