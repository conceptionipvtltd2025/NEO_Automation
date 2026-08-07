# Neo Automation — Deployment Guide

How to build and deploy the **frontend** (static React/Vite site) and the
**backend** (Node/Express + MySQL API), plus how to set up the **database**.

Everything below matches the live layout on the cPanel host `cidev.in`:

| Piece     | Lives at (public URL)                          | Served how                              |
| --------- | ---------------------------------------------- | --------------------------------------- |
| Frontend  | `https://cidev.in/neo-website/`                | Static files (Vite `base: /neo-website/`) |
| Backend   | `https://cidev.in/neo_website_backend`         | cPanel **Setup Node.js App** (Passenger) |
| API       | `https://cidev.in/neo_website_backend/api`     | Express routes under `/api`             |
| Uploads   | `https://cidev.in/neo_website_backend/uploads` | Static images written by the API        |
| Database  | MariaDB / MySQL                                | cPanel **MySQL® Databases** + phpMyAdmin |

The frontend calls the backend via `VITE_API_URL`, which is **baked in at build
time** from `frontend/.env.production`. If the API URL changes, you must rebuild
the frontend.

---

## 0. Prerequisites

- **Node.js 18+** locally (to build) and on the host (cPanel Node.js app).
- **MySQL 5.7+/8.0 or MariaDB 10.x** (cPanel provides MariaDB).
- Local `.env` files filled in (see each section).

---

## 1. Database

The repo ships a ready-to-import dump: **[`neo_automation.sql`](neo_automation.sql)**
(schema + all current data: admin account, 10 brands, 12 categories, 10
industries, 43 products, 3 demo inquiries). It is written to import cleanly on
**both** MySQL and MariaDB.

### 1a. Create the database (cPanel)

1. cPanel → **MySQL® Databases**.
2. **Create New Database** → e.g. `cidev_neo_automation`.
3. **Add New User** → e.g. `cidev_neo`, with a strong password.
4. **Add User to Database** → grant **ALL PRIVILEGES**.

> cPanel prefixes names with your account, so the real names look like
> `cidev_neo_automation` / `cidev_neo`. Note them for the backend `.env`.

### 1b. Import the data

1. cPanel → **phpMyAdmin** → select the new database on the left.
2. **Import** tab → choose `neo_automation.sql` → **Go**.
3. You should see `admins, brands, categories, industries, products, inquiries`
   created and filled.

Admin login after import: **`admin` / `neo@2026`**.

> **Alternative:** you can skip the import entirely — on first boot the backend
> auto-creates the tables and seeds base data. Importing the SQL is preferred
> because it carries the **current** content (including any admin edits), not
> just the base seed.

### 1c. Regenerating the SQL from a live database

Whenever the data changes and you want a fresh dump:

```bash
cd backend
npm run export:sql                 # writes ../neo_automation.sql
npm run export:sql -- ./mydump.sql # or a custom path
```

(Runs against whatever `backend/.env` points at. Uses the real schema from
`src/schema.ts`, so it never emits MySQL-8-only syntax that breaks MariaDB.)

---

## 2. Backend (Node/Express API)

### 2a. Configure `backend/.env` (production values)

```ini
PORT=4000                    # Passenger overrides this; leave as-is
CORS_ORIGIN=https://cidev.in # the site origin allowed to call the API

# Database (from step 1a — use your cPanel-prefixed names)
DB_HOST=localhost
DB_PORT=3306
DB_USER=cidev_neo
DB_PASSWORD=your-db-password
DB_NAME=cidev_neo_automation

# Auth — CHANGE THIS to a long random string in production
JWT_SECRET=replace-with-a-64-char-random-secret
JWT_EXPIRES_IN=7d

# Seed admin (only used if the admins table is empty on first boot)
SEED_ADMIN_USER=admin
SEED_ADMIN_PASSWORD=neo@2026

# Public URL that maps to the backend's uploads/ folder (for image URLs)
PUBLIC_UPLOADS_URL=https://cidev.in/neo_website_backend/uploads
```

`.env` is git-ignored — create it directly on the server (or upload it).

### 2b. Build

```bash
cd backend
npm install          # all deps (build needs TypeScript)
npm run build        # tsc → dist/  (produces dist/index.js)
```

Run locally to smoke-test the compiled build:

```bash
npm run serve        # node dist/index.js  → http://localhost:4000/api/health
```

### 2c. Deploy to cPanel (Setup Node.js App / Passenger)

1. Upload the **backend** folder to the host (e.g. `~/neo_website_backend/`),
   including: `dist/`, `package.json`, `package-lock.json`, `.env`, and an
   `uploads/` folder (create it empty if missing — product images are written
   here at runtime).
   - You can upload `node_modules` too, or install on the server (next step).
