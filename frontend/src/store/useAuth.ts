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
  /** Set when a session was dropped because its token was no longer valid. */
  sessionExpired: boolean;
  login: (u: string, p: string) => Promise<LoginResult>;
  logout: () => void;
  /** Drop the session and tell the login screen why. */
  expireSession: () => void;
  /** Validate the persisted session; call it when the admin area mounts. */
  checkSession: () => Promise<void>;
};

/**
 * True when a JWT's own `exp` claim is in the past.
 *
 * The login state is persisted in localStorage but the token only lives 7 days
 * (JWT_EXPIRES_IN), so a panel left open — or reopened weeks later — used to
 * look signed in while every write came back 401. Reading `exp` catches that
 * with no round trip; anything unreadable is treated as expired.
 */
function isTokenExpired(token: string): boolean {
  try {
    const payload = token.split(".")[1];
    if (!payload) return true;
    const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    const { exp } = JSON.parse(json) as { exp?: number };
    if (!exp) return false; // no expiry claim — let the server decide
    return exp * 1000 <= Date.now();
  } catch {
    return true;
  }
}

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
        set({
          isAuthed: true,
          user,
          token,
          attempts: 0,
          lockedUntil: null,
          sessionExpired: false,
        });
      };

      return {
        isAuthed: false,
        user: null,
        token: null,
        attempts: 0,
        lockedUntil: null,
        sessionExpired: false,

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
            // 503 is the exception: the Vite dev proxy answers with it when the
            // backend isn't running, so it means "unreachable", not "rejected"
            // — without this the offline demo fallback below could never fire
            // in dev, and a failed attempt would be recorded against the user.
            if (err instanceof ApiError && err.status !== 503) {
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
          set({ isAuthed: false, user: null, token: null, sessionExpired: false });
        },

        expireSession: () => {
          setToken(null);
          set({ isAuthed: false, user: null, token: null, sessionExpired: true });
        },

        checkSession: async () => {
          const { isAuthed, token, expireSession } = get();
          if (!isAuthed) return;
          // Cheap local check first — an expired JWT needs no round trip.
          if (token && isTokenExpired(token)) {
            expireSession();
            return;
          }
          try {
            await api.get("/auth/me");
            set({ sessionExpired: false });
          } catch (err) {
            // Only a real rejection ends the session. A network error means the
            // backend is unreachable, and the panel is meant to stay usable
            // offline (it falls back to the persisted catalogue).
            if (err instanceof ApiError && err.status === 401) expireSession();
          }
        },
      };
    },
    { name: "neo-auth" }
  )
);
