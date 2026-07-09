module.exports = {
  apps: [
    {
      name: 'ozbek-backend',
      cwd: '/var/www/ozbek/backend',
      script: 'src/server.js',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
      },
      max_memory_restart: '300M',
      autorestart: true,
    },
  ],
};
