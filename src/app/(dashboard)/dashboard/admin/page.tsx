"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  BadgeDollarSign,
  BookOpenCheck,
  CircleX,
  Clock3,
  GraduationCap,
  ShieldCheck,
  UsersRound,
} from "lucide-react";
import StatCard from "@/components/dashboard/StatCard";
import { useAuth } from "@/hooks/useAuth";
import { apiFetch } from "@/lib/api";
import type { DashboardStats } from "@/lib/types";

const quickLinks = [
  { href: "/dashboard/admin/users", label: "Manage Users", icon: UsersRound, tone: "bg-indigo-50 text-indigo-600" },
  { href: "/dashboard/admin/tuitions", label: "Review Tuitions", icon: ShieldCheck, tone: "bg-amber-50 text-amber-600" },
  { href: "/dashboard/admin/transactions", label: "Transactions", icon: BadgeDollarSign, tone: "bg-emerald-50 text-emerald-600" },
];

export default function AdminOverviewPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch<{ stats: DashboardStats }>("/admin/stats", { auth: true })
      .then((data) => setStats(data.stats))
      .catch(() => setStats({}))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-8">
      <section className="rounded-3xl bg-gradient-to-r from-slate-800 via-slate-900 to-indigo-900 p-8 text-white">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-indigo-300">
              Admin control center
            </p>
            <h2 className="mt-2 text-2xl font-extrabold">
              Platform overview, {user?.name.split(" ")[0]} 🛡️
            </h2>
            <p className="mt-2 max-w-xl text-sm text-slate-300">
              Monitor growth, moderate tuitions and keep payments flowing.
            </p>
          </div>
          <span className="rounded-full bg-white/10 px-5 py-2.5 text-sm font-bold text-indigo-200">
            {new Date().toLocaleDateString(undefined, { month: "long", year: "numeric" })}
          </span>
        </div>
      </section>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Users" value={loading ? "…" : stats.totalUsers || 0} icon={UsersRound} />
        <StatCard label="Students" value={loading ? "…" : stats.totalStudents || 0} icon={GraduationCap} tone="emerald" />
        <StatCard label="Tutors" value={loading ? "…" : stats.totalTutors || 0} icon={BookOpenCheck} tone="amber" />
        <StatCard label="Revenue" value={loading ? "…" : `$${Number(stats.totalRevenue || 0).toFixed(2)}`} icon={BadgeDollarSign} tone="rose" />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Pending Tuitions" value={loading ? "…" : stats.pendingTuitions || 0} icon={Clock3} tone="amber" />
        <StatCard label="Approved Tuitions" value={loading ? "…" : stats.approvedTuitions || 0} icon={ShieldCheck} tone="emerald" />
        <StatCard label="Rejected Tuitions" value={loading ? "…" : stats.rejectedTuitions || 0} icon={CircleX} tone="rose" />
        <StatCard label="Total Applications" value={loading ? "…" : stats.totalApplications || 0} icon={BookOpenCheck} />
      </div>

      <section>
        <h3 className="mb-4 text-lg font-bold text-slate-900">Quick actions</h3>
        <div className="grid gap-4 sm:grid-cols-3">
          {quickLinks.map(({ href, label, icon: Icon, tone }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${tone}`}>
                <Icon className="h-5 w-5" />
              </span>
              <span className="font-bold text-slate-800">{label}</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
