import { useEffect } from "react";

// Tawk.to live-chat widget. The default URL restores the original widget used
// in commit 722717a. VITE_TAWK_SRC can still override it for a future widget:
//   VITE_TAWK_SRC=https://embed.tawk.to/<PROPERTY_ID>/<WIDGET_ID>
const DEFAULT_TAWK_SRC = "https://embed.tawk.to/6a43b6c0554b0c1d4cbe4edc/1jsc83opk";
const TAWK_SRC =
  (import.meta.env.VITE_TAWK_SRC as string | undefined)?.trim() || DEFAULT_TAWK_SRC;

/**
 * Injects the Tawk.to script once on mount. Kept as a component (rather than a
 * hard-coded tag in index.html) so it lives with the app, loads after first
 * paint, and is easy to gate. The widget renders into its own DOM/iframe that
 * Tawk appends to <body>.
 */
export function TawkChat() {
  useEffect(() => {
    // Guard against a double-inject (StrictMode dev double-mount / HMR).
    if (document.getElementById("tawk-script")) return;

    // Tawk's API globals — set before the script loads.
    (window as unknown as { Tawk_API?: unknown }).Tawk_API =
      (window as unknown as { Tawk_API?: unknown }).Tawk_API || {};
    (window as unknown as { Tawk_LoadStart?: Date }).Tawk_LoadStart = new Date();

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
