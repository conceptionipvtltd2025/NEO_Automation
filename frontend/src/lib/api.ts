/**
 * Tiny fetch client for the Neo Automation backend.
 *
 * - Base URL is `/api` (proxied to the backend by Vite in dev), or VITE_API_URL.
 * - Sends the admin JWT (stored under `neo_token`) as a Bearer header.
 * - Times out quickly so the stores can fall back to local data when the
 *   backend is down (the site never hard-breaks if MySQL/the API is offline).
 */

const BASE = (import.meta.env.VITE_API_URL as string) || "/api";
export const TOKEN_KEY = "neo_token";
const TIMEOUT_MS = 8000;

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export function getToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setToken(token: string | null) {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  } catch {
    /* ignore storage errors */
  }
}

type Options = {
  method?: string;
  body?: unknown;
  auth?: boolean;
};

async function request<T = any>(path: string, opts: Options = {}): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  const headers: Record<string, string> = {};
  if (opts.body !== undefined) headers["Content-Type"] = "application/json";
  const token = getToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;

  try {
    const res = await fetch(`${BASE}${path}`, {
      method: opts.method || "GET",
      headers,
      body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
      signal: controller.signal,
    });

    if (!res.ok) {
      let message = res.statusText;
      try {
        const data = await res.json();
        if (data?.error) message = data.error;
      } catch {
        /* non-JSON error body */
      }
      throw new ApiError(message, res.status);
    }

    if (res.status === 204) return undefined as T;
    return (await res.json()) as T;
  } finally {
    clearTimeout(timer);
  }
}

export const api = {
  get: <T = any>(path: string) => request<T>(path, { method: "GET" }),
  post: <T = any>(path: string, body?: unknown) =>
    request<T>(path, { method: "POST", body }),
  put: <T = any>(path: string, body?: unknown) =>
    request<T>(path, { method: "PUT", body }),
  patch: <T = any>(path: string, body?: unknown) =>
    request<T>(path, { method: "PATCH", body }),
  del: <T = any>(path: string) => request<T>(path, { method: "DELETE" }),
};

/** True when the API responds to a health check — used to decide online vs fallback. */
export async function apiReachable(): Promise<boolean> {
  try {
    await api.get("/health");
    return true;
  } catch {
    return false;
  }
}
