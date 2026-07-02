import { useEffect } from "react";

// Tawk.to live-chat widget. Provide the embed URL from your Tawk dashboard
// (Admin → Channels → Chat Widget) via an env var so no placeholder ID ships:
//   VITE_TAWK_SRC=https://embed.tawk.to/<PROPERTY_ID>/<WIDGET_ID>
// When it's not set the widget is simply skipped (no script, no console errors).
const TAWK_SRC = (import.meta.env.VITE_TAWK_SRC as string | undefined)?.trim();

/**
 * Injects the Tawk.to script once on mount — but only when a real embed URL is
 * configured. Kept as a component (rather than a hard-coded tag in index.html)
 * so it lives with the app, loads after first paint, and is easy to gate. The
 * widget renders into its own DOM/iframe that Tawk appends to <body>.
 */
export function TawkChat() {
  useEffect(() => {
    if (!TAWK_SRC) return; // not configured — do nothing
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
    document.body.appendChild(s);
  }, []);

  return null;
}
