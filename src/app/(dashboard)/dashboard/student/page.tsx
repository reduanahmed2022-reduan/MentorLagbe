"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  BookMarked,
  CheckCircle2,
  Clock3,
  CreditCard,
  Sparkles,
} from "lucide-react";
import StatCard from "@/components/dashboard/StatCard";
import StatusBadge from "@/components/dashboard/StatusBadge";
import { useAuth } from "@/hooks/useAuth";
import { apiFetch } from "@/lib/api";
import type { AuthUser, DashboardStats, TuitionApplication } from "@/lib/types";

export default function StudentOverviewPage() {
  const { user } = useAuth();
  const [applications, setApplications] = useState<TuitionApplication[]>([]);
  const [plan, setPlan] = useState<string>(user?.plan || "free");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      apiFetch<{ applications: TuitionApplication[] }>("/applications/my-applications", {
        auth: true,
      }),
      apiFetch<{ user: AuthUser }>("/auth/me", { auth: true }),
    ])
      .then(([apps, profile]) => {
        setApplications(apps.applications);
        setPlan(profile.user.plan || "free");
      })
      .catch(() => setApplications([]))
      .finally(() => setLoading(false));
  }, []);

  const stats: DashboardStats = {
    totalApplied: applications.length,
    acceptedApplications: applications.filter((item) => item.status === "accepted").length,
    pendingApplications: applications.filter((item) => item.status === "pending").length,
  };

  return (
    <div className="space-y-8">
      <section className="rounded-3xl bg-gradient-to-r from-indigo-700 via-indigo-600 to-blue-600 p-8 text-white">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-indigo-200">
              Student workspace
            </p>
            <h2 className="mt-2 text-2xl font-extrabold">
              Welcome back, {user?.name.split(" ")[0]} 👋
            </h2>
            <p className="mt-2 max-w-xl text-sm text-indigo-100">
              Track your applications and discover new tuition batches matched
              to your goals.
            </p>
          </div>
          <Link
            href="/tuitions"
            className="rounded-full bg-white px-6 py-3 text-sm font-bold text-indigo-700 transition hover:bg-indigo-50"
          >
            Explore Tuitions
          </Link>
        </div>
      </section>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Applied" value={stats.totalApplied || 0} icon={BookMarked} />
        <StatCard label="Accepted" value={stats.acceptedApplications || 0} icon={CheckCircle2} tone="emerald" />
        <StatCard label="Pending" value={stats.pendingApplications || 0} icon={Clock3} tone="amber" />
        <StatCard label="Current Plan" value={plan.toUpperCase()} icon={CreditCard} tone="rose" />
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Recent applications</h3>
            <p className="mt-1 text-xs text-slate-500">Your latest tuition requests</p>
          </div>
          <Link
            href="/dashboard/student/my-applications"
            className="text-sm font-bold text-indigo-600 hover:underline"
          >
            View all →
          </Link>
        </div>

        {loading ? (
          <div className="mt-6 h-32 animate-pulse rounded-xl bg-slate-50" />
        ) : applications.length ? (
          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-400">
                <tr>
                  <th className="py-3">Tuition</th>
                  <th className="py-3">Tutor</th>
                  <th className="py-3">Fee</th>
                  <th className="py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {applications.slice(0, 5).map((item) => (
                  <tr key={item._id} className="text-slate-600">
                    <td className="py-4 font-semibold text-slate-800">{item.tuitionTitle}</td>
                    <td className="py-4">{item.tutorEmail}</td>
                    <td className="py-4">৳{Number(item.monthlyFee).toLocaleString("en-BD")}</td>
                    <td className="py-4"><StatusBadge status={item.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="mt-6 rounded-xl border border-dashed border-slate-200 p-10 text-center">
            <Sparkles className="mx-auto h-8 w-8 text-indigo-300" />
            <p className="mt-3 text-sm font-semibold text-slate-600">
              No applications yet
            </p>
            <p className="mt-1 text-xs text-slate-400">
              Find a tuition you like and apply in one click.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
