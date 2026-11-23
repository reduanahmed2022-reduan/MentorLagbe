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
 * Start the Google OAuth flow with a real browser navigation.
 *
 * A cross-site fetch to the API cannot store BetterAuth's SameSite=Lax state
 * cookie, so Google's callback used to arrive without state and fail. The API
 * sets the cookie on a first-party top-level response, then redirects to Google.
 * Its callback converts the BetterAuth session into the legacy JWT and returns
 * to the client with the token in a URL fragment.
 */
export async function signInWithGoogle(
  role: GoogleSignInRole = "student"
): Promise<{ data: unknown; error: { message?: string } | null }> {
  if (typeof window !== "undefined") {
    window.location.assign(
      `${apiOrigin()}/api/auth/google/start?role=${encodeURIComponent(role)}`
    );
  }

  return { data: null, error: null };
}
