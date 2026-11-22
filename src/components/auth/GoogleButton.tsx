"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  getGoogleAuthStatus,
  signInWithGoogle,
  type GoogleSignInRole,
} from "@/lib/better-auth";

interface GoogleButtonProps {
  role?: GoogleSignInRole;
  label?: string;
}

export default function GoogleButton({
  role = "student",
  label = "Continue with Google",
}: GoogleButtonProps) {
  const [enabled, setEnabled] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;

    getGoogleAuthStatus()
      .then((status) => {
        if (active) setEnabled(status.enabled);
      })
      .catch(() => {
        if (active) setEnabled(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const handleClick = async () => {
    if (!enabled || loading) return;

    setLoading(true);

    try {
      // Better Auth resolves with { data, error } instead of throwing on
      // API/network failures, so inspect the result explicitly.
      const result = await signInWithGoogle(role);
      if (result?.error) {
        throw new Error(
          result.error.message ?? "Google sign-in could not be started."
        );
      }
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Google sign-in could not be started.";

      toast.error(message);
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        type="button"
        onClick={handleClick}
        disabled={!enabled || loading}
        className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:text-slate-400"
      >
        <svg viewBox="0 0 48 48" className="h-5 w-5" aria-hidden="true">
          <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917Z" />
          <path fill="#FF3D00" d="m6.306 14.691 6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4c-7.682 0-14.344 4.337-17.694 10.691Z" />
          <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44Z" />
          <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917Z" />
        </svg>
        {loading ? "Connecting..." : label}
      </button>

      {!enabled && (
        <p className="mt-2 text-center text-xs text-slate-400">
          Google sign-in is not available yet.
        </p>
      )}
    </div>
  );
}
