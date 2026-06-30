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
    proxy: {
      // Proxy API calls to the backend (backend/) in dev so there are no CORS
      // issues and the frontend can just call "/api/...".
      "/api": {
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
