import { useEffect } from "react";

// Tawk.to live-chat widget. The default URL restores the original widget used
// in commit 722717a. VITE_TAWK_SRC can still override it for a future widget:
//   VITE_TAWK_SRC=https://embed.tawk.to/<PROPERTY_ID>/<WIDGET_ID>
const DEFAULT_TAWK_SRC = "https://embed.tawk.to/6a43b6c0554b0c1d4cbe4edc/1jsc83opk";
const TAWK_SRC =
  (import.meta.env.VITE_TAWK_SRC as string | undefined)?.trim() || DEFAULT_TAWK_SRC;

/** Fired on window once Tawk has loaded and its default launcher is hidden. */
export const TAWK_READY_EVENT = "neo:tawk-ready";

/**
 * Pre-emptive CSS hide, installed BEFORE Tawk's script is injected.
 *
 * The JS sweep can only react after Tawk has appended its container AND its
 * iframes, which is ~10s after load on a cold cache — long enough for the
 * launcher and the "We Are Here!" grabber to be plainly visible, which is
 * exactly the flash being reported. A stylesheet costs nothing and applies at
 * first paint, so the widget is never rendered in the first place.
 *
 * Scoped to `body > div[id]:not(#root)` with Tawk's signature z-index so it
 * cannot touch our own fixed UI (FloatingWidgets lives inside #root). It is
 * removed for the duration of an open chat via the `html.neo-chat-open` gate.
 */
const TAWK_SUPPRESS_STYLE_ID = "neo-tawk-suppress";

function installTawkSuppressor() {
  if (document.getElementById(TAWK_SUPPRESS_STYLE_ID)) return;
  const style = document.createElement("style");
  style.id = TAWK_SUPPRESS_STYLE_ID;
  style.textContent = `
html:not(.neo-chat-open) body > div[id]:not(#root):has(> iframe) {
  display: none !important;
}
html:not(.neo-chat-open) body > div[data-neo-tawk-hidden="1"] {
  display: none !important;
}`;
  document.head.appendChild(style);
}

type TawkApi = {
  hideWidget?: () => void;
  showWidget?: () => void;
  maximize?: () => void;
  minimize?: () => void;
  onLoad?: () => void;
  onChatMinimized?: () => void;
  onChatHidden?: () => void;
  onChatEnded?: () => void;
  onChatMaximized?: () => void;
  customStyle?: unknown;
};

declare global {
  interface Window {
    Tawk_API?: TawkApi;
    Tawk_LoadStart?: Date;
  }
}

/**
 * Whether the visitor currently has the conversation open. While it is closed,
 * every piece of Tawk chrome is hidden; while it is open, Tawk owns the corner.
 */
let chatOpen = false;
let sweepScheduled = false;

/**
 * Every top-level element Tawk has appended to <body>.
 *
 * Tawk gives us NOTHING stable to match on: its container is a <div> with a
 * random per-load id (e.g. "fa07nojd7h9g1788444180639"), no class and no title,
 * and every child iframe is `src="about:blank"` (the content is written in via
 * the DOM). So the old selector — iframe[src*="tawk.to"] — matched zero nodes
 * and this whole module silently did nothing: the launcher and the
 * "👋 We Are Here!" attention grabber both flashed on screen for ~10s until
 * Tawk's own script happened to collapse them.
 *
 * The one reliable signature is the stacking context Tawk parks itself in:
 * a direct child of <body> that is not our #root, carrying Tawk's signature
 * z-index of 2000000000 and containing at least one iframe. We keep the
 * z-index check loose (>= 1e9) in case they retune it.
 */
function tawkRoots(): HTMLElement[] {
  const roots = new Set<HTMLElement>();
  for (const el of Array.from(document.body.children)) {
    if (!(el instanceof HTMLElement)) continue;
    if (el.id === "root" || el.tagName === "SCRIPT" || el.tagName === "STYLE") continue;
    // Tawk's own hidden marker survives our display:none, so keep matching a
    // container we have already claimed even once its iframes are torn down.
    if (el.dataset.neoTawkHidden === "1") {
      roots.add(el);
      continue;
    }
    if (!el.querySelector("iframe")) continue;
    const z = Number.parseInt(window.getComputedStyle(el).zIndex, 10);
    if (Number.isFinite(z) && z >= 1_000_000_000) roots.add(el);
  }
  return [...roots];
}

/**
 * Hide (or restore) Tawk's own UI.
 *
 * `Tawk_API.hideWidget()` is the documented way to remove the launcher, but it
 * does NOT remove the attention grabber — the "👋 We Are Here!" balloon with the
 * unread badge that the property has configured. That is rendered in its own
 * container, so it kept reappearing beside our launcher on every page load. We
 * therefore hide the containers directly while the chat is closed, and hand the
 * corner straight back the moment the visitor opens it.
 */
function applyTawkChrome() {
  const hide = !chatOpen;
  // Gate the stylesheet in index.html: while the chat is open Tawk owns the corner.
  document.documentElement.classList.toggle("neo-chat-open", chatOpen);
  for (const root of tawkRoots()) {
    if (hide) {
      root.dataset.neoTawkHidden = "1";
      // Tawk writes `style="display: block !important"` on its own container.
      // An inline !important declaration outranks every stylesheet, so the CSS
      // in index.html cannot win on its own and we must beat it in the same
      // inline block: setProperty(...,"important") replaces that declaration.
      root.style.setProperty("display", "none", "important");
      // Belt and braces: Tawk sizes the launcher via these too, so a future
      // widget that drops the display rule still can't paint.
      root.style.setProperty("visibility", "hidden", "important");
      root.style.setProperty("pointer-events", "none", "important");
    } else if (root.dataset.neoTawkHidden) {
      delete root.dataset.neoTawkHidden;
      root.style.removeProperty("display");
      root.style.removeProperty("visibility");
      root.style.removeProperty("pointer-events");
    }
  }
}

