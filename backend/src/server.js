const app = require('./app');
const { testConnection } = require('./config/db');

const PORT = process.env.PORT || 5000;

(async () => {
  try {
    await testConnection();
    console.log('MySQL connection OK');
  } catch (err) {
    console.error('Could not connect to MySQL:', err.message);
    console.error('Check backend/.env (DB_HOST, DB_USER, DB_PASSWORD, DB_NAME) and that MySQL is running.');
    process.exit(1);
  }

  app.listen(PORT, () => {
    console.log(`Ozbek backend listening on port ${PORT}`);
  });
})();
