import { getLenis } from "@/components/providers/SmoothScroll";

// Height cleared for the fixed navbar so anchored sections aren't hidden beneath it.
const NAV_OFFSET = 96;

/**
 * Smooth-scroll to an in-page element by hash (e.g. "#mission-vision").
 * Uses Lenis when available (to stay in sync with the site's smooth scroll),
 * falling back to native window scrolling. Returns false when the target
 * element isn't in the DOM yet, so callers can retry after render.
 */
export function scrollToHash(
  hash: string,
  opts: { immediate?: boolean } = {}
): boolean {
  const id = decodeURIComponent(hash.replace(/^#/, ""));
  if (!id) return false;
  const el = document.getElementById(id);
  if (!el) return false;

  const lenis = getLenis();
  if (lenis) {
    lenis.scrollTo(el, {
      offset: -NAV_OFFSET,
      duration: opts.immediate ? 0 : 1.1,
      immediate: opts.immediate,
    });
  } else {
    const top = el.getBoundingClientRect().top + window.scrollY - NAV_OFFSET;
    window.scrollTo({ top, behavior: opts.immediate ? "auto" : "smooth" });
  }
  return true;
}

/** Jump to the top of the page (used on plain route changes). */
export function scrollToTop(immediate = true) {
  const lenis = getLenis();
  if (lenis) lenis.scrollTo(0, { immediate });
  else window.scrollTo({ top: 0, behavior: immediate ? "auto" : "smooth" });
}
