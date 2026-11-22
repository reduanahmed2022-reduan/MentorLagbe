"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  BookMarked,
  CalendarCheck2,
  LayoutDashboard,
  LogOut,
  Menu,
  PlusCircle,
  ReceiptText,
  ShieldCheck,
  UserRound,
  UsersRound,
  X,
  type LucideIcon,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { dashboardPathFor } from "@/lib/auth";

type NavLink = { href: string; label: string; icon: LucideIcon };

const linksByRole: Record<string, NavLink[]> = {
  student: [
    { href: "/dashboard/student", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/student/my-applications", label: "My Applications", icon: BookMarked },
  ],
  tutor: [
    { href: "/dashboard/tutor", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/tutor/post-tuition", label: "Post a Tuition", icon: PlusCircle },
    { href: "/dashboard/tutor/my-tuitions", label: "My Tuitions", icon: CalendarCheck2 },
    { href: "/dashboard/tutor/applicants", label: "Applicants", icon: UsersRound },
  ],
  admin: [
    { href: "/dashboard/admin", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/admin/users", label: "Users", icon: UsersRound },
    { href: "/dashboard/admin/tuitions", label: "Tuition Approval", icon: ShieldCheck },
    { href: "/dashboard/admin/transactions", label: "Transactions", icon: ReceiptText },
  ],
};

const profileLink: NavLink = {
  href: "/dashboard/profile",
  label: "Update Profile",
  icon: UserRound,
};

const titles: Record<string, string> = {
  "/dashboard/student": "Student Overview",
  "/dashboard/student/my-applications": "My Applications",
  "/dashboard/tutor": "Tutor Overview",
  "/dashboard/tutor/post-tuition": "Post a Tuition",
  "/dashboard/tutor/my-tuitions": "My Tuitions",
  "/dashboard/tutor/applicants": "Applicants",
  "/dashboard/admin": "Admin Overview",
  "/dashboard/admin/users": "User Management",
  "/dashboard/admin/tuitions": "Tuition Approval",
  "/dashboard/admin/transactions": "Transactions",
  "/dashboard/profile": "Update Profile",
};

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const { user, ready, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const role = user?.role;
  const links = role ? [...(linksByRole[role] || []), profileLink] : [];

  // Client-side guard: keeps private routes safe across reloads.
  useEffect(() => {
    if (!ready) return;

    if (!user) {
      router.replace("/sign-in");
      return;
    }

    const segment = pathname.split("/")[2];

    if (["student", "tutor", "admin"].includes(segment) && segment !== user.role) {
      router.replace(dashboardPathFor(user.role));
    }
  }, [ready, user, pathname, router]);

  if (!ready || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-indigo-200 border-t-indigo-600" />
      </div>
    );
  }

  const handleSignOut = () => {
    logout();
    toast.success("You have been signed out");
    router.push("/sign-in");
  };

  const sidebarContent = (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center gap-3 border-b border-white/10 px-5">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500 text-sm font-black text-white">
          M
        </span>
        {!collapsed && (
          <span className="truncate text-lg font-extrabold text-white">
            Mentor<span className="text-emerald-400">Lagbe</span>
          </span>
        )}
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {links.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;

          return (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              title={collapsed ? label : undefined}
              className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition ${
                active
                  ? "bg-indigo-600 text-white"
                  : "text-slate-300 hover:bg-white/10 hover:text-white"
              } ${collapsed ? "justify-center" : ""}`}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {!collapsed && <span className="truncate">{label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/10 p-3">
        <button
          type="button"
          onClick={handleSignOut}
          className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-rose-300 transition hover:bg-rose-500/10 ${
            collapsed ? "justify-center" : ""
          }`}
        >
          <LogOut className="h-5 w-5 shrink-0" />
          {!collapsed && "Sign Out"}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Desktop sidebar */}
      <aside
        className={`fixed bottom-0 left-0 top-[93px] z-40 hidden bg-[#111827] transition-all duration-300 lg:block ${
          collapsed ? "w-20" : "w-64"
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile sidebar */}
      {mobileOpen && (
        <div className="fixed inset-x-0 bottom-0 top-[93px] z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close sidebar"
            className="absolute inset-0 bg-slate-900/50"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 w-64 bg-[#111827]">
            {sidebarContent}
          </aside>
        </div>
      )}

      <div className={`transition-all duration-300 ${collapsed ? "lg:pl-20" : "lg:pl-64"}`}>
        <header className="sticky top-[93px] z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 lg:hidden"
              aria-label="Open sidebar"
            >
              <Menu className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => setCollapsed((value) => !value)}
              className="hidden h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:text-indigo-600 lg:flex"
              aria-label="Toggle sidebar"
            >
              {collapsed ? <Menu className="h-5 w-5" /> : <X className="h-5 w-5" />}
            </button>
            <div>
              <p className="text-xs font-medium text-slate-400">Dashboard</p>
              <h1 className="text-base font-extrabold text-slate-900">
                {titles[pathname] || "Dashboard"}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-bold text-slate-900">{user.name}</p>
              <p className="text-xs font-semibold capitalize text-indigo-600">{user.role}</p>
            </div>
            {user.image ? (
              <img
                src={user.image}
                alt={user.name}
                className="h-9 w-9 rounded-full object-cover"
              />
            ) : (
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-700">
                {user.name.slice(0, 1).toUpperCase()}
              </span>
            )}
          </div>
        </header>

        <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6">{children}</main>
      </div>
    </div>
  );
}
