"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { apiFetch } from "@/lib/api";
import {
  AUTH_CHANGE_EVENT,
  clearSession,
  getStoredUser,
  getToken,
  normalizeUser,
  updateStoredUser,
} from "@/lib/auth";
import type { AuthUser } from "@/lib/types";

/**
 * One /auth/me request per token, shared by every mounted useAuth() instance.
 * A dashboard can mount three or four of these hooks on a single reload.
 */
let sharedProfile: { token: string; promise: Promise<AuthUser> } | null = null;

type ProfileUser = AuthUser & { _id?: string; profileImage?: string };

function loadProfile(token: string): Promise<AuthUser> {
  if (!sharedProfile || sharedProfile.token !== token) {
    const promise = apiFetch<{ user: ProfileUser }>("/auth/me", { auth: true })
      .then(({ user }) =>
        normalizeUser({
          ...user,
          id: user.id ?? user._id?.toString() ?? "",
          image: user.image ?? user.profileImage ?? "",
        })
      )
      .finally(() => {
        if (sharedProfile?.promise === promise) sharedProfile = null;
      });

    sharedProfile = { token, promise };
  }

  return sharedProfile.promise;
}

/**
 * Keeps the authenticated user in sync across tabs and after login/logout.
 * `ready` prevents private pages from flashing public content before the
 * localStorage session has been read.
 */
export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const profileCheckedFor = useRef<string | null>(null);

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

  // Refresh the role/plan once per token after the stored session is restored
  // so an admin change is reflected without requiring a re-login.
  useEffect(() => {
    if (!ready || !user || !token || profileCheckedFor.current === token) return;

    profileCheckedFor.current = token;
    const checkedToken = token;

    void loadProfile(checkedToken)
      .then((freshUser) => {
        // Ignore a late response from a session that has since changed.
        if (getToken() !== checkedToken) return;

        const stored = getStoredUser();

        if (
          stored &&
          (stored.role !== freshUser.role ||
            stored.plan !== freshUser.plan ||
            stored.name !== freshUser.name ||
            stored.image !== freshUser.image)
        ) {
          updateStoredUser(freshUser);
        }
      })
      .catch(() => {
        // Transient failures leave the existing session untouched.
      });
  }, [ready, user, token]);

  const logout = useCallback(async () => {
    clearSession();

    // Best-effort BetterAuth sign-out (no cookie session exists for JWT-only
    // logins, so failures are expected and must never block the UI logout).
    try {
      const { authClient } = await import("@/lib/better-auth");

      await Promise.race([
        authClient.signOut(),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("sign-out timeout")), 2000)
        ),
      ]);
    } catch {
      // The local JWT session is already cleared.
    }
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
