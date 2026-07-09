#!/usr/bin/env bash
# Run this ON THE VPS from /var/www/ozbek after `git pull`.
# Rebuilds frontend/admin, reinstalls backend deps, restarts PM2.
set -euo pipefail

APP_DIR="/var/www/ozbek"
cd "$APP_DIR"

echo "==> Pulling latest code"
git pull origin main

echo "==> Installing & building backend"
cd "$APP_DIR/backend"
npm ci --omit=dev

echo "==> Installing & building frontend (customer site)"
cd "$APP_DIR/frontend"
npm ci
npm run build

echo "==> Installing & building admin panel"
cd "$APP_DIR/admin"
npm ci
npm run build

echo "==> Restarting backend via PM2"
pm2 startOrReload "$APP_DIR/deploy/pm2/ecosystem.config.js"
pm2 save

echo "==> Done. Nginx serves directly from frontend/dist and admin/dist (see deploy/nginx/*.conf)."
