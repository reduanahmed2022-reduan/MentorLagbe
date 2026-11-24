"use client";

import { useEffect, useState } from "react";
import { Check, Loader2, RotateCcw, X } from "lucide-react";
import { toast } from "sonner";
import StatusBadge from "@/components/dashboard/StatusBadge";
import { apiFetch } from "@/lib/api";
import type { TuitionApplication } from "@/lib/types";

function formatDate(value?: string) {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "—" : date.toLocaleDateString();
}

function reviewedAtSuffix(value?: string) {
  const formatted = formatDate(value);
  return formatted === "—" ? "" : ` ${formatted}`;
}

export default function ApplicantsPage() {
  const [applicants, setApplicants] = useState<TuitionApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => {
    apiFetch<{ applicants: TuitionApplication[] }>("/applications/tutor-applicants", { auth: true })
      .then((data) => setApplicants(Array.isArray(data.applicants) ? data.applicants : []))
      .catch((errorValue) => {
        const message = errorValue instanceof Error ? errorValue.message : "Could not load applicants";
        setError(message);
        toast.error(message);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleReview = async (id: string, status: "accepted" | "rejected") => {
    setBusyId(id);

    try {
      await apiFetch(`/applications/${id}/status`, {
        method: "PATCH",
        auth: true,
        body: { status },
      });
      setApplicants((items) =>
        items.map((item) =>
          item._id === id
            ? { ...item, status, reviewedAt: new Date().toISOString() }
            : item
        )
      );
      toast.success(`Application ${status}`);
    } catch (errorValue) {
      toast.error(errorValue instanceof Error ? errorValue.message : "Could not update application");
    } finally {
      setBusyId(null);
    }
  };

  const handleRestore = async (id: string) => {
    setBusyId(id);

    try {
      const data = await apiFetch<{ application?: TuitionApplication }>(
        `/applications/${id}/restore`,
        { method: "PATCH", auth: true }
      );
      setApplicants((items) =>
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
    } catch (errorValue) {
      toast.error(errorValue instanceof Error ? errorValue.message : "Could not restore application");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-extrabold text-slate-900">Applicants</h2>
        <p className="mt-1 text-sm text-slate-500">
          Review students who applied to your tuition batches.
        </p>
      </div>

      {error && (
        <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </p>
      )}

      {loading ? (
        <div className="flex h-64 items-center justify-center rounded-2xl border border-slate-200 bg-white">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
        </div>
      ) : applicants.length ? (
        <div className="grid gap-4">
          {applicants.map((item) => (
            <article key={item._id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="font-bold text-slate-900">{item.studentName}</h3>
                  <p className="mt-1 text-xs text-slate-500">
                    {item.studentEmail} · {item.studentPhone || "No phone"}
                  </p>
                </div>
                <StatusBadge status={item.status} />
              </div>

              <div className="mt-4 rounded-xl bg-slate-50 p-4 text-xs text-slate-600">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Applied for
                </p>
                <p className="mt-1 font-bold text-slate-800">
                  {item.tuitionTitle?.trim() || "Untitled tuition"}
                </p>
                <p className="mt-1">Preferred schedule: {item.preferredSchedule}</p>
                {item.studentNote && <p className="mt-1 italic">“{item.studentNote}”</p>}
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <p className="text-xs text-slate-400">
                  Applied {formatDate(item.appliedAt)}
                </p>
                {item.status === "pending" ? (
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      disabled={busyId === item._id}
                      onClick={() => handleReview(item._id, "accepted")}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-emerald-700 disabled:opacity-50"
                    >
                      <Check className="h-3.5 w-3.5" /> Accept
                    </button>
                    <button
                      type="button"
                      disabled={busyId === item._id}
                      onClick={() => handleReview(item._id, "rejected")}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 px-4 py-2 text-xs font-bold text-rose-600 transition hover:bg-rose-50 disabled:opacity-50"
                    >
                      <X className="h-3.5 w-3.5" /> Reject
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-wrap items-center justify-end gap-3">
                    <p className="text-xs font-semibold capitalize text-slate-500">
                      Reviewed{reviewedAtSuffix(item.reviewedAt)} · {item.status}
                    </p>
                    {item.status === "rejected" && (
                      <button
                        type="button"
                        disabled={busyId === item._id}
                        onClick={() => handleRestore(item._id)}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-200 px-4 py-2 text-xs font-bold text-emerald-700 transition hover:bg-emerald-50 disabled:opacity-50"
                      >
                        {busyId === item._id ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <RotateCcw className="h-3.5 w-3.5" />
                        )}
                        Restore to pending
                      </button>
                    )}
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center">
          <p className="text-lg font-bold text-slate-800">
            {error ? "Applicants unavailable" : "No applicants yet"}
          </p>
          <p className="mt-2 text-sm text-slate-500">
            {error
              ? "Please reload the page or try again shortly."
              : "Once students apply to your tuitions, they will appear here."}
          </p>
        </div>
      )}
    </div>
  );
}
