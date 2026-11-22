import { createAuthClient } from "better-auth/react";
import type { UserRole } from "./types";

/**
 * Public API URL, which already includes the `/api` prefix.
 * Keep the fallback in sync with `src/lib/api.ts`.
 */
const apiUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api").replace(
  /\/+$/,
  ""
);

/** Better Auth client pointed at the API's `/api/better-auth` endpoints. */
export const authClient = createAuthClient({
  baseURL: `${apiUrl}/better-auth`,
});

function apiOrigin(): string {
  try {
    return new URL(apiUrl).origin;
  } catch {
    return "http://localhost:5000";
  }
}

export type GoogleSignInRole = Extract<UserRole, "student" | "tutor">;

/** Public feature flag only — no keys are ever sent to the browser. */
export async function getGoogleAuthStatus(): Promise<{
  success: boolean;
  enabled: boolean;
}> {
  const response = await fetch(`${apiOrigin()}/api/auth/google/status`, {
    cache: "no-store",
  });

  if (!response.ok) throw new Error("Google sign-in is unavailable.");

  const data = (await response.json().catch(() => null)) as {
    enabled?: boolean;
  } | null;

  return { success: true, enabled: Boolean(data?.enabled) };
}

/**
 * Start the Google OAuth flow. The API-origin callback converts the BetterAuth
 * session into the legacy JWT, then redirects back with a URL fragment.
 */
export async function signInWithGoogle(role: GoogleSignInRole = "student") {
  const callbackURL = `${apiOrigin()}/api/auth/google/callback?role=${encodeURIComponent(role)}`;
  const clientOrigin =
    typeof window === "undefined" ? "" : window.location.origin;
  // Route provider errors into the callback's error UI, which reads the
  // fragment. A plain /sign-in?error=... would be silently ignored there.
  const errorCallbackURL = clientOrigin
    ? `${clientOrigin}/auth/google/callback#error=unexpected`
    : undefined;

  return authClient.signIn.social({
    provider: "google",
    callbackURL,
    newUserCallbackURL: callbackURL,
    ...(errorCallbackURL ? { errorCallbackURL } : {}),
  });
}
