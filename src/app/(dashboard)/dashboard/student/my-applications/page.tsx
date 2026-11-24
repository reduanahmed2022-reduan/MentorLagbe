"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Loader2, RotateCcw, Trash2 } from "lucide-react";
import { toast } from "sonner";
import StatusBadge from "@/components/dashboard/StatusBadge";
import { apiFetch } from "@/lib/api";
import type { TuitionApplication } from "@/lib/types";

function reviewedAtSuffix(value?: string) {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : ` ${date.toLocaleDateString()}`;
}

export default function MyApplicationsPage() {
  const [applications, setApplications] = useState<TuitionApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState<string | null>(null);
  const [restoring, setRestoring] = useState<string | null>(null);

  useEffect(() => {
    apiFetch<{ applications: TuitionApplication[] }>("/applications/my-applications", {
      auth: true,
    })
      .then((data) => setApplications(data.applications))
      .catch((error) =>
        toast.error(error instanceof Error ? error.message : "Could not load applications")
      )
      .finally(() => setLoading(false));
  }, []);

  const handleCancel = async (id: string) => {
    setCancelling(id);

    try {
      await apiFetch(`/applications/${id}`, { method: "DELETE", auth: true });
      setApplications((items) => items.filter((item) => item._id !== id));
      toast.success("Application cancelled");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not cancel application");
    } finally {
      setCancelling(null);
    }
  };

  const handleRestore = async (id: string) => {
    setRestoring(id);

    try {
      const data = await apiFetch<{ application?: TuitionApplication }>(
        `/applications/${id}/restore`,
        { method: "PATCH", auth: true }
      );
      setApplications((items) =>
        items.map((item) =>
          item._id === id
            ? {
                ...item,
                ...(data.application || {}),
                status: "pending",
                reviewedAt: undefined,
                restoredAt: new Date().toISOString(),
              }
            : item
        )
      );
      toast.success("Application restored to pending");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not restore application");
    } finally {
      setRestoring(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900">My Applications</h2>
          <p className="mt-1 text-sm text-slate-500">
            All tuition requests you have submitted.
          </p>
        </div>
        <Link
          href="/tuitions"
          className="rounded-full bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-indigo-700"
        >
          Find more tuitions
        </Link>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center rounded-2xl border border-slate-200 bg-white">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
        </div>
      ) : applications.length ? (
        <div className="grid gap-4">
          {applications.map((item) => (
            <article
              key={item._id}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="font-bold text-slate-900">{item.tuitionTitle}</h3>
                  <p className="mt-1 text-xs text-slate-500">
                    {item.subject} · {item.tutorEmail}
                  </p>
                </div>
                <StatusBadge status={item.status} />
              </div>

              <div className="mt-5 grid gap-3 text-xs text-slate-500 sm:grid-cols-4">
                <p><span className="font-semibold text-slate-700">Fee:</span> ${Number(item.monthlyFee).toLocaleString("en-US")}</p>
                <p><span className="font-semibold text-slate-700">Applied:</span> {new Date(item.appliedAt).toLocaleDateString()}</p>
                <p><span className="font-semibold text-slate-700">Schedule:</span> {item.preferredSchedule}</p>
                <p><span className="font-semibold text-slate-700">Phone:</span> {item.studentPhone || "—"}</p>
              </div>

              {item.studentNote && (
                <p className="mt-4 rounded-xl bg-slate-50 p-3 text-xs text-slate-600">
                  “{item.studentNote}”
                </p>
              )}

              {item.reviewedAt && (
                <p className="mt-4 text-xs font-semibold capitalize text-slate-500">
                  Reviewed{reviewedAtSuffix(item.reviewedAt)} · {item.status}
                </p>
              )}

              <div className="mt-4 flex flex-wrap gap-2">
                {item.status === "pending" && (
                  <button
                    type="button"
                    onClick={() => handleCancel(item._id)}
                    disabled={cancelling === item._id}
                    className="inline-flex items-center gap-2 rounded-xl border border-rose-200 px-4 py-2 text-xs font-bold text-rose-600 transition hover:bg-rose-50 disabled:opacity-50"
                  >
                    {cancelling === item._id ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Trash2 className="h-3.5 w-3.5" />
                    )}
                    Cancel application
                  </button>
                )}
                {item.status === "rejected" && (
                  <button
                    type="button"
                    onClick={() => handleRestore(item._id)}
                    disabled={restoring === item._id}
                    className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 px-4 py-2 text-xs font-bold text-emerald-700 transition hover:bg-emerald-50 disabled:opacity-50"
                  >
                    {restoring === item._id ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <RotateCcw className="h-3.5 w-3.5" />
                    )}
                    Restore to pending
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center">
          <p className="text-lg font-bold text-slate-800">Nothing here yet</p>
          <p className="mt-2 text-sm text-slate-500">
            Browse approved tuitions and send your first application.
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
