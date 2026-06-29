# Neo Automation

Premium corporate website + admin panel for **Neo Automation Pvt. Ltd.**, built
to the `NEO-SRS-WEB-001` spec. This repository is a monorepo with two
independent workspaces:

```
neo automation/
├── frontend/    React 18 + Vite + TypeScript website & admin panel
└── backend/     Node + Express + TypeScript REST API on MySQL
```

| Workspace                | Stack                                             | Dev URL                     | Docs                              |
| ------------------------ | ------------------------------------------------- | --------------------------- | --------------------------------- |
| [`frontend/`](frontend/) | React, Vite, Tailwind, Framer Motion, Zustand     | http://localhost:5173       | [frontend/README.md](frontend/README.md) |
| [`backend/`](backend/)   | Express, mysql2, JWT (bcrypt)                      | http://localhost:4000/api   | [backend/README.md](backend/README.md)   |

The frontend calls `/api`, which Vite proxies to the backend in dev (see
[frontend/vite.config.ts](frontend/vite.config.ts)). The Zustand stores fall
back to seeded/`localStorage` data when the API is unreachable, so the site
keeps working even if the backend is down.

## Prerequisites

- **Node.js 18+**
- **MySQL 5.7+ / 8.0** running locally (XAMPP / WAMP / MySQL Installer / Docker).

## Run it (two terminals)

```bash
# Terminal 1 — API (creates the DB, migrates & seeds on first boot)
cd backend
cp .env.example .env          # edit DB_USER / DB_PASSWORD to match your MySQL
npm install
npm run dev                   # → http://localhost:4000

# Terminal 2 — website + admin
cd frontend
npm install
npm run dev                   # → http://localhost:5173
```

Or, from the repo root, use the convenience scripts in the root
[package.json](package.json):

```bash
npm run install:all           # installs both workspaces
npm run dev:backend           # in one terminal
npm run dev:frontend          # in another
```

### Admin panel

Visit **`/admin/login`** — default credentials `admin` / `neo@2026`
(configurable in `backend/.env` before first boot).

## Notes

- The backend auto-creates the `neo_automation` database and seeds 9 brands,
  6 categories, 6 industries, 12 products, 3 demo inquiries, and the admin
  account on first boot. Re-seeding is safe — tables are only seeded when empty.
- For a production frontend build pointed at a deployed API, set `VITE_API_URL`
  in `frontend/.env`.
