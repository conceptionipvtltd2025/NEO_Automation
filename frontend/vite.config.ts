import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
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
        target: process.env.VITE_API_PROXY || "http://localhost:4000",
        changeOrigin: true,
        // When the backend isn't running the frontend falls back to seed data,
        // so a refused connection is expected in dev — return a clean 503
        // instead of spamming the terminal with AggregateError stack traces.
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
        },
      },
      // Uploaded product images are served by the backend from /uploads; proxy
      // them too so the relative URL stays same-origin (and https-safe) in dev.
      "/uploads": {
        target: process.env.VITE_API_PROXY || "http://localhost:4000",
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
