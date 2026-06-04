import { create } from "zustand";

export type Theme = "dark" | "light";

const STORAGE_KEY = "neo-theme";

function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "dark";
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === "light" || stored === "dark") return stored;
  return "dark"; // brand default — the black theme
}

/** Reflect the theme onto <html>: class, color-scheme and the browser chrome. */
function applyTheme(theme: Theme, animate: boolean) {
  const el = document.documentElement;

  if (animate) {
    el.classList.add("theme-anim");
    window.setTimeout(() => el.classList.remove("theme-anim"), 450);
  }

  el.classList.remove("light", "dark");
  el.classList.add(theme);
  el.style.colorScheme = theme;

  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", theme === "light" ? "#f7f8fa" : "#050507");
}

type ThemeState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggle: () => void;
};

export const useTheme = create<ThemeState>((set, get) => ({
  theme: getInitialTheme(),
  setTheme: (theme) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      /* ignore storage failures (private mode etc.) */
    }
    applyTheme(theme, true);
    set({ theme });
  },
  toggle: () => get().setTheme(get().theme === "dark" ? "light" : "dark"),
}));
