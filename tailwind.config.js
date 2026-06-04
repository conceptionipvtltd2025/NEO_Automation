/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: { "2xl": "1400px" },
    },
    extend: {
      colors: {
        // Core surface palette — driven by CSS variables so a single
        // `.light` class on <html> flips the whole site (see index.css).
        // Dark theme = the original premium black scale.
        ink: {
          950: "rgb(var(--ink-950) / <alpha-value>)",
          900: "rgb(var(--ink-900) / <alpha-value>)",
          850: "rgb(var(--ink-850) / <alpha-value>)",
          800: "rgb(var(--ink-800) / <alpha-value>)",
          700: "rgb(var(--ink-700) / <alpha-value>)",
          600: "rgb(var(--ink-600) / <alpha-value>)",
          500: "rgb(var(--ink-500) / <alpha-value>)",
        },
        // Foreground + translucent-overlay token. Flips to near-ink in light
        // mode, so `text-white` headings and `bg-white/[x]` glass invert too.
        white: "rgb(var(--fg) / <alpha-value>)",
        // Always-true white, for text/icons sitting on a colored fill
        // (red buttons, badges, the chat header) that must stay white.
        pure: "#ffffff",
        // NEO brand red
        neo: {
          50: "#fff1f1",
          100: "#ffe0e0",
          200: "#ffc6c6",
          300: "#ff9d9d",
          400: "#ff5d5d",
          500: "#ff2a2a",
          600: "#ed1c24", // primary NEO red
          700: "#c70f17",
          800: "#a30d14",
          900: "#871217",
        },
        // Industrial electric accent
        volt: {
          400: "#5ed6ff",
          500: "#22b8ff",
          600: "#0a93e6",
        },
        steel: {
          100: "rgb(var(--steel-100) / <alpha-value>)",
          200: "rgb(var(--steel-200) / <alpha-value>)",
          300: "rgb(var(--steel-300) / <alpha-value>)",
          400: "rgb(var(--steel-400) / <alpha-value>)",
          500: "rgb(var(--steel-500) / <alpha-value>)",
          600: "rgb(var(--steel-600) / <alpha-value>)",
          700: "rgb(var(--steel-700) / <alpha-value>)",
        },
      },
      fontFamily: {
        sans: ["Sora", "Inter", "system-ui", "sans-serif"],
        display: ["Clash Display", "Sora", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "monospace"],
      },
      backgroundImage: {
        "grid-dark":
          "linear-gradient(to right, rgb(var(--grid-line) / 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgb(var(--grid-line) / 0.05) 1px, transparent 1px)",
        "radial-glow":
          "radial-gradient(circle at 50% 0%, rgba(237,28,36,0.18), transparent 60%)",
        "neo-gradient":
          "linear-gradient(135deg, #ed1c24 0%, #ff5d5d 50%, #ff2a2a 100%)",
      },
      boxShadow: {
        glow: "0 0 40px -10px rgba(237,28,36,0.55)",
        "glow-sm": "0 0 20px -6px rgba(237,28,36,0.5)",
        "glow-volt": "0 0 40px -10px rgba(34,184,255,0.5)",
        card: "var(--shadow-card)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "spin-slow": {
          to: { transform: "rotate(360deg)" },
        },
        float: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-12px)" },
        },
        "border-flow": {
          "0%,100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
        "pulse-glow": {
          "0%,100%": { opacity: "0.4" },
          "50%": { opacity: "1" },
        },
        "grid-move": {
          "0%": { transform: "translateY(0)" },
          "100%": { transform: "translateY(40px)" },
        },
        "gradient-pan": {
          "0%,100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        shine: {
          "0%": { transform: "translateX(-130%) skewX(-12deg)" },
          "100%": { transform: "translateX(130%) skewX(-12deg)" },
        },
        "float-x": {
          "0%,100%": { transform: "translateX(0)" },
          "50%": { transform: "translateX(10px)" },
        },
        "bob": {
          "0%,100%": { transform: "translateY(0) rotate(-1deg)" },
          "50%": { transform: "translateY(-6px) rotate(1deg)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.7s cubic-bezier(0.22,1,0.36,1) forwards",
        shimmer: "shimmer 3s linear infinite",
        "spin-slow": "spin-slow 14s linear infinite",
        float: "float 6s ease-in-out infinite",
        "border-flow": "border-flow 4s ease infinite",
        marquee: "marquee 28s linear infinite",
        "pulse-glow": "pulse-glow 3s ease-in-out infinite",
        "grid-move": "grid-move 4s linear infinite",
        "gradient-pan": "gradient-pan 8s ease infinite",
        shine: "shine 1.1s cubic-bezier(0.22,1,0.36,1)",
        "float-x": "float-x 7s ease-in-out infinite",
        bob: "bob 5s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
