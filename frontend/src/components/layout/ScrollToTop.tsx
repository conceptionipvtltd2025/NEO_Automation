import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { scrollToHash, scrollToTop } from "@/lib/scroll";

// On navigation: jump to the top of the page, UNLESS the URL carries a hash
// (e.g. /about#mission-vision, /#products) — in which case smooth-scroll to
// that section once the incoming route has rendered. Anchored deep-links come
// from the mega-menu and the full-site search.
export function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      scrollToTop(true);
      return;
    }

    // The target section may not be in the DOM until the new route mounts (and
    // its height can shift as images/fonts settle), so wait a frame then retry
    // a few times until the element is found.
    let tries = 0;
    let timer: number | undefined;
    const attempt = () => {
      if (scrollToHash(hash) || tries >= 12) return;
      tries += 1;
      timer = window.setTimeout(attempt, 60);
    };
    const raf = requestAnimationFrame(() =>
      requestAnimationFrame(attempt)
    );

    return () => {
      cancelAnimationFrame(raf);
      if (timer) window.clearTimeout(timer);
    };
  }, [pathname, hash]);

  return null;
}
