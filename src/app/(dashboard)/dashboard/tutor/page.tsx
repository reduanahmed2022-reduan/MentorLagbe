"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  BookOpenCheck,
  CheckCircle2,
  Clock3,
  PlusCircle,
  UsersRound,
} from "lucide-react";
import StatCard from "@/components/dashboard/StatCard";
import StatusBadge from "@/components/dashboard/StatusBadge";
import { useAuth } from "@/hooks/useAuth";
import { apiFetch } from "@/lib/api";
import type { Tuition, TuitionApplication } from "@/lib/types";

export default function TutorOverviewPage() {
  const { user } = useAuth();
  const [tuitions, setTuitions] = useState<Tuition[]>([]);
  const [applicants, setApplicants] = useState<TuitionApplication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      apiFetch<{ tuitions: Tuition[] }>("/tuitions/my-tuitions", { auth: true }),
      apiFetch<{ applicants: TuitionApplication[] }>("/applications/tutor-applicants", { auth: true }),
    ])
      .then(([tuitionData, applicantData]) => {
        setTuitions(tuitionData.tuitions);
        setApplicants(applicantData.applicants);
      })
      .catch(() => {
        setTuitions([]);
        setApplicants([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const activeCount = tuitions.filter((item) => item.isActive && item.approvalStatus === "approved").length;
  const pendingCount = tuitions.filter((item) => item.approvalStatus === "pending").length;
  const pendingApplicants = applicants.filter((item) => item.status === "pending").length;

  return (
    <div className="space-y-8">
      <section className="rounded-3xl bg-gradient-to-r from-emerald-700 via-teal-600 to-indigo-600 p-8 text-white">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-emerald-100">
              Tutor workspace
            </p>
            <h2 className="mt-2 text-2xl font-extrabold">
              Welcome back, {user?.name.split(" ")[0]} 👋
            </h2>
            <p className="mt-2 max-w-xl text-sm text-emerald-50">
              Manage your batches, review applicants and grow your teaching
              career.
            </p>
          </div>
          <Link
            href="/dashboard/tutor/post-tuition"
            className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-indigo-700 transition hover:bg-indigo-50"
          >
            <PlusCircle className="h-4 w-4" /> Post a Tuition
          </Link>
        </div>
      </section>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="My Tuitions" value={tuitions.length} icon={BookOpenCheck} />
        <StatCard label="Active Batches" value={activeCount} icon={CheckCircle2} tone="emerald" />
        <StatCard label="Pending Review" value={pendingCount} icon={Clock3} tone="amber" />
        <StatCard label="New Applicants" value={pendingApplicants} icon={UsersRound} tone="rose" />
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Your recent tuitions</h3>
            <p className="mt-1 text-xs text-slate-500">Approval and visibility at a glance</p>
          </div>
          <Link
            href="/dashboard/tutor/my-tuitions"
            className="text-sm font-bold text-indigo-600 hover:underline"
          >
            Manage all →
          </Link>
        </div>

        {loading ? (
          <div className="mt-6 h-32 animate-pulse rounded-xl bg-slate-50" />
        ) : tuitions.length ? (
          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[600px] text-left text-sm">
              <thead className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-400">
                <tr>
                  <th className="py-3">Title</th>
                  <th className="py-3">Subject</th>
                  <th className="py-3">Fee</th>
                  <th className="py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {tuitions.slice(0, 5).map((item) => (
                  <tr key={item._id} className="text-slate-600">
                    <td className="py-4 font-semibold text-slate-800">{item.title}</td>
                    <td className="py-4">{item.subject}</td>
                    <td className="py-4">৳{Number(item.monthlyFee).toLocaleString("en-BD")}</td>
                    <td className="py-4">
                      <StatusBadge status={item.isActive ? "active" : item.approvalStatus || "pending"} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="mt-6 rounded-xl border border-dashed border-slate-200 p-10 text-center">
            <p className="text-sm font-semibold text-slate-600">No tuitions posted yet</p>
            <p className="mt-1 text-xs text-slate-400">Create your first batch to start receiving applicants.</p>
            <Link
              href="/dashboard/tutor/post-tuition"
              className="mt-5 inline-block rounded-full bg-indigo-600 px-6 py-2.5 text-sm font-bold text-white"
            >
              Post a Tuition
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
