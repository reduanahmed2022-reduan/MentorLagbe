"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Bookmark, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { apiFetch } from "@/lib/api";

type BookmarkButtonProps = {
  tuitionId: string;
  variant?: "icon" | "full";
};

export default function BookmarkButton({
  tuitionId,
  variant = "icon",
}: BookmarkButtonProps) {
  const router = useRouter();
  const { user, ready, isAuthenticated } = useAuth();
  const [bookmarked, setBookmarked] = useState(false);
  const [checking, setChecking] = useState(false);
  const [busy, setBusy] = useState(false);

  // Bookmark state always comes from the API so it survives reloads and works
  // even when the page itself is public.
  useEffect(() => {
    if (!ready || !isAuthenticated || user?.role !== "student") return;

    const controller = new AbortController();
    setChecking(true);

    apiFetch<{ isBookmarked: boolean }>(
      `/bookmarks/check/${tuitionId}`,
      { auth: true, signal: controller.signal }
    )
      .then((data) => setBookmarked(Boolean(data.isBookmarked)))
      .catch(() => {
        // Keep the button usable; the mutation endpoint still checks ownership.
      })
      .finally(() => {
        if (!controller.signal.aborted) setChecking(false);
      });

    return () => controller.abort();
  }, [ready, isAuthenticated, user?.role, tuitionId]);

  const handleClick = async () => {
    if (!ready) return;

    if (!isAuthenticated) {
      router.push(`/sign-in?next=${encodeURIComponent(`/tuitions/${tuitionId}`)}`);
      return;
    }

    if (user?.role !== "student") {
      toast.error("Only student accounts can save tuitions");
      return;
    }

    if (busy || checking) return;

    const previous = bookmarked;
    setBookmarked(!previous);
    setBusy(true);

    try {
      if (previous) {
        await apiFetch(`/bookmarks/${tuitionId}`, {
          method: "DELETE",
          auth: true,
        });
        toast.success("Bookmark removed");
      } else {
        await apiFetch("/bookmarks", {
          method: "POST",
          auth: true,
          body: { tuitionId },
        });
        toast.success("Tuition saved to your bookmarks");
      }
    } catch (error) {
      setBookmarked(previous);
      toast.error(
        error instanceof Error ? error.message : "Could not update bookmark"
      );
    } finally {
      setBusy(false);
    }
  };

  if (variant === "full") {
    return (
      <button
        type="button"
        onClick={handleClick}
        disabled={busy || checking}
        aria-pressed={bookmarked}
        className={`flex w-full items-center justify-center gap-2 rounded-xl border px-5 py-3 text-sm font-bold transition disabled:opacity-60 ${
          bookmarked
            ? "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
            : "border-slate-200 bg-white text-slate-600 hover:border-emerald-300 hover:text-emerald-700"
        }`}
      >
        {busy || checking ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Bookmark
            className={`h-4 w-4 ${bookmarked ? "fill-emerald-600" : ""}`}
            aria-hidden="true"
          />
        )}
        {checking
          ? "Checking…"
          : busy
            ? "Saving…"
            : bookmarked
              ? "Saved to My Bookmarks"
              : "Save this Tuition"}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={busy || checking}
      aria-label={bookmarked ? "Remove bookmark" : "Bookmark this tuition"}
      aria-pressed={bookmarked}
      title={bookmarked ? "Remove bookmark" : "Bookmark this tuition"}
      className="flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-slate-600 shadow-sm transition hover:text-emerald-600 disabled:opacity-60"
    >
      {busy || checking ? (
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
      ) : (
        <Bookmark
          className={`h-4 w-4 ${bookmarked ? "fill-emerald-600 text-emerald-600" : ""}`}
          aria-hidden="true"
        />
      )}
    </button>
  );
}
