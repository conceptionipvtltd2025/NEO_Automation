# Neo Automation — Backend API

Node + Express + TypeScript REST API backed by **MySQL**. Powers the website's
catalogue (products, categories, industries, brands), the contact/inquiry form,
and the admin panel (JWT auth + full CRUD).

## Prerequisites

- **Node.js 18+**
- **MySQL 5.7+ / 8.0** running locally (or anywhere reachable). XAMPP / WAMP /
  MySQL Installer / Docker all work. You only need a user that can create a
  database — the server creates the schema and seeds data automatically.

## Setup

```bash
cd backend
cp .env.example .env        # then edit DB_USER / DB_PASSWORD to match your MySQL
npm install
npm run dev                 # starts on http://localhost:4000
```

On first boot the server will:

1. create the `neo_automation` database (if missing),
2. create all tables,
3. seed 9 brands, 6 categories, 6 industries, 12 products, 3 demo inquiries,
   and the admin account.

Re-seeding is safe — each table is only seeded when empty, so your admin edits
are never overwritten.

### Default admin login

`admin` / `neo@2026` (configurable via `SEED_ADMIN_USER` / `SEED_ADMIN_PASSWORD`
before the first boot). The frontend admin panel is at `/admin/login`.

## Scripts

| command          | what it does                                         |
| ---------------- | ---------------------------------------------------- |
| `npm run dev`    | watch mode (tsx), auto-restarts on change            |
| `npm start`      | run once with tsx (no watch)                         |
| `npm run build`  | compile TypeScript to `dist/`                        |
| `npm run serve`  | run the compiled `dist/index.js`                     |
| `npm run seed`   | run migrate + seed standalone                        |

## API

Base URL: `http://localhost:4000/api`

| method | path                          | auth  | purpose                          |
| ------ | ----------------------------- | ----- | -------------------------------- |
| POST   | `/auth/login`                 | —     | login → `{ token, user }`        |
| GET    | `/auth/me`                    | token | validate token                   |
| GET    | `/products`                   | —     | list products                    |
| PUT    | `/products/:id`               | token | create/update product            |
| PATCH  | `/products/:id/toggle`        | token | toggle visibility                |
| DELETE | `/products/:id`               | token | delete product                   |
| GET    | `/categories`                 | —     | list categories                  |
| PUT    | `/categories/:id`             | token | create/update category           |
| DELETE | `/categories/:id`             | token | delete category                  |
| GET    | `/industries`                 | —     | list industries                  |
| PUT    | `/industries/:id`             | token | create/update industry           |
| DELETE | `/industries/:id`             | token | delete industry                  |
| GET    | `/brands`                     | —     | list brands                      |
| GET    | `/inquiries`                  | token | list inquiries                   |
| POST   | `/inquiries`                  | —     | submit an inquiry (website form) |
| PATCH  | `/inquiries/:id/status`       | token | change status                    |
| DELETE | `/inquiries/:id`              | token | delete inquiry                   |

Send the token as `Authorization: Bearer <token>`.

## Frontend connection

The Vite app talks to `/api`, proxied to this server in dev (see
`frontend/vite.config.ts`). The stores fall back to local seed/localStorage if the API is
unreachable, so the site keeps working even when the backend is down. To point a
production build at a deployed API, set `VITE_API_URL` in the frontend `.env`.

## Notes

- Product/industry images may be data URLs (base64). If you upload many large
  images and hit a packet error, raise MySQL's `max_allowed_packet` (e.g. 64M).
- Set a strong `JWT_SECRET` in production.