/** Coalesce repeated calls into one pass per frame. */
function scheduleTawkSweep() {
  // Hide synchronously: waiting for the next animation frame is exactly long
  // enough for Tawk's launcher to be composited once, which is the flash.
  applyTawkChrome();
  if (sweepScheduled) return;
  sweepScheduled = true;
  // …and once more after layout settles, for containers added mid-frame.
  requestAnimationFrame(() => {
    sweepScheduled = false;
    applyTawkChrome();
  });
}

/** Hide Tawk's own bubble, greeting and attention grabber. Safe to spam. */
function hideStockWidget() {
  chatOpen = false;
  try {
    window.Tawk_API?.hideWidget?.();
  } catch {
    /* the widget may not be mounted yet — the DOM sweep below covers it */
  }
  applyTawkChrome();
}

/** True once Tawk is loaded and can be opened from our own launcher. */
export function isTawkReady() {
  return typeof window !== "undefined" && typeof window.Tawk_API?.maximize === "function";
}

/**
 * Opens the Tawk chat window from OUR launcher button.
 *
 * The stock Tawk bubble is permanently hidden (see below), so the widget has to
 * be un-hidden for the frame in which it maximises, then re-hidden the moment
 * the visitor minimises or ends the chat.
 *
 * Returns false when Tawk never loaded (blocked by an ad-blocker, offline, …)
 * so the caller can fall back to another channel.
 */
export function openTawkChat(): boolean {
  const api = window.Tawk_API;
  if (typeof api?.maximize !== "function") return false;
  try {
    // Un-hide FIRST: a display:none container has no layout, and Tawk won't
    // open a window it can't measure.
    chatOpen = true;
    applyTawkChrome();
    api.showWidget?.();
    api.maximize();
    return true;
  } catch {
    chatOpen = false;
    applyTawkChrome();
    return false;
  }
}

/**
 * Injects the Tawk.to script once on mount.
 *
 * Two things are deliberately suppressed here:
 *
 *  1. **The stock launcher.** Tawk drops its own green bubble in the bottom-right
 *     corner, at its own offset — which left an awkward gap above our WhatsApp
 *     button and put the two out of line. `hideWidget()` on load removes it, and
 *     `components/FloatingWidgets.tsx` renders a matching launcher in the same
 *     column so both buttons sit on one axis with one consistent gap.
 *
 *  2. **The "👋 Hi! How can we help?" greeting.** That balloon (and its
 *     "I have a question" / "Tell me more" quick replies) is part of the widget
 *     container, so hiding the container hides the greeting too — the chat only
 *     ever appears when the visitor actually clicks to open it.
 */
export function TawkChat() {
  useEffect(() => {
    const cleanup: Array<() => void> = [];

    installTawkSuppressor();

    const api: TawkApi = window.Tawk_API || {};
    window.Tawk_API = api;
    window.Tawk_LoadStart = new Date();

    // Hide the stock bubble + greeting the instant the widget is ready, and
    // announce readiness so our own launcher can appear.
    api.onLoad = () => {
      hideStockWidget();
      window.dispatchEvent(new Event(TAWK_READY_EVENT));
    };
    // Whenever the visitor closes the conversation, go back to hidden so the
    // stock bubble never reappears beside ours.
    api.onChatMinimized = hideStockWidget;
    api.onChatHidden = hideStockWidget;
    api.onChatEnded = hideStockWidget;
    // Tawk maximising on its own (a proactive invite the visitor accepted, an
    // agent starting the chat) must not be immediately swept away.
    api.onChatMaximized = () => {
      chatOpen = true;
      applyTawkChrome();
    };

    // Tawk injects its containers asynchronously and re-injects the attention
    // grabber on its own schedule, so a one-shot hide is not enough: watch
    // <body> and re-apply on every mutation while the chat is closed.
    // subtree:true matters — Tawk appends the container EMPTY and injects the
    // iframes a moment later, so a childList-only watch on <body> fires before
    // the node is recognisable and then never again.
    // Watch childList AND the `style` attribute: Tawk appends the container
    // empty, fills it a moment later, and then writes
    // `display: block !important` onto it — each of which must re-trigger the
    // sweep or the widget paints in the gap between ticks.
    const observer = new MutationObserver(scheduleTawkSweep);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["style"],
    });
    cleanup.push(() => observer.disconnect());

    // Belt and braces for the first few seconds, before the observer has
    // anything to react to.
    // Tawk's container lands ~10-11s after load on a cold cache, so this net
    // has to outlive that; the old 20 x 400ms = 8s window expired first.
    let tries = 0;
    const initial = window.setInterval(() => {
      if (!chatOpen) hideStockWidget();
      if (++tries >= 75) window.clearInterval(initial);
    }, 400);
    cleanup.push(() => window.clearInterval(initial));

    // Inject once, but ONLY the injection is guarded. The observer and the
    // sweep above must be installed on EVERY mount: in StrictMode the effect
    // runs, is cleaned up, then runs again — an early `return` on this guard
     // left the second pass with no observer at all, so nothing was ever
    // hidden and Tawk's launcher painted freely. That was the flash.
    if (!document.getElementById("tawk-script")) {
      const s = document.createElement("script");
      s.id = "tawk-script";
      s.async = true;
      s.src = TAWK_SRC;
      s.charset = "UTF-8";
      s.setAttribute("crossorigin", "*");
      document.body.appendChild(s);
    }

    return () => cleanup.forEach((fn) => fn());
  }, []);

  return null;
}
