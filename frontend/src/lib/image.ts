import type { SyntheticEvent } from "react";

/**
 * Helpers for rendering user-supplied image URLs safely.
 *
 * Product/industry images are usually data URLs or https links, but the admin
 * "Add URL" field accepts free text, so a broken or plain-http URL can slip in.
 * On the HTTPS production site the browser blocks http:// images as "mixed
 * content", and a bad URL would otherwise show a broken-image icon. These
 * helpers upgrade http→https and swap any image that fails to load for a
 * neutral inline placeholder (a data URL, so it always renders with no network).
 */

/** Inline SVG "image" placeholder — no network, safe over https. */
export const PLACEHOLDER_IMG =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">' +
      '<rect width="400" height="300" fill="#171a21"/>' +
      '<g fill="none" stroke="#3b414f" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">' +
      '<rect x="150" y="112" width="100" height="76" rx="8"/>' +
      '<circle cx="176" cy="140" r="9"/>' +
      '<path d="M156 180l30-30 22 22 16-16 20 20"/>' +
      "</g></svg>"
  );

/** Normalise a user-supplied image URL for safe rendering on an HTTPS page. */
export function safeImg(src?: string | null): string {
  const s = (src ?? "").trim();
  if (!s) return PLACEHOLDER_IMG;
  if (s.startsWith("data:")) return s;
  // Upgrade insecure http:// so the browser doesn't block it as mixed content.
  if (s.startsWith("http://")) return "https://" + s.slice(7);
  return s;
}

/**
 * Build a width-descriptor `srcSet` for Unsplash-hosted images so the browser
 * can pick a crop that matches the element's real size and pixel density —
 * that's what keeps a tile sharp on a HiDPI screen instead of upscaled.
 *
 * Returns undefined for anything we can't resize (admin data-URL uploads,
 * self-hosted files), which leaves `<img>` to fall back to plain `src`.
 */
export function imgSrcSet(
  src?: string | null,
  widths: number[] = [640, 960, 1280, 1920]
): string | undefined {
  const s = safeImg(src);
  if (!s.startsWith("https://images.unsplash.com/")) return undefined;
  try {
    return widths
      .map((w) => {
        const u = new URL(s);
        u.searchParams.set("w", String(w));
        return `${u.toString()} ${w}w`;
      })
      .join(", ");
  } catch {
    return undefined;
  }
}

/** `<img onError>` handler — swap a broken image for the placeholder, once. */
export function onImgError(e: SyntheticEvent<HTMLImageElement>) {
  const img = e.currentTarget;
  if (img.dataset.fallback) return; // already swapped — avoid an error loop
  img.dataset.fallback = "1";
  img.src = PLACEHOLDER_IMG;
}

/**
 * True when a string is a plausible image reference we'll accept from the admin
 * "Add URL" field: an http(s) URL, a protocol-relative URL, a data:image URL,
 * or a site-relative path. Rejects free-text garbage like "error999971".
 */
export function isValidImageRef(value: string): boolean {
  const s = value.trim();
  if (!s) return false;
  if (s.startsWith("data:image/")) return true;
  if (s.startsWith("/")) return true; // site-relative path
  try {
    const u = new URL(s, "https://example.com");
    if (u.protocol !== "http:" && u.protocol !== "https:") return false;
    // Require a real dotted host (rejects "http://error999971/").
    return u.hostname.includes(".");
  } catch {
    return false;
  }
}