2. cPanel → **Setup Node.js App** → **Create Application**:
   - **Node.js version:** 18+
   - **Application mode:** Production
   - **Application root:** `neo_website_backend`
   - **Application URL:** `neo_website_backend`  → serves at
     `https://cidev.in/neo_website_backend`
   - **Application startup file:** `dist/index.js`
3. In the app panel, click **Run NPM Install** (installs from `package.json`).
4. Add the environment variables from `.env` in the app's **Environment
   variables** section *or* rely on the uploaded `.env` (the app loads it via
   `dotenv`). Setting them in the panel is more reliable on cPanel.
5. **Restart** the application.

cPanel sets `PASSENGER_BASE_URI=/neo_website_backend` automatically; the server
strips that prefix (see `src/index.ts`) so routes still resolve at `/api/...`.

### 2d. Verify

```
https://cidev.in/neo_website_backend/api/health   →  {"ok":true,"service":"neo-automation-api"}
```

On first boot the logs show: `database ready → tables migrated → seed checked →
API listening`. Seeding is skipped when tables already have rows (e.g. after the
SQL import), so it never overwrites data.

---

## 3. Frontend (React/Vite static site)

### 3a. Confirm `frontend/.env.production`

```ini
VITE_API_URL=https://cidev.in/neo_website_backend/api
VITE_TAWK_SRC=https://embed.tawk.to/6a43b6c0554b0c1d4cbe4edc/1jsc83opk
```

This is only read by `npm run build` (not `npm run dev`). If the backend URL
ever changes, update this and **rebuild**.

### 3b. Build

```bash
cd frontend
npm install
npm run build        # tsc -b && vite build  → dist/
```

The output in `frontend/dist/` includes the hashed `assets/`, `images/`,
`video/`, `index.html`, and a pre-configured **`.htaccess`** that rewrites deep
links to `index.html` (needed so React Router routes like
`/neo-website/products` don't 404).

### 3c. Deploy

Upload the **contents of `frontend/dist/`** into the web folder that maps to
`https://cidev.in/neo-website/` — typically `public_html/neo-website/`.

- Keep the `.htaccess` file (it's what makes SPA routing + the `/neo-website/`
  base path work). If your host strips dotfiles on upload, create it manually.
- Do **not** nest it further — the files must sit directly under `neo-website/`
  so `https://cidev.in/neo-website/index.html` resolves.

### 3d. Verify

Open `https://cidev.in/neo-website/`, then:
- Hard-refresh a deep link (e.g. `/neo-website/products`) — it should load, not 404.
- Admin: `https://cidev.in/neo-website/admin/login` → `admin` / `neo@2026`.
- Add/edit a brand or product and confirm it persists after refresh (proves the
  frontend is talking to the live API and DB).

---

## 4. Redeploying (updates)

**Frontend change** → `cd frontend && npm run build`, then re-upload
`frontend/dist/` (overwrite). Hashed filenames bust caches automatically.

**Backend change** → `cd backend && npm run build`, upload the new `dist/`, then
**Restart** the Node.js app in cPanel.

**Data/schema change** → re-run `npm run export:sql` and re-import, *or* let the
backend's idempotent `migrate()` add new columns on the next restart (it never
drops data). New *seed* content for an already-seeded DB needs a backfill —
see `backend/README.md` (`npm run backfill:industries:prod`).

---

## 5. Quick checklist

- [ ] DB created in cPanel; `neo_automation.sql` imported via phpMyAdmin
- [ ] `backend/.env` filled with real DB creds + a strong `JWT_SECRET`
- [ ] `cd backend && npm run build`; uploaded `dist/` + `uploads/` + `.env`
- [ ] Node.js app created (startup `dist/index.js`), NPM install run, restarted
- [ ] `…/neo_website_backend/api/health` returns `{"ok":true}`
- [ ] `frontend/.env.production` points at the live API
- [ ] `cd frontend && npm run build`; uploaded `dist/` (with `.htaccess`) to `neo-website/`
- [ ] Site loads, deep links work, admin login + a test edit persists

---

## 6. Gotchas

- **Change `JWT_SECRET`** in production — the default is insecure.
- **Large images:** if uploads hit a MySQL packet error, raise
  `max_allowed_packet` (e.g. 64M). The app already uploads images as binary
  multipart (not base64) to get past ModSecurity, and stores short `/uploads/…`
  URLs.
- **CORS:** `CORS_ORIGIN` must include the exact site origin
  (`https://cidev.in`) or admin writes will be blocked by the browser.
- **API URL is build-time** for the frontend — a wrong `VITE_API_URL` shows a
  live site running on stale seed data with edits that never save. Rebuild after
  changing it.
- **Always start the backend / DB before using the admin panel.** Logging in
  while the API is down creates a tokenless offline session, and later saves
  silently 401. Log out and back in once the API is up.
