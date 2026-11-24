"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  ExternalLink,
  Loader2,
  Pencil,
  PlusCircle,
  RotateCcw,
  Trash2,
  X,
} from "lucide-react";
import { toast } from "sonner";
import StatusBadge from "@/components/dashboard/StatusBadge";
import TuitionForm from "@/components/tuitions/TuitionForm";
import { apiFetch } from "@/lib/api";
import type { Tuition } from "@/lib/types";

export default function MyTuitionsPage() {
  const [tuitions, setTuitions] = useState<Tuition[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Tuition | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(() => {
    apiFetch<{ tuitions: Tuition[] }>("/tuitions/my-tuitions", { auth: true })
      .then((data) => setTuitions(data.tuitions))
      .catch((error) =>
        toast.error(error instanceof Error ? error.message : "Could not load tuitions")
      )
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleToggle = async (tuition: Tuition) => {
    setBusyId(tuition._id);

    try {
      const data = await apiFetch<{ isActive: boolean }>(`/tuitions/${tuition._id}/status`, {
        method: "PATCH",
        auth: true,
      });
      setTuitions((items) =>
        items.map((item) =>
          item._id === tuition._id ? { ...item, isActive: data.isActive } : item
        )
      );
      toast.success(data.isActive ? "Tuition is now active" : "Tuition closed");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not update status");
    } finally {
      setBusyId(null);
    }
  };

  const handleRestore = async (tuition: Tuition) => {
    setBusyId(tuition._id);

    try {
      await apiFetch(`/tuitions/${tuition._id}/restore`, {
        method: "PATCH",
        auth: true,
      });
      setTuitions((items) =>
        items.map((item) =>
          item._id === tuition._id
            ? { ...item, approvalStatus: "pending", isActive: false }
            : item
        )
      );
      toast.success("Tuition restored to pending");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not restore tuition");
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (tuition: Tuition) => {
    if (!window.confirm(`Delete “${tuition.title}”? This cannot be undone.`)) return;

    setBusyId(tuition._id);

    try {
      await apiFetch(`/tuitions/${tuition._id}`, { method: "DELETE", auth: true });
      setTuitions((items) => items.filter((item) => item._id !== tuition._id));
      toast.success("Tuition deleted");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not delete tuition");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900">My Tuitions</h2>
          <p className="mt-1 text-sm text-slate-500">
            Edit, pause or remove your tuition batches.
          </p>
        </div>
        <Link
          href="/dashboard/tutor/post-tuition"
          className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-indigo-700"
        >
          <PlusCircle className="h-4 w-4" /> New tuition
        </Link>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center rounded-2xl border border-slate-200 bg-white">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
        </div>
      ) : tuitions.length ? (
        <div className="grid gap-4">
          {tuitions.map((tuition) => (
            <article
              key={tuition._id}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="font-bold text-slate-900">{tuition.title}</h3>
                  <p className="mt-1 text-xs text-slate-500">
                    {tuition.subject} · {tuition.classLevel} · {tuition.mode}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <StatusBadge
                    status={tuition.approvalStatus || "pending"}
                    label={`Approval: ${tuition.approvalStatus || "pending"}`}
                  />
                  <StatusBadge
                    status={
                      tuition.approvalStatus === "approved"
                        ? tuition.isActive
                          ? "active"
                          : "closed"
                        : "closed"
                    }
                    label={
                      tuition.approvalStatus === "approved"
                        ? `Listing: ${tuition.isActive ? "Active" : "Closed"}`
                        : "Listing: Not public"
                    }
                  />
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-xs text-slate-500">
                <span><span className="font-semibold text-slate-700">Fee:</span> ${Number(tuition.monthlyFee).toLocaleString("en-US")}/mo</span>
                <span><span className="font-semibold text-slate-700">Days/week:</span> {tuition.daysPerWeek}</span>
                <span><span className="font-semibold text-slate-700">Location:</span> {tuition.location}</span>
              </div>

              <div className="mt-5 flex flex-wrap gap-2 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={() => setEditing(tuition)}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 transition hover:border-indigo-300 hover:text-indigo-600"
                >
                  <Pencil className="h-3.5 w-3.5" /> Edit
                </button>
                {tuition.approvalStatus === "approved" && (
                  <button
                    type="button"
                    disabled={busyId === tuition._id}
                    onClick={() => handleToggle(tuition)}
                    className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 transition hover:border-indigo-300 hover:text-indigo-600 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {busyId === tuition._id ? "Updating…" : tuition.isActive ? "Close batch" : "Reopen batch"}
                  </button>
                )}
                {tuition.approvalStatus === "rejected" && (
                  <button
                    type="button"
                    disabled={busyId === tuition._id}
                    onClick={() => handleRestore(tuition)}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-200 px-4 py-2 text-xs font-bold text-emerald-700 transition hover:bg-emerald-50 disabled:opacity-50"
                  >
                    {busyId === tuition._id ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <RotateCcw className="h-3.5 w-3.5" />
                    )}
                    Restore for review
                  </button>
                )}
                {tuition.approvalStatus === "approved" && tuition.isActive && (
                  <Link
                    href={`/tuitions/${tuition._id}`}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 transition hover:border-indigo-300 hover:text-indigo-600"
                  >
                    <ExternalLink className="h-3.5 w-3.5" /> View live
                  </Link>
                )}
                <button
                  type="button"
                  disabled={busyId === tuition._id}
                  onClick={() => handleDelete(tuition)}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 px-4 py-2 text-xs font-bold text-rose-600 transition hover:bg-rose-50 disabled:opacity-50"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center">
          <p className="text-lg font-bold text-slate-800">No tuitions yet</p>
          <p className="mt-2 text-sm text-slate-500">Post your first batch and start building your roster.</p>
          <Link
            href="/dashboard/tutor/post-tuition"
            className="mt-6 inline-block rounded-full bg-indigo-600 px-6 py-3 text-sm font-bold text-white"
          >
            Post a Tuition
          </Link>
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 z-[200] flex items-start justify-center overflow-y-auto bg-slate-900/50 p-4 sm:p-8">
          <div className="w-full max-w-3xl rounded-2xl bg-white p-6 shadow-xl sm:p-8">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-lg font-extrabold text-slate-900">Edit Tuition</h3>
              <button
                type="button"
                onClick={() => setEditing(null)}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100"
                aria-label="Close editor"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <TuitionForm
              initial={editing}
              onDone={() => {
                setEditing(null);
                load();
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
