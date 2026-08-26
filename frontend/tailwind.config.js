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
        // "Titanium & Pastel" accent family. Legacy keys (volt/iris/aurora) kept
        // so existing utilities re-skin for free — they now hold vibrant pastels.
        // volt = SKY (primary pastel accent)
        volt: {
          400: "#7dc9f5",
          500: "#4fb6f0",
          600: "#2f9fe0",
        },
        // iris = PERIWINKLE (cool violet-blue pastel)
        iris: {
          300: "#b3baf7",
          400: "#949df3",
          500: "#7c86f0",
          600: "#5b64e8",
        },
        // aurora = MINT (fresh teal-mint pastel)
        aurora: {
          300: "#9cecd6",
          400: "#6fe0c0",
          500: "#4fd9b4",
          600: "#22b899",
        },
        // Explicit pastel names for new work
        periwinkle: {
          400: "#949df3",
          500: "#7c86f0",
          600: "#5b64e8",
        },
        sky: {
          400: "#7dc9f5",
          500: "#4fb6f0",
          600: "#2f9fe0",
        },
        mint: {
          400: "#6fe0c0",
          500: "#4fd9b4",
          600: "#22b899",
        },
        // Brushed-titanium neutral (for metallic surfaces/text)
        titanium: {
          300: "#e2e6ec",
          400: "#c3cad6",
          500: "#9aa3b2",
          600: "#6b7482",
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
      fontSize: {
        // Bumped one notch across the board for legibility — the old 12px
        // captions and 14px body copy were hard to read for many visitors.
        // Line-heights are set alongside so denser blocks stay comfortable.
        "2xs": ["0.8125rem", { lineHeight: "1.15rem" }], // 13px
        xs: ["0.845rem", { lineHeight: "1.25rem" }], // 13.5px (was 12px)
        sm: ["0.97rem", { lineHeight: "1.55rem" }], // 15.5px (was 14px)
        base: ["1.09rem", { lineHeight: "1.8rem" }], // 17.5px (was 16px)
        lg: ["1.21rem", { lineHeight: "1.9rem" }], // 19.4px (was 18px)
        xl: ["1.33rem", { lineHeight: "1.95rem" }], // 21.3px (was 20px)
        "2xl": ["1.6rem", { lineHeight: "2.1rem" }], // 25.6px (was 24px)
        "3xl": ["1.95rem", { lineHeight: "2.35rem" }], // 31px (was 30px)
        "4xl": ["2.35rem", { lineHeight: "2.6rem" }], // 37.6px (was 36px)
        "5xl": ["3rem", { lineHeight: "1.08" }],
        "6xl": ["3.75rem", { lineHeight: "1.05" }],
        "7xl": ["4.5rem", { lineHeight: "1.03" }],
        "8xl": ["6rem", { lineHeight: "1" }],
        "9xl": ["8rem", { lineHeight: "1" }],
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
          "radial-gradient(circle at 50% 0%, rgba(124,134,240,0.16), transparent 60%)",
        "radial-aurora":
          "radial-gradient(circle at 50% 0%, rgba(124,134,240,0.16), transparent 55%), radial-gradient(circle at 85% 20%, rgba(79,217,180,0.13), transparent 55%)",
        "neo-gradient":
          "linear-gradient(135deg, #ed1c24 0%, #ff5d5d 50%, #ff2a2a 100%)",
        // Signature pastel ribbon: periwinkle → sky → mint
        aurora: "linear-gradient(120deg, #7c86f0 0%, #4fb6f0 46%, #4fd9b4 100%)",
        "aurora-soft":
          "linear-gradient(120deg, rgba(124,134,240,0.22), rgba(79,182,240,0.16) 50%, rgba(79,217,180,0.20))",
        // brushed-titanium metal sheen
        "titanium-sheen":
          "linear-gradient(120deg, #e2e6ec 0%, #9aa3b2 40%, #e2e6ec 55%, #6b7482 100%)",
        // pastel ribbon with a brand-red kiss
        "aurora-hot":
          "linear-gradient(120deg, #ed1c24 0%, #7c86f0 45%, #4fb6f0 75%, #4fd9b4 100%)",
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
        "aurora-pan": "gradient-pan 12s ease infinite",
      },
    },
  },
  plugins: [],
};
