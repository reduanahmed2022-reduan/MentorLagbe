"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  BookOpen,
  Bookmark as BookmarkIcon,
  CalendarDays,
  Loader2,
  Trash2,
  Wallet,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { apiFetch } from "@/lib/api";
import type { Bookmark } from "@/lib/types";

export default function BookmarksPage() {
  const { user } = useAuth();
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState<string | null>(null);

  useEffect(() => {
    apiFetch<{ bookmarks: Bookmark[] }>("/bookmarks", { auth: true })
      .then((data) => setBookmarks(Array.isArray(data.bookmarks) ? data.bookmarks : []))
      .catch((error) =>
        toast.error(error instanceof Error ? error.message : "Could not load bookmarks")
      )
      .finally(() => setLoading(false));
  }, []);

  const handleRemove = async (bookmark: Bookmark) => {
    setRemovingId(bookmark._id);

    try {
      await apiFetch(`/bookmarks/${bookmark.tuitionId}`, {
        method: "DELETE",
        auth: true,
      });
      setBookmarks((items) => items.filter((item) => item._id !== bookmark._id));
      toast.success("Bookmark removed");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not remove bookmark");
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900">My Bookmarks</h2>
          <p className="mt-1 text-sm text-slate-500">
            Tuitions you saved for later. Only approved, active batches are shown here.
          </p>
        </div>
        <Link
          href="/tuitions"
          className="rounded-full bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-indigo-700"
        >
          Browse tuitions
        </Link>
      </div>

      <div className="rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-xs font-semibold text-emerald-700">
        {user?.plan === "pro"
          ? "Pro plan: save as many tuitions as you like."
          : "Free plan: you can save up to 5 tuitions. Upgrade to Pro for unlimited bookmarks."}
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center rounded-2xl border border-slate-200 bg-white">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
        </div>
      ) : bookmarks.length ? (
        <div className="grid gap-4">
          {bookmarks.map((bookmark) => (
            <article
              key={bookmark._id}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="font-bold text-slate-900">
                    {bookmark.tuition?.title || bookmark.tuitionTitle}
                  </h3>
                  <p className="mt-1 text-xs text-slate-500">
                    {bookmark.subject} · {bookmark.classLevel || "Any class"} · by {bookmark.tutorEmail}
                  </p>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                  <BookmarkIcon className="h-3.5 w-3.5" aria-hidden="true" /> Saved
                </span>
              </div>

              <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-xs text-slate-500">
                <span className="inline-flex items-center gap-1.5">
                  <Wallet className="h-3.5 w-3.5 text-emerald-600" />
                  ${Number(bookmark.monthlyFee).toLocaleString("en-US")}/mo
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <BookOpen className="h-3.5 w-3.5 text-emerald-600" />
                  {bookmark.tuition?.daysPerWeek ?? "—"} days/week
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays className="h-3.5 w-3.5 text-emerald-600" />
                  Saved {new Date(bookmark.bookmarkedAt).toLocaleDateString()}
                </span>
              </div>

              <div className="mt-5 flex flex-wrap gap-2 border-t border-slate-100 pt-4">
                <Link
                  href={`/tuitions/${bookmark.tuitionId}`}
                  className="inline-flex items-center rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-emerald-700"
                >
                  View tuition
                </Link>
                <button
                  type="button"
                  disabled={removingId === bookmark._id}
                  onClick={() => handleRemove(bookmark)}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 px-4 py-2 text-xs font-bold text-rose-600 transition hover:bg-rose-50 disabled:opacity-50"
                >
                  {removingId === bookmark._id ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Trash2 className="h-3.5 w-3.5" />
                  )}
                  Remove bookmark
                </button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center">
          <BookmarkIcon className="mx-auto h-10 w-10 text-slate-300" />
          <p className="mt-4 text-lg font-bold text-slate-800">No bookmarks yet</p>
          <p className="mt-2 text-sm text-slate-500">
            Save a tuition from the listings or detail page and it will appear here.
          </p>
          <Link
            href="/tuitions"
            className="mt-6 inline-block rounded-full bg-indigo-600 px-6 py-3 text-sm font-bold text-white"
          >
            Browse Tuitions
          </Link>
        </div>
      )}
    </div>
  );
}
