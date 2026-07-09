# Ozbek By Kasimov

Full-stack restaurant site + admin panel.
- `backend/` - Node.js / Express / MySQL REST API
- `frontend/` - React (Vite) customer-facing site
- `admin/` - React (Vite) admin panel
- `deploy/` - Nginx configs, PM2 config, deploy script

Structure follows the Figma file `ozbek_project`: Home, Menu, Product details,
Cart, Checkout (delivery/pickup, payment method, delivery fee), Book a Table,
Login/Register, Profile (orders + reservations), About Us, Contact Us,
Privacy & Terms - plus an admin panel (not in the Figma) for managing all of it.

> Styling right now uses a placeholder palette (cream/navy/gold/accent). Once
> edit access to the Figma file is shared, exact colors/spacing/copy can be
> pulled in precisely via the Figma dev tools instead of eyeballed from
> screenshots.

---

## 1. Local development

### Prerequisites (your machine)
- Node.js 18+
- MySQL 8+ running locally (or a remote dev DB)

### One-time setup

```bash
# from the ozbek-restaurant/ folder

# Backend
cd backend
cp .env.example .env        # edit DB_USER / DB_PASSWORD / JWT_SECRET
npm install
npm run db:migrate          # creates the database + tables from schema.sql
npm run db:seed             # sample menu data + admin user

# Frontend (customer site)
cd ../frontend
cp .env.example .env        # VITE_API_URL=http://localhost:5000/api for local dev
npm install

# Admin panel
cd ../admin
cp .env.example .env        # VITE_API_URL=http://localhost:5000/api for local dev
npm install
```

### Run everything (3 terminals)

```bash
cd backend && npm run dev      # http://localhost:5000
cd frontend && npm run dev     # http://localhost:5173
cd admin && npm run dev        # http://localhost:5174
```

Default admin login after `npm run db:seed`:
`admin@ozbekbykasimov.com` / `ChangeMe123!` - **change this password immediately.**

---

## 2. Push to GitHub

```bash
cd ozbek-restaurant

# create a new repo on GitHub first (empty, no README), then:
git remote add origin https://github.com/<your-username>/<your-repo>.git
git add -A
git commit -m "Initial scaffold: backend, frontend, admin, deploy configs"
git branch -M main
git push -u origin main
```

For every milestone after this, the pattern is:

```bash
git add -A
git commit -m "<what changed>"
git push
```

---

## 3. VPS setup (Ubuntu, first time only)

Run these **on the VPS** (`ssh <user>@152.239.122.167`). Assumes Ubuntu 22.04.

```bash
# system packages
sudo apt update && sudo apt upgrade -y
sudo apt install -y nginx mysql-server git curl ufw

# Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# PM2 (process manager for the backend)
sudo npm install -g pm2

# firewall
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw enable

# secure MySQL and create the app database/user
sudo mysql_secure_installation
sudo mysql -u root -p
```

Inside the `mysql` prompt:

```sql
CREATE DATABASE ozbek_restaurant CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'ozbek_user'@'localhost' IDENTIFIED BY 'STRONG_PASSWORD_HERE';
GRANT ALL PRIVILEGES ON ozbek_restaurant.* TO 'ozbek_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### Clone the repo onto the VPS

```bash
sudo mkdir -p /var/www/ozbek
sudo chown $USER:$USER /var/www/ozbek
git clone https://github.com/<your-username>/<your-repo>.git /var/www/ozbek
cd /var/www/ozbek
```

### Configure environment files on the VPS

```bash
cd backend
cp .env.example .env
nano .env   # set DB_USER=ozbek_user, DB_PASSWORD=..., JWT_SECRET=(long random string),
            # CORS_ORIGINS=https://www.ozbekbykasimov.com,https://admin.ozbekbykasimov.com

npm install
npm run db:migrate
npm run db:seed

cd ../frontend
cp .env.example .env    # VITE_API_URL=https://back.ozbekbykasimov.com/api
cd ../admin
cp .env.example .env    # VITE_API_URL=https://back.ozbekbykasimov.com/api
cd ..
```

### Build frontend/admin and start the backend

```bash
cd frontend && npm install && npm run build && cd ..
cd admin && npm install && npm run build && cd ..

pm2 start deploy/pm2/ecosystem.config.js
pm2 save
pm2 startup     # follow the printed instructions to enable PM2 on reboot
```

### Nginx

```bash
sudo cp deploy/nginx/www.ozbekbykasimov.com.conf   /etc/nginx/sites-available/
sudo cp deploy/nginx/admin.ozbekbykasimov.com.conf  /etc/nginx/sites-available/
sudo cp deploy/nginx/back.ozbekbykasimov.com.conf   /etc/nginx/sites-available/

sudo ln -s /etc/nginx/sites-available/www.ozbekbykasimov.com.conf   /etc/nginx/sites-enabled/
sudo ln -s /etc/nginx/sites-available/admin.ozbekbykasimov.com.conf /etc/nginx/sites-enabled/
sudo ln -s /etc/nginx/sites-available/back.ozbekbykasimov.com.conf  /etc/nginx/sites-enabled/

sudo nginx -t
sudo systemctl reload nginx
```

**Before this step works, point DNS A records to `152.239.122.167` for:**
`www.ozbekbykasimov.com` (and `ozbekbykasimov.com`), `admin.ozbekbykasimov.com`, `back.ozbekbykasimov.com`.

### HTTPS (after DNS is live and Nginx is serving on port 80)

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d www.ozbekbykasimov.com -d ozbekbykasimov.com
sudo certbot --nginx -d admin.ozbekbykasimov.com
sudo certbot --nginx -d back.ozbekbykasimov.com
```

Certbot edits the Nginx configs in place to add the SSL block and auto-renews via a systemd timer.

---

## 4. Ongoing deploys (after the first setup)

```bash
ssh <user>@152.239.122.167
cd /var/www/ozbek
bash deploy/deploy.sh
```

`deploy/deploy.sh` pulls the latest `main`, reinstalls backend deps, rebuilds
frontend/admin, and reloads the backend via PM2. Nginx needs no changes for
routine deploys since it serves straight from `frontend/dist` and `admin/dist`.

---

## 5. What's still open

- Pixel-accurate styling from Figma (needs edit access to the file).
- Real payment gateway integration (Checkout currently records `payment_method` but doesn't process card/PayPal payments).
- Production secrets (`JWT_SECRET`, DB password) - never commit `.env`, only `.env.example`.
- Image storage: uploads currently save to local disk (`backend/uploads`) - fine for a single VPS, consider S3/Spaces if you outgrow it.
