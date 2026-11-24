import type { AuthUser } from "./types";

export const TOKEN_KEY = "token";
export const USER_KEY = "user";
export const AUTH_CHANGE_EVENT = "mentorlagbe:auth-change";

const KNOWN_ROLES = ["student", "tutor", "admin"];

/**
 * `/auth/me` returns the raw Mongo document (`_id` / `profileImage`) while the
 * rest of the client expects the canonical AuthUser shape (`id` / `image`).
 * Normalizing here keeps avatars and stored sessions intact after a reload.
 */
export function normalizeUser(raw: AuthUser & { _id?: string; profileImage?: string }): AuthUser {
  return {
    ...raw,
    id: raw.id || String(raw._id || ""),
    image: raw.image || raw.profileImage || "",
  };
}

/** Only allow internal relative paths as post-login redirect targets. */
export function safeNextPath(value: string | null | undefined, fallback: string): string {
  if (!value || !value.startsWith("/") || value.startsWith("//")) return fallback;
  if (value.startsWith("/sign-in") || value.startsWith("/sign-up")) return fallback;
  return value;
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;

  // `||` (not `??`) so an empty localStorage entry never masks a valid
  // sessionStorage token.
  return (
    window.localStorage.getItem(TOKEN_KEY) ||
    window.sessionStorage.getItem(TOKEN_KEY) ||
    null
  );
}

/** Which storage actually owns the active session. */
function activeStorage(): Storage | null {
  if (typeof window === "undefined") return null;

  if (window.localStorage.getItem(TOKEN_KEY)) return window.localStorage;
  if (window.sessionStorage.getItem(TOKEN_KEY)) return window.sessionStorage;

  return window.localStorage;
}

export function getStoredUser(): AuthUser | null {
  if (typeof window === "undefined") return null;

  const storage = activeStorage();
  if (!storage) return null;

  const raw = storage.getItem(USER_KEY);

  if (!raw) return null;

  try {
    const parsed = normalizeUser(JSON.parse(raw) as AuthUser & { _id?: string });

    if (!parsed.id || !parsed.email) return null;
    if (parsed.role && !KNOWN_ROLES.includes(parsed.role)) return null;

    return parsed;
  } catch {
    // Do not clear the token here: a malformed cached user must not log the
    // user out of an otherwise valid session.
    return null;
  }
}

export function saveSession(
  token: string,
  user: AuthUser,
  remember = true,
): void {
  if (typeof window === "undefined") return;

  const storage = remember ? window.localStorage : window.sessionStorage;
  const otherStorage = remember ? window.sessionStorage : window.localStorage;

  otherStorage.removeItem(TOKEN_KEY);
  otherStorage.removeItem(USER_KEY);

  storage.setItem(TOKEN_KEY, token);
  storage.setItem(USER_KEY, JSON.stringify(user));
  window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
}

export function updateStoredUser(user: AuthUser): void {
  if (typeof window === "undefined") return;

  const storage = activeStorage();
  if (!storage) return;

  storage.setItem(USER_KEY, JSON.stringify(user));
  window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
}

export function clearSession(): void {
  if (typeof window === "undefined") return;

  window.localStorage.removeItem(TOKEN_KEY);
  window.localStorage.removeItem(USER_KEY);
  window.sessionStorage.removeItem(TOKEN_KEY);
  window.sessionStorage.removeItem(USER_KEY);
  window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
}

export function dashboardPathFor(role: string | undefined): string {
  if (role === "tutor") return "/dashboard/tutor";
  if (role === "admin") return "/dashboard/admin";

  return "/dashboard/student";
}
