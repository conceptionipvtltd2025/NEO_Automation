import { useCallback, useEffect, useRef, useState, type TouchEvent as ReactTouchEvent } from "react";
import { createPortal } from "react-dom";
import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
} from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { getLenis } from "@/components/providers/SmoothScroll";

/**
 * Reusable in-page image viewer.
 *
 * Why it exists: images used to open as a raw PNG in a new tab, and on a phone
 * that new tab has no way "back" to the page. This keeps the visitor on the
 * page, and — the part that matters on phones — makes the browser/OS BACK
 * gesture close the viewer instead of leaving the site:
 *
 *   open   → push ONE history entry (same URL, state flagged with HISTORY_KEY)
 *   Back   → the browser pops that entry → `popstate` → we just close
 *   X/Esc/backdrop → we close, then pop our own entry with history.back()
 *
 * Paging between images never pushes more entries. The pop after a manual
 * close is deferred one tick and cancelled if a viewer re-opens in that same
 * tick (a remount while open — React StrictMode's dev replay, Fast Refresh —
 * or another viewer opening at once): the open entry is then reused instead of
 * a pending back() racing a fresh pushState and closing the new viewer.
 *
 * Phone swipe is read from raw touch events, NOT framer's drag: drag="x" pins
 * `touch-action: pan-y` on the image, which blocks pinch-zoom — and zooming
 * into a slide's small print is the whole point of opening it on a phone.
 * Here the browser keeps every native gesture (pinch, and panning around a
 * zoomed image); a swipe only pages when it is one finger, mostly sideways,
 * and the page is not zoomed in.
 */

export type LightboxItem = { src: string; alt: string; title?: string };

type LightboxProps = {
  items: LightboxItem[];
  /** Index of the open image, or null when the viewer is closed. */
  index: number | null;
  onClose: () => void;
  onIndexChange: (i: number) => void;
};

const HISTORY_KEY = "neoLightbox";
// Module scope on purpose: shared by every Lightbox so a close immediately
// followed by an open (StrictMode replay, or opening another viewer) reuses
// the entry instead of racing a pending back() against a fresh pushState.
let pendingBack: number | undefined;

const hasOurEntry = () =>
  typeof window !== "undefined" &&
  Boolean((window.history.state as Record<string, unknown> | null)?.[HISTORY_KEY]);

const SWIPE_DISTANCE = 60;
const SWIPE_VELOCITY = 450; // px/s — a quick flick pages even when short
const SWIPE_FOLLOW = 0.45; // how far the image trails the finger while swiping

/** True while the visitor has pinch-zoomed the page (panning, not paging). */
const isZoomed = () => (window.visualViewport?.scale ?? 1) > 1.01;

type SwipeTrack = { x: number; y: number; t: number; multi: boolean; off: boolean };

