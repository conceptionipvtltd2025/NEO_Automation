/**
 * Build a URL for a file served from the `public/` folder.
 *
 * Why this exists: in production the app is deployed under a sub-path
 * (e.g. https://cidev.in/neo-website/), so a hard-coded absolute path like
 * "/video/hero.mp4" resolves to the domain root and 404s. Prefixing every
 * public asset with the deploy base fixes this in both local and server.
 *
 * Base resolution order:
 *   1. VITE_ASSET_BASE  — optional override you can set in .env / .env.production
 *   2. import.meta.env.BASE_URL — Vite's `base` ("/" in dev, "/neo-website/" in prod)
 *
 * Usage:  asset("video/hero-banner.mp4")  →  "/neo-website/video/hero-banner.mp4"
 * Leading slashes on the input are tolerated:  asset("/images/logo.png") works too.
 */
const RAW_BASE =
  (import.meta.env.VITE_ASSET_BASE as string | undefined) ||
  import.meta.env.BASE_URL ||
  "/";

// Normalise to exactly one trailing slash.
const BASE = RAW_BASE.endsWith("/") ? RAW_BASE : `${RAW_BASE}/`;

export function asset(path: string): string {
  // Pass through absolute URLs (http/https/data) untouched.
  if (/^(https?:)?\/\//.test(path) || path.startsWith("data:")) return path;
  return BASE + path.replace(/^\/+/, "");
}

/**
 * Resolve a brand logo that may come from either source:
 *   • the API / seed database, as a bare public path ("/images/brands/x.png") —
 *     which would 404 under the production sub-path, so it needs the base
 *   • an admin upload ("/uploads/x.jpg"), served by the BACKEND, which must NOT
 *     get the frontend's deploy base
 *   • an absolute URL or data: URL, passed through
 *
 * Brands became admin-editable (and therefore API-supplied), so every logo
 * render goes through here rather than trusting the stored string.
 */
export function brandLogo(path?: string | null): string {
  const s = (path ?? "").trim();
  if (!s) return "";
  if (/^(https?:)?\/\//.test(s) || s.startsWith("data:")) return s;
  if (s.startsWith("/uploads/") || s.startsWith("uploads/")) return s;
  // Idempotent: a value that already carries the base (an older record, or one
  // saved back by the admin) must not get it twice.
  if (BASE !== "/" && s.startsWith(BASE)) return s;
  return asset(s);
}
