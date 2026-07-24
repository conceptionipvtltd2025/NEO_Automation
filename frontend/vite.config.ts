import { defineConfig, createLogger } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// Where /api and /uploads are proxied in dev. Point this at the live API
// (VITE_API_PROXY=https://cidev.in/neo_website_backend) to work on the frontend
// without running MySQL + the local backend at all.
const API_TARGET = process.env.VITE_API_PROXY || "http://localhost:4000";

// When the backend isn't running, every catalogue request makes Vite print a
// full AggregateError [ECONNREFUSED] stack — several per page load. The app
// falls back to seed data in that case, so the useful signal is ONE line, not a
// stack per request. Only connection-refused is collapsed: a proxy error from a
// backend that *is* running still prints in full.
const logger = createLogger();
const baseError = logger.error;
let offlineNoticeShown = false;
const noteBackendOnline = () => {
  offlineNoticeShown = false;
};
logger.error = (msg, opts) => {
  const refused =
    msg.includes("http proxy error") &&
    (msg.includes("ECONNREFUSED") || msg.includes("ECONNRESET"));
  if (refused) {
    if (!offlineNoticeShown) {
      offlineNoticeShown = true;
      baseError(
        `  ⚠  backend not reachable at ${API_TARGET} — the site is running on seed data.\n` +
          `     Start it with:  npm --prefix backend run dev   (needs MySQL running)\n` +
          `     Or proxy to the live API:  VITE_API_PROXY=https://cidev.in/neo_website_backend npm run dev`,
        opts
      );
    }
    return;
  }
  baseError(msg, opts);
};

export default defineConfig({
  customLogger: logger,
  plugins: [react()],
  base: "/neo-website/",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 5173,
    host: true,
    watch: {
      // Never watch build artifacts / archives dropped in the project — a
      // locked `dist.zip` (created while zipping the build) was crashing the
      // dev server with `EBUSY: resource busy or locked, watch 'dist.zip'`.
      ignored: ["**/dist/**", "**/*.zip"],
    },
    proxy: {
      // Proxy API calls to the backend (backend/) in dev so there are no CORS
      // issues and the frontend can just call "/api/...".
      "/api": {
        target: API_TARGET,
        changeOrigin: true,
        // When the backend isn't running the frontend falls back to seed data,
        // so a refused connection is expected in dev — answer with a clean 503
        // rather than letting the request hang. The matching terminal noise is
        // collapsed by `logger` above.
        configure: (proxy) => {
          proxy.on("error", (_err, _req, res) => {
            const r = res as import("http").ServerResponse | undefined;
            if (r && "writeHead" in r) {
              if (!r.headersSent) {
                r.writeHead(503, { "Content-Type": "application/json" });
              }
              r.end(JSON.stringify({ error: "backend unavailable (dev)" }));
            }
          });
          // Backend came back — re-arm the offline notice so a later outage is
          // reported again instead of being silently swallowed.
          proxy.on("proxyRes", () => noteBackendOnline());
        },
      },
      // Uploaded product images are served by the backend from /uploads; proxy
      // them too so the relative URL stays same-origin (and https-safe) in dev.
      "/uploads": {
        target: API_TARGET,
        changeOrigin: true,
      },
    },
  },
  build: {
    chunkSizeWarningLimit: 900,
    rollupOptions: {
      output: {
        manualChunks: {
          three: ["three", "@react-three/fiber", "@react-three/drei"],
          motion: ["framer-motion"],
          vendor: ["react", "react-dom", "react-router-dom"],
        },
      },
    },
  },
});
