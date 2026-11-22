"use client";

import { useEffect, useState } from "react";
import { Check, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import StatusBadge from "@/components/dashboard/StatusBadge";
import { apiFetch } from "@/lib/api";
import type { TuitionApplication } from "@/lib/types";

export default function ApplicantsPage() {
  const [applicants, setApplicants] = useState<TuitionApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => {
    apiFetch<{ applicants: TuitionApplication[] }>("/applications/tutor-applicants", { auth: true })
      .then((data) => setApplicants(data.applicants))
      .catch((error) =>
        toast.error(error instanceof Error ? error.message : "Could not load applicants")
      )
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
        items.map((item) => (item._id === id ? { ...item, status } : item))
      );
      toast.success(`Application ${status}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not update application");
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

      {loading ? (
        <div className="flex h-64 items-center justify-center rounded-2xl border border-slate-200 bg-white">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
        </div>
      ) : applicants.length ? (
        <div className="grid gap-4">
          {applicants.map((item) => (
            <article key={item._id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="font-bold text-slate-900">{item.studentName}</h3>
                  <p className="mt-1 text-xs text-slate-500">
                    {item.studentEmail} · {item.studentPhone || "No phone"}
                  </p>
                </div>
                <StatusBadge status={item.status} />
              </div>

              <div className="mt-4 rounded-xl bg-slate-50 p-4 text-xs text-slate-600">
                <p className="font-bold text-slate-800">{item.tuitionTitle}</p>
                <p className="mt-1">Preferred schedule: {item.preferredSchedule}</p>
                {item.studentNote && <p className="mt-1 italic">“{item.studentNote}”</p>}
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <p className="text-xs text-slate-400">
                  Applied {new Date(item.appliedAt).toLocaleDateString()}
                </p>
                {item.status === "pending" ? (
                  <div className="flex gap-2">
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
                  <p className="text-xs font-semibold capitalize text-slate-500">
                    Reviewed · {item.status}
                  </p>
                )}
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center">
          <p className="text-lg font-bold text-slate-800">No applicants yet</p>
          <p className="mt-2 text-sm text-slate-500">
            Once students apply to your tuitions, they will appear here.
          </p>
        </div>
      )}
    </div>
  );
}
