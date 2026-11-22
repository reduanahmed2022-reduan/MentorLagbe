"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { apiFetch } from "@/lib/api";
import {
  AUTH_CHANGE_EVENT,
  clearSession,
  getStoredUser,
  getToken,
  updateStoredUser,
} from "@/lib/auth";
import type { AuthUser } from "@/lib/types";

/**
 * Keeps the authenticated user in sync across tabs and after login/logout.
 * `ready` prevents private pages from flashing public content before the
 * localStorage session has been read.
 */
export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const profileChecked = useRef(false);

  useEffect(() => {
    const sync = () => {
      setUser(getStoredUser());
      setToken(getToken());
      setReady(true);
    };

    sync();

    window.addEventListener(AUTH_CHANGE_EVENT, sync);
    window.addEventListener("storage", sync);

    return () => {
      window.removeEventListener(AUTH_CHANGE_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  // Refresh the role/plan once after the stored session is restored so an
  // admin change is reflected without requiring a re-login. updateStoredUser
  // fires AUTH_CHANGE_EVENT, which re-runs the effect; the ref stops a loop.
  useEffect(() => {
    if (!ready || !user || !token || profileChecked.current) return;

    profileChecked.current = true;

    void apiFetch<{ user: AuthUser }>("/auth/me", { auth: true })
      .then(({ user: freshUser }) => {
        const stored = getStoredUser();

        if (
          stored &&
          getToken() &&
          (stored.role !== freshUser.role || stored.plan !== freshUser.plan)
        ) {
          updateStoredUser(freshUser);
        }
      })
      .catch(() => {
        // Transient failures leave the existing session untouched.
      });
  }, [ready, user, token]);

  const logout = useCallback(() => {
    clearSession();
  }, []);

  return {
    user,
    token,
    ready,
    logout,
    isAuthenticated: Boolean(user && token),
    isStudent: user?.role === "student",
    isTutor: user?.role === "tutor",
    isAdmin: user?.role === "admin",
  };
}
