"use client";

import { useCallback, useEffect, useState } from "react";
import {
  AUTH_CHANGE_EVENT,
  clearSession,
  getStoredUser,
  getToken,
} from "@/lib/auth";
import type { AuthUser } from "@/lib/types";

/**
 * Keeps the authenticated user in sync across tabs and after login/logout.
 * `ready` prevents private pages from flashing public content before the
 * localStorage session has been read.
 */
export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const sync = () => {
      setUser(getStoredUser());
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

  const logout = useCallback(() => {
    clearSession();
  }, []);

  return {
    user,
    token: getToken(),
    ready,
    logout,
    isAuthenticated: Boolean(user && getToken()),
    isStudent: user?.role === "student",
    isTutor: user?.role === "tutor",
    isAdmin: user?.role === "admin",
  };
}
