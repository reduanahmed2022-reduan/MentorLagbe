"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { dashboardPathFor, saveSession } from "@/lib/auth";
import type { AuthUser } from "@/lib/types";

const ERROR_MESSAGES: Record<string, string> = {
  unavailable: "Google sign-in is not configured on the server.",
  session_missing: "The Google session expired. Please try again.",
  account_failed: "We could not prepare your account. Please try again.",
  unexpected: "Google sign-in failed unexpectedly. Please try again.",
  access_denied:
    "Google did not approve the sign-in. If this app is still in Testing mode, ask the admin to add your Google email as a test user.",
  state_mismatch:
    "The sign-in session expired before Google responded. Please try again.",
  state_not_found: "The sign-in session was not found. Please try again.",
};

export default function GoogleCallbackPage() {
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [message, setMessage] = useState("Completing Google sign-in...");

  useEffect(() => {
    let active = true;

    // Defer so state updates are not issued synchronously inside the effect,
    // which React's lint rules flag as cascading renders.
    queueMicrotask(() => {
      if (!active) return;

      // BetterAuth appends provider errors to the query string, while our own
      // redirect uses the fragment for the JWT. Read both so the real cause
      // (e.g. access_denied for a missing test user) is not masked.
      const query = new URLSearchParams(window.location.search);
      const params = new URLSearchParams(
        window.location.hash.replace(/^#/, "")
      );
      const error = query.get("error") || params.get("error");
      const description =
        query.get("error_description") || params.get("error_description");
      const token = params.get("token");
      const rawUser = params.get("user");

      // The token travels in the fragment so it is never sent to a server or
      // stored in history. Clear it immediately after reading.
      window.history.replaceState(null, "", window.location.pathname);

      if (error || !token || !rawUser) {
        const failureMessage =
          ERROR_MESSAGES[error || ""] ||
          (description
            ? `Google sign-in failed: ${description}`
            : "The Google response was incomplete. Please try again.");
        setStatus("error");
        setMessage(failureMessage);
        toast.error(failureMessage);
        return;
      }

      try {
        const user = JSON.parse(rawUser) as AuthUser;

        if (!user?.id || !user?.role) {
          throw new Error("Invalid user payload");
        }

        saveSession(token, user);
        const welcome = `Welcome, ${user.name || user.email || "there"}!`;
        setStatus("success");
        setMessage(welcome);
        toast.success(welcome);
        router.replace(dashboardPathFor(user.role));
      } catch {
        const failureMessage = "We could not complete Google sign-in. Please try again.";
        setStatus("error");
        setMessage(failureMessage);
        toast.error(failureMessage);
      }
    });

    return () => {
      active = false;
    };
  }, [router]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-xl shadow-slate-200/60">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-lg font-black text-indigo-600">
          M
        </div>

        <h1 className="mt-6 text-2xl font-bold text-slate-900">
          {status === "loading"
            ? "Signing you in..."
            : status === "success"
              ? "Signed in successfully"
              : "Sign-in failed"}
        </h1>

        <p className="mt-3 text-sm leading-6 text-slate-500">{message}</p>

        {status === "loading" && (
          <div className="mx-auto mt-6 h-6 w-6 animate-spin rounded-full border-2 border-indigo-200 border-t-indigo-600" />
        )}

        {status === "error" && (
          <Link
            href="/sign-in"
            className="mt-6 inline-flex rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            Back to sign in
          </Link>
        )}
      </div>
    </main>
  );
}
