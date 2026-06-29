import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { getLenis } from "@/components/providers/SmoothScroll";

export function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    const l = getLenis();
    if (l) l.scrollTo(0, { immediate: true });
    else window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}
