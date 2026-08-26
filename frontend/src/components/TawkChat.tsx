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
  customStyle?: unknown;
};

declare global {
  interface Window {
    Tawk_API?: TawkApi;
    Tawk_LoadStart?: Date;
  }
}

/** Hide Tawk's own bubble + any proactive greeting balloon. Safe to spam. */
function hideStockWidget() {
  try {
    window.Tawk_API?.hideWidget?.();
  } catch {
    /* the widget may not be mounted yet — callers retry */
  }
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
    api.showWidget?.();
    api.maximize();
    return true;
  } catch {
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
    // Guard against a double-inject (StrictMode dev double-mount / HMR).
    if (document.getElementById("tawk-script")) return;

    const api: TawkApi = window.Tawk_API || {};
    window.Tawk_API = api;
    window.Tawk_LoadStart = new Date();

    // Hide the stock bubble + greeting the instant the widget is ready, and
    // announce readiness so our own launcher can appear.
    api.onLoad = () => {
      hideStockWidget();
      // A proactive/greeting balloon can be injected a beat AFTER onLoad, so
      // sweep a few more times before giving up. Cheap, and it guarantees the
      // "👋 Hi! How can we help?" bubble never gets a frame on screen.
      let tries = 0;
      const sweep = window.setInterval(() => {
        hideStockWidget();
        if (++tries >= 12) window.clearInterval(sweep);
      }, 500);
      window.dispatchEvent(new Event(TAWK_READY_EVENT));
    };
    // Whenever the visitor closes the conversation, go back to hidden so the
    // stock bubble never reappears beside ours.
    api.onChatMinimized = hideStockWidget;
    api.onChatHidden = hideStockWidget;
    api.onChatEnded = hideStockWidget;

    const s = document.createElement("script");
    s.id = "tawk-script";
    s.async = true;
    s.src = TAWK_SRC;
    s.charset = "UTF-8";
    s.setAttribute("crossorigin", "*");
    document.body.appendChild(s);
  }, []);

  return null;
}
