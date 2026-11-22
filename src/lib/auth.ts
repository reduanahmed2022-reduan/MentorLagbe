import type { AuthUser } from "./types";

export const TOKEN_KEY = "token";
export const USER_KEY = "user";
export const AUTH_CHANGE_EVENT = "mentorlagbe:auth-change";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;

  return (
    window.localStorage.getItem(TOKEN_KEY) ??
    window.sessionStorage.getItem(TOKEN_KEY)
  );
}

export function getStoredUser(): AuthUser | null {
  if (typeof window === "undefined") return null;

  const raw =
    window.localStorage.getItem(USER_KEY) ??
    window.sessionStorage.getItem(USER_KEY);

  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as AuthUser;

    return parsed?.id || parsed?.email ? parsed : null;
  } catch {
    clearSession();

    return null;
  }
}

export function saveSession(
  token: string,
  user: AuthUser,
  remember = true,
): void {
  const storage = remember ? window.localStorage : window.sessionStorage;
  const otherStorage = remember ? window.sessionStorage : window.localStorage;

  otherStorage.removeItem(TOKEN_KEY);
  otherStorage.removeItem(USER_KEY);

  storage.setItem(TOKEN_KEY, token);
  storage.setItem(USER_KEY, JSON.stringify(user));
  window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
}

export function updateStoredUser(user: AuthUser): void {
  window.localStorage.setItem(USER_KEY, JSON.stringify(user));
  window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
}

export function clearSession(): void {
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
