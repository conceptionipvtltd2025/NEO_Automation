import { useEffect } from "react";

// Tawk.to live-chat widget. The default URL restores the original widget used
// in commit 722717a. VITE_TAWK_SRC can still override it for a future widget:
//   VITE_TAWK_SRC=https://embed.tawk.to/<PROPERTY_ID>/<WIDGET_ID>
const DEFAULT_TAWK_SRC = "https://embed.tawk.to/6a43b6c0554b0c1d4cbe4edc/1jsc83opk";
const TAWK_SRC =
  (import.meta.env.VITE_TAWK_SRC as string | undefined)?.trim() || DEFAULT_TAWK_SRC;

/** Fired on window once Tawk has loaded and its default launcher is hidden. */
export const TAWK_READY_EVENT = "neo:tawk-ready";

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
 * Found by walking up from Tawk's own iframes rather than by class name: Tawk
 * ships several containers (launcher, chat window, and the "attention grabber"
 * balloon) and renames their classes between widget versions, so matching on
 * the iframe origin is the only stable handle.
 */
function tawkRoots(): HTMLElement[] {
  const roots = new Set<HTMLElement>();
  const frames = document.querySelectorAll<HTMLIFrameElement>(
    'iframe[src*="tawk.to"], iframe[title*="chat widget" i]'
  );
  frames.forEach((f) => {
    let el: HTMLElement = f;
    while (el.parentElement && el.parentElement !== document.body) {
      el = el.parentElement;
    }
    if (el.parentElement === document.body) roots.add(el);
  });
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
  for (const root of tawkRoots()) {
    if (hide) {
      root.dataset.neoTawkHidden = "1";
      root.style.setProperty("display", "none", "important");
    } else if (root.dataset.neoTawkHidden) {
      delete root.dataset.neoTawkHidden;
      root.style.removeProperty("display");
    }
  }
}

/** Coalesce repeated calls into one pass per frame. */
function scheduleTawkSweep() {
  if (sweepScheduled) return;
  sweepScheduled = true;
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
    // Guard against a double-inject (StrictMode dev double-mount / HMR).
    if (document.getElementById("tawk-script")) return;

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
    const observer = new MutationObserver(scheduleTawkSweep);
    observer.observe(document.body, { childList: true, subtree: false });
    cleanup.push(() => observer.disconnect());

    // Belt and braces for the first few seconds, before the observer has
    // anything to react to.
    let tries = 0;
    const initial = window.setInterval(() => {
      if (!chatOpen) hideStockWidget();
      if (++tries >= 20) window.clearInterval(initial);
    }, 400);
    cleanup.push(() => window.clearInterval(initial));

    const s = document.createElement("script");
    s.id = "tawk-script";
    s.async = true;
    s.src = TAWK_SRC;
    s.charset = "UTF-8";
    s.setAttribute("crossorigin", "*");
    document.body.appendChild(s);

    return () => cleanup.forEach((fn) => fn());
  }, []);

  return null;
}
