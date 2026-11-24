"use client";

import { useEffect, useState } from "react";
import { Check, Loader2, ShieldCheck, X } from "lucide-react";
import { toast } from "sonner";
import StatusBadge from "@/components/dashboard/StatusBadge";
import { apiFetch } from "@/lib/api";
import type { ApprovalStatus, Tuition } from "@/lib/types";

type Filter = "all" | ApprovalStatus;

export default function AdminTuitionsPage() {
  const [tuitions, setTuitions] = useState<Tuition[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>("all");
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => {
    apiFetch<{ tuitions: Tuition[] }>("/admin/tuitions", { auth: true })
      .then((data) => setTuitions(data.tuitions))
      .catch((error) =>
        toast.error(error instanceof Error ? error.message : "Could not load tuitions")
      )
      .finally(() => setLoading(false));
  }, []);

  const handleReview = async (tuition: Tuition, approvalStatus: "approved" | "rejected") => {
    setBusyId(tuition._id);

    try {
      await apiFetch(`/tuitions/admin/review/${tuition._id}`, {
        method: "PATCH",
        auth: true,
        body: { approvalStatus },
      });
      setTuitions((items) =>
        items.map((item) =>
          item._id === tuition._id
            ? { ...item, approvalStatus, isActive: approvalStatus === "approved" }
            : item
        )
      );
      toast.success(approvalStatus === "approved" ? "Tuition approved" : "Tuition rejected");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not review tuition");
    } finally {
      setBusyId(null);
    }
  };

  // Reject is destructive, so ask for confirmation in a toast first.
  const confirmReject = (tuition: Tuition) => {
    toast("Reject this tuition?", {
      description: tuition.title,
      action: {
        label: "Confirm reject",
        onClick: () => handleReview(tuition, "rejected"),
      },
      cancel: "Cancel",
    });
  };

  const shown = filter === "all" ? tuitions : tuitions.filter((item) => item.approvalStatus === filter);
  const pendingCount = tuitions.filter((item) => item.approvalStatus === "pending").length;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900">Tuition Approval</h2>
          <p className="mt-1 text-sm text-slate-500">
            {pendingCount} pending · {tuitions.length} total tuitions
          </p>
        </div>
        <div className="flex gap-2">
          {(["all", "pending", "approved", "rejected"] as Filter[]).map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setFilter(item)}
              className={`rounded-full px-4 py-2 text-xs font-bold capitalize transition ${
                filter === item
                  ? "bg-indigo-600 text-white"
                  : "border border-slate-200 bg-white text-slate-600 hover:border-indigo-400"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center rounded-2xl border border-slate-200 bg-white">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
        </div>
      ) : shown.length ? (
        <div className="grid gap-4">
          {shown.map((tuition) => (
            <article key={tuition._id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="font-bold text-slate-900">{tuition.title}</h3>
                  <p className="mt-1 text-xs text-slate-500">
                    {tuition.subject} · {tuition.classLevel} · {tuition.mode} · by {tuition.tutorEmail}
                  </p>
                </div>
                <StatusBadge status={tuition.approvalStatus || "pending"} />
              </div>

              <p className="mt-3 line-clamp-2 text-xs leading-6 text-slate-500">
                {tuition.description}
              </p>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
                <p className="text-xs text-slate-500">
                  ${Number(tuition.monthlyFee).toLocaleString("en-US")}/mo · {tuition.daysPerWeek} days/week
                </p>
                {tuition.approvalStatus === "pending" ? (
                  <div className="flex gap-2">
                    <button
                      type="button"
                      disabled={busyId === tuition._id}
                      onClick={() => handleReview(tuition, "approved")}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-emerald-700 disabled:opacity-50"
                    >
                      <Check className="h-3.5 w-3.5" /> Approve
                    </button>
                    <button
                      type="button"
                      disabled={busyId === tuition._id}
                      onClick={() => confirmReject(tuition)}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 px-4 py-2 text-xs font-bold text-rose-600 transition hover:bg-rose-50 disabled:opacity-50"
                    >
                      <X className="h-3.5 w-3.5" /> Reject
                    </button>
                  </div>
                ) : (
                  <p className="flex items-center gap-1.5 text-xs font-semibold text-slate-400">
                    <ShieldCheck className="h-3.5 w-3.5" /> Reviewed
                  </p>
                )}
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center">
          <p className="text-lg font-bold text-slate-800">Nothing to review</p>
          <p className="mt-2 text-sm text-slate-500">No tuitions match this filter.</p>
        </div>
      )}
    </div>
  );
}
