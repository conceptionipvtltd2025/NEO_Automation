import { useEffect } from "react";

// Tawk.to live-chat widget. The property/widget path comes straight from the
// embed snippet in the Tawk dashboard (Admin → Channels → Chat Widget):
//   https://embed.tawk.to/<PROPERTY_ID>/<WIDGET_ID>
const TAWK_SRC = "https://embed.tawk.to/6a43b6c0554b0c1d4cbe4edc/1jsc83opk";

/**
 * Injects the Tawk.to script once on mount. Kept as a component (rather than a
 * hard-coded tag in index.html) so it lives with the app, loads after first
 * paint, and is easy to gate/remove later. The widget itself renders into its
 * own DOM/iframe that Tawk appends to <body>, docked bottom-right.
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
