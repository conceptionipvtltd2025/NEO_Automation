# Neo Automation — Premium Corporate Website

A modern, highly-animated, fully-responsive website + admin panel for **Neo Automation Pvt. Ltd.**, built to the `NEO-SRS-WEB-001` specification. Premium black theme with NEO-red accents, cinematic motion, 3D, and a complete content-management backend.

> Design language inspired by [desouttertools.com](https://www.desouttertools.com/en-in) — dark, industrial, premium — with the NEO brand red as the signature accent.

---

## 🚀 Quick start

This is the **frontend** workspace. The API lives in [`../backend`](../backend).

```bash
cd frontend      # from the repo root
npm install      # install dependencies
npm run dev      # start dev server  → http://localhost:5173
npm run build    # type-check + production build → /dist
npm run preview  # preview the production build
```

> Start the backend too (`cd ../backend && npm run dev`) so the catalogue and
> admin panel read/write live data. `/api` is proxied to it automatically in dev.
> If the backend is offline the app still runs on seeded/`localStorage` data.

### 🔐 Admin panel
Visit **`/admin/login`**

| Field    | Value      |
|----------|------------|
| Username | `admin`    |
| Password | `neo@2026` |

The admin panel is protected, supports failed-attempt lockout, and persists data via the **backend API** (MySQL — see [`../backend`](../backend)), with a `localStorage` fallback when the API is offline.

---

## 🧰 Tech stack

| Concern              | Library |
|----------------------|---------|
| Framework / build    | **React 18 + Vite + TypeScript** |
| Styling              | **Tailwind CSS** (custom black/red design system) + shadcn-style primitives |
| Animation            | **Framer Motion** (page transitions, reveals, magnetic, layout) |
| 3D                   | **React Three Fiber + drei** (lazy-loaded metallic showpiece) |
| Smooth scroll        | **Lenis** |
| State                | **Zustand** (auth, inquiries, catalog — API-backed, localStorage fallback) |
| Data fetching        | **TanStack Query** (product loading + skeletons) |
| Icons                | **lucide-react** |
| Routing              | **react-router-dom** |

UI patterns are inspired by Aceternity UI / Magic UI / 21st.dev (spotlight cards, aurora, grid backgrounds, marquee, word-reveal headings, tilt, scroll progress) — implemented natively so there are no paid/closed dependencies.

---

## 📐 Design system

- **Palette** — `ink` (near-black surfaces) · `neo` (brand red `#ed1c24`) · `volt` (electric blue accent) · `steel` (text greys)
- **Fonts** — Clash Display (headings) · Sora (body) · JetBrains Mono
- **Effects** — animated gradient borders, glassmorphism, aurora glows, dot-grid, film grain, custom scrollbar, glow shadows

---

## 🗺️ Pages & routes

### Public
| Route | Page |
|-------|------|
| `/` | Home — video hero, brands, industries, special products (3D), SWF, catalogue, about, contact |
| `/products` | Catalogue with search, sort & filters (brand / category / industry) |
| `/products/:slug` | Product detail — gallery, specs, features, **Inquiry Now** modal, related |
| `/industries` | All industry verticals |
| `/industries/:id` | Industry detail + recommended products |
| `/swf` | Atlas Copco **Smart Workflow Feature** — service-centre video, pillars, inquiry |
| `/about` | Company, mission, vision, journey timeline, values |
| `/contact` | Contact details, Google Map, enquiry form |
| `/inquiry` | Standalone quote-request form (accepts `?product=slug`) |
| `/terms`, `/privacy` | Legal |

### Admin (`/admin`)
Dashboard · Products (full CRUD) · Categories (CRUD) · Industries (CRUD) · Inquiries (status, detail, reply, CSV export).

---

## ✅ SRS coverage (`NEO-SRS-WEB-001`)

**Functional**
- **FR-01 Homepage** — video hero, intro, responsive layout, About section, embedded enquiry form, industry & product sections, footer w/ links & T&C ✓
- **FR-02 Product List** — all products w/ specs/pricing, filter by industry & brand ✓
- **FR-03 Product Details** — title, description, brand, images, specs, **Inquiry Now** ✓
- **FR-04 Inquiry** — product-specific form (Name, Email, Address, Phone, Message), validation + confirmation ✓
- **FR-05 Industry** — dedicated sub-page per vertical with related products/services ✓
- **FR-06 About Us** — overview, journey timeline, mission, vision ✓
- **FR-07 Contact** — Google Map, enquiry form ✓
- **FR-08 SWF (Atlas Copco)** — services + service-centre video, Inquiry pop-up, live chat & WhatsApp widgets ✓

**Admin (Section C)**
- **AR-01 Login** — secure login, session, failed-attempt lockout, dashboard ✓
- **AR-02 Categories** — add/edit/delete (with confirm), list/search ✓
- **AR-03 Industries** — add/edit/delete, assign products, content fields ✓
- **AR-04 Products** — full CRUD, multi-image, specs, visibility toggle, search/filter/sort ✓
- **AR-05 Inquiries** — list w/ date & status, full detail, mark Read/Responded/Closed, filter, **CSV export** ✓
- **AR-06 Email** — reply-by-email actions; confirmation messaging (wire to a mail service for live sending)

**Non-Functional** — responsive (mobile/tablet/desktop), lazy-loaded media & 3D, code-split bundles, CAPTCHA/honeypot-ready forms, custom design system, no IE.

---

## 🔌 Going live (next steps)

The frontend is production-ready. To make it fully live, connect a backend for:
1. **Real auth** — replace the demo Zustand auth with a server + hashed passwords (bcrypt) and JWT/session cookies.
2. **Persistent data** — swap the Zustand `localStorage` stores for a database (the data shapes in `src/data` are your schema). TanStack Query is already wired for async fetching.
3. **Email** — connect `AR-06` to an SMTP / transactional email provider (e.g. Resend, SendGrid) in `InquiryForm`'s submit handler.
4. **Assets** — replace Unsplash/stock URLs and the hero video with the client's real brand imagery, logos and product photos.
5. **Map** — drop in the exact office coordinates / Google Maps API key.

---

*Prepared by Conception I Private Limited — for Neo Automation Pvt. Ltd.*