export function Lightbox({ items, index, onClose, onIndexChange }: LightboxProps) {
  const reduce = useReducedMotion();
  const isOpen = index !== null && index >= 0 && index < items.length;
  const count = items.length;
  const many = count > 1;

  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  // Direction of the last page turn: drives which side the next image slides from.
  const [dir, setDir] = useState<1 | -1>(1);

  // Latest callbacks/index for listeners registered once per open.
  const onCloseRef = useRef(onClose);
  const onIndexRef = useRef(onIndexChange);
  const indexRef = useRef(index);
  onCloseRef.current = onClose;
  onIndexRef.current = onIndexChange;
  indexRef.current = index;

  const go = useCallback(
    (step: 1 | -1) => {
      const i = indexRef.current;
      if (i === null || count < 2) return;
      setDir(step);
      onIndexRef.current((i + step + count) % count);
    },
    [count]
  );

  // ── Back button closes the viewer ────────────────────────────────────────
  useEffect(() => {
    if (!isOpen) return;
    window.clearTimeout(pendingBack);
    if (!hasOurEntry()) {
      const prev = (window.history.state as Record<string, unknown> | null) ?? {};
      // Spread the router's own state (key/idx) so react-router sees the same
      // location on either side of our entry — the back step is a no-op to it.
      window.history.pushState({ ...prev, [HISTORY_KEY]: true }, "");
    }
    const onPop = () => onCloseRef.current();
    window.addEventListener("popstate", onPop);
    return () => {
      window.removeEventListener("popstate", onPop);
      // Closed by X / Esc / backdrop (or unmounted): if our entry is still the
      // current one, pop it once. After a Back press it is already gone, and
      // after an in-app navigation the current entry is the new route's — both
      // fail the check, so there is never a double back.
      pendingBack = window.setTimeout(() => {
        pendingBack = undefined;
        if (hasOurEntry()) window.history.back();
      }, 0);
    };
  }, [isOpen]);

  // ── Scroll lock, keyboard, focus ─────────────────────────────────────────
  useEffect(() => {
    if (!isOpen) return;
    const opener = document.activeElement as HTMLElement | null;
    const html = document.documentElement;
    const prevOverflow = html.style.overflow;
    const prevPadding = html.style.paddingRight;
    // Lenis drives the page scroll, so pause it (it also adds `lenis-stopped`,
    // overflow:hidden on <html>). The inline overflow is the fallback for when
    // Lenis is not running. Padding the width of the vanishing scrollbar keeps
    // the page behind from reflowing sideways. (Not `scrollbar-gutter: stable`:
    // that leaves the gutter OUTSIDE the fixed overlay, a pale strip down the
    // right edge in the light theme.)
    const scrollbar = window.innerWidth - html.clientWidth;
    const lenis = getLenis();
    lenis?.stop();
    html.style.overflow = "hidden";
    if (scrollbar > 0) html.style.paddingRight = `${scrollbar}px`;

    const focusable = () =>
      Array.from(
        dialogRef.current?.querySelectorAll<HTMLElement>("button:not([disabled])") ?? []
      ).filter((el) => el.offsetParent !== null);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onCloseRef.current();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        go(1);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        go(-1);
      } else if (e.key === "Tab") {
        // Keep Tab inside the dialog.
        const els = focusable();
        if (els.length === 0) return;
        const first = els[0];
        const last = els[els.length - 1];
        const cur = document.activeElement;
        const inside = dialogRef.current?.contains(cur);
        if (e.shiftKey && (cur === first || !inside)) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && (cur === last || !inside)) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    // The dialog mounts in this same commit; give it a frame before focusing.
    const raf = requestAnimationFrame(() => closeRef.current?.focus({ preventScroll: true }));
    document.addEventListener("keydown", onKey);
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("keydown", onKey);
      html.style.overflow = prevOverflow;
      html.style.paddingRight = prevPadding;
      lenis?.start();
      if (opener && opener.isConnected && opener !== document.body) {
        opener.focus({ preventScroll: true });
      }
    };
  }, [isOpen, go]);

  // ── Phone swipe (touch events; the browser keeps pinch-zoom) ────────────
  const swipe = useRef<SwipeTrack | null>(null);
  const followX = useMotionValue(0); // the image trailing the finger
  const snapBack = () => {
    animate(followX, 0, reduce ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 34 });
  };

  const onTouchStart = (e: ReactTouchEvent) => {
    if (!many) return;
    if (e.touches.length > 1) {
      // A second finger joined: this is a pinch, never a page turn.
      if (swipe.current) swipe.current.multi = true;
      snapBack();
      return;
    }
    const t = e.touches[0];
    swipe.current = { x: t.clientX, y: t.clientY, t: e.timeStamp, multi: false, off: isZoomed() };
  };

  const onTouchMove = (e: ReactTouchEvent) => {
    const s = swipe.current;
    if (!s) return;
    if (e.touches.length > 1) {
      s.multi = true;
      snapBack();
      return;
    }
    if (s.multi || s.off || reduce) return;
    const t = e.touches[0];
    const dx = t.clientX - s.x;
    const dy = t.clientY - s.y;
    if (Math.abs(dx) > Math.abs(dy)) followX.set(dx * SWIPE_FOLLOW);
  };

  const onTouchEnd = (e: ReactTouchEvent) => {
    const s = swipe.current;
    if (!s || e.touches.length > 0) return; // wait for the last finger
    swipe.current = null;
    const t = e.changedTouches[0];
    if (s.multi || s.off || !t) return snapBack();
    const dx = t.clientX - s.x;
    const dy = t.clientY - s.y;
    const v = (dx / Math.max(e.timeStamp - s.t, 1)) * 1000;
    const sideways = Math.abs(dx) > Math.abs(dy) * 1.2 && Math.abs(dx) > 12;
    // The exiting image keeps its offset and slides on out; the follow value
    // is zeroed once it has gone (onExitComplete), before the next one enters.
    if (sideways && (dx < -SWIPE_DISTANCE || v < -SWIPE_VELOCITY)) go(1);
    else if (sideways && (dx > SWIPE_DISTANCE || v > SWIPE_VELOCITY)) go(-1);
    else snapBack();
  };

  const onTouchCancel = () => {
    swipe.current = null;
    snapBack();
  };

  if (typeof document === "undefined") return null;

  const current = isOpen ? (index as number) : -1;
  const item = current >= 0 ? items[current] : null;
  // Paging: the new image slides in from the side it was paged towards. Fade
  // only under reduced motion. Variants take `dir` via AnimatePresence's
  // `custom`, so the EXITING image also leaves the right way.
  const slide = reduce ? 0 : 48;
  const settle = reduce ? 1 : 0.97;
  const pageVariants = {
    enter: (d: number) => ({ opacity: 0, x: d * slide, scale: settle }),
    center: { opacity: 1, x: 0, scale: 1 },
    exit: (d: number) => ({ opacity: 0, x: -d * slide, scale: settle }),
  };

  return createPortal(
    <AnimatePresence>
      {item && (
        <motion.div
          key="neo-lightbox"
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label={item.title ?? item.alt}
          data-lenis-prevent
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduce ? 0.15 : 0.25, ease: "easeOut" }}
          // force-dark: a dark scrim in BOTH themes — a light-theme scrim
          // would sit white-on-white against the slides' white plates.
          className="force-dark fixed inset-0 z-[90] flex flex-col items-center justify-center px-3 pb-4 pt-16 sm:px-20 sm:pb-8 sm:pt-20"
        >
          {/* Backdrop — a click anywhere off the image closes. */}
          <div
            aria-hidden
            onClick={() => onCloseRef.current()}
            className="absolute inset-0 bg-ink-950/90 backdrop-blur-md"
          />

          <button
            ref={closeRef}
            type="button"
            onClick={() => onCloseRef.current()}
            aria-label="Close image viewer"
            className="absolute right-3 top-3 z-10 grid h-11 w-11 place-items-center rounded-xl border border-white/15 bg-ink-900/70 text-steel-200 backdrop-blur transition-colors duration-200 hover:border-white/30 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-volt-400 sm:right-5 sm:top-5"
          >
            <X className="h-5 w-5" />
          </button>

          {many && (
            <>
              <button
                type="button"
                onClick={() => go(-1)}
                aria-label="Previous image"
                className="absolute left-5 top-1/2 z-10 hidden h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-white/15 bg-ink-900/70 text-steel-200 backdrop-blur transition-[color,border-color,transform] duration-200 hover:-translate-x-0.5 hover:border-volt-400/50 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-volt-400 sm:grid"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                aria-label="Next image"
                className="absolute right-5 top-1/2 z-10 hidden h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-white/15 bg-ink-900/70 text-steel-200 backdrop-blur transition-[color,border-color,transform] duration-200 hover:translate-x-0.5 hover:border-volt-400/50 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-volt-400 sm:grid"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}

          {/* The image. Keyed per index so paging cross-slides. The touch
              handlers are the phone swipe; they set no touch-action, so
              pinch-zoom stays with the browser. */}
          <div className="pointer-events-none relative z-[5] flex min-h-0 w-full flex-1 items-center justify-center">
            <AnimatePresence
              initial={false}
              mode="wait"
              custom={dir}
              onExitComplete={() => followX.set(0)}
            >
              <motion.figure
                key={current}
                custom={dir}
                variants={pageVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: reduce ? 0.12 : 0.28, ease: [0.22, 1, 0.36, 1] }}
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
                onTouchCancel={onTouchCancel}
                className="pointer-events-auto m-0 flex max-h-full cursor-default items-center justify-center"
              >
                <motion.img
                  src={item.src}
                  alt={item.alt}
                  draggable={false}
                  style={{ x: followX }}
                  className="block h-auto max-h-[min(78vh,calc(100svh_-_10rem))] w-auto max-w-[min(92vw,1200px)] select-none rounded-2xl border border-white/10 bg-pure object-contain shadow-card"
                />
              </motion.figure>
            </AnimatePresence>
          </div>

          {/* Caption row: title + counter, with prev/next on phones (the side
              arrows would sit on top of the image at that width). */}
          <div className="pointer-events-none relative z-[5] mt-4 flex w-full max-w-2xl shrink-0 items-center justify-center gap-3 [&>button]:pointer-events-auto">
            {many && (
              <button
                type="button"
                onClick={() => go(-1)}
                aria-label="Previous image"
                className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-white/15 bg-ink-900/70 text-steel-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-volt-400 sm:hidden"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
            )}
            <p aria-live="polite" className="min-w-0 text-center">
              {item.title && (
                <span className="block text-sm font-semibold leading-snug text-white">
                  {item.title}
                </span>
              )}
              {many && (
                <span className="mt-0.5 block text-xs tabular-nums tracking-wider text-steel-400">
                  {current + 1} / {count}
                </span>
              )}
            </p>
            {many && (
              <button
                type="button"
                onClick={() => go(1)}
                aria-label="Next image"
                className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-white/15 bg-ink-900/70 text-steel-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-volt-400 sm:hidden"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
