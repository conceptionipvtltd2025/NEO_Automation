import { create } from "zustand";
import { persist } from "zustand/middleware";

type AuthState = {
  isAuthed: boolean;
  user: string | null;
  attempts: number;
  lockedUntil: number | null;
  login: (u: string, p: string) => { ok: boolean; error?: string };
  logout: () => void;
};

// Demo credentials (AR-01). In production these are server-side + hashed.
const DEMO_USER = "admin";
const DEMO_PASS = "neo@2026";
const MAX_ATTEMPTS = 5;
const LOCK_MS = 1000 * 60 * 2;

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      isAuthed: false,
      user: null,
      attempts: 0,
      lockedUntil: null,
      login: (u, pw) => {
        const { lockedUntil, attempts } = get();
        if (lockedUntil && Date.now() < lockedUntil) {
          const secs = Math.ceil((lockedUntil - Date.now()) / 1000);
          return { ok: false, error: `Locked. Try again in ${secs}s.` };
        }
        if (u.trim() === DEMO_USER && pw === DEMO_PASS) {
          set({ isAuthed: true, user: u, attempts: 0, lockedUntil: null });
          return { ok: true };
        }
        const next = attempts + 1;
        if (next >= MAX_ATTEMPTS) {
          set({ attempts: 0, lockedUntil: Date.now() + LOCK_MS });
          return { ok: false, error: "Too many attempts. Locked for 2 min." };
        }
        set({ attempts: next });
        return {
          ok: false,
          error: `Invalid credentials. ${MAX_ATTEMPTS - next} attempts left.`,
        };
      },
      logout: () => set({ isAuthed: false, user: null }),
    }),
    { name: "neo-auth" }
  )
);
