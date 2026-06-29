import { create } from "zustand";
import { persist } from "zustand/middleware";
import { api, ApiError, setToken } from "@/lib/api";

type LoginResult = { ok: boolean; error?: string };

type AuthState = {
  isAuthed: boolean;
  user: string | null;
  token: string | null;
  attempts: number;
  lockedUntil: number | null;
  login: (u: string, p: string) => Promise<LoginResult>;
  logout: () => void;
};

// Fallback demo credentials (AR-01) — used only if the backend is unreachable.
// When the API is up, authentication is server-side (bcrypt + JWT).
const DEMO_USER = "admin";
const DEMO_PASS = "neo@2026";
const MAX_ATTEMPTS = 5;
const LOCK_MS = 1000 * 60 * 2;

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => {
      // shared failed-attempt / lockout bookkeeping
      const registerFail = (): LoginResult => {
        const next = get().attempts + 1;
        if (next >= MAX_ATTEMPTS) {
          set({ attempts: 0, lockedUntil: Date.now() + LOCK_MS });
          return { ok: false, error: "Too many attempts. Locked for 2 min." };
        }
        set({ attempts: next });
        return {
          ok: false,
          error: `Invalid credentials. ${MAX_ATTEMPTS - next} attempts left.`,
        };
      };

      const succeed = (user: string, token: string | null) => {
        setToken(token);
        set({ isAuthed: true, user, token, attempts: 0, lockedUntil: null });
      };

      return {
        isAuthed: false,
        user: null,
        token: null,
        attempts: 0,
        lockedUntil: null,

        login: async (u, pw) => {
          const { lockedUntil } = get();
          if (lockedUntil && Date.now() < lockedUntil) {
            const secs = Math.ceil((lockedUntil - Date.now()) / 1000);
            return { ok: false, error: `Locked. Try again in ${secs}s.` };
          }

          const username = u.trim();
          try {
            const res = await api.post<{ token: string; user: string }>(
              "/auth/login",
              { username, password: pw }
            );
            succeed(res.user, res.token);
            return { ok: true };
          } catch (err) {
            // Server reachable but rejected the credentials.
            if (err instanceof ApiError) {
              return registerFail();
            }
            // Network error / backend down → fall back to local demo check.
            if (username === DEMO_USER && pw === DEMO_PASS) {
              succeed(username, null);
              return { ok: true };
            }
            return registerFail();
          }
        },

        logout: () => {
          setToken(null);
          set({ isAuthed: false, user: null, token: null });
        },
      };
    },
    { name: "neo-auth" }
  )
);
