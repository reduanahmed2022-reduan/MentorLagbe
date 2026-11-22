"use client";

import Link from "next/link";
import { useEffect } from "react";
import "./globals.css";

export default function GlobalError({
  error,
  retry,
}: {
  error: unknown;
  retry: () => void;
}) {
  useEffect(() => {
    console.error("Global error:", error);
  }, [error]);

  return (
    <html lang="en">
      <head>
        <title>Something went wrong | MentorLagbe</title>
      </head>
      <body className="min-h-screen antialiased">
        <main className="flex min-h-screen items-center justify-center bg-[#f8faf9] px-6">
          <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-2xl">
              ⚠️
            </div>
            <h1 className="mt-6 text-2xl font-extrabold tracking-tight text-slate-900">
              Something went wrong
            </h1>
            <p className="mx-auto mt-3 max-w-sm text-sm leading-7 text-slate-500">
              We couldn&apos;t load the application. Please try again — your
              learning journey is just a click away.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={retry}
                className="rounded-full bg-[#0f9f6e] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#087a54]"
              >
                Try again
              </button>
              <Link
                href="/"
                className="rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-[#0f9f6e] hover:text-[#0f9f6e]"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}
