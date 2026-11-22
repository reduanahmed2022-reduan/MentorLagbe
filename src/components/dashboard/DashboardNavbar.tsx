"use client";

import Link from "next/link";
import { Home } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import Logo from "@/components/shared/Logo";

function initials(name?: string) {
  if (!name) return "U";

  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function DashboardNavbar() {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-[100] w-full border-b border-indigo-100 bg-indigo-50/90 px-4 py-3 backdrop-blur-xl sm:px-8 lg:px-16">
      <nav className="mx-auto flex h-[68px] max-w-7xl items-center justify-between rounded-2xl border border-white/70 bg-white/95 px-4 shadow-md shadow-indigo-900/5 sm:px-6">
        <Logo />

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/"
            className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:border-indigo-500 hover:text-indigo-600"
          >
            <Home className="h-4 w-4" />
            Home
          </Link>

          <Link
            href="/dashboard/profile"
            className="flex items-center gap-2 rounded-full border border-gray-200 bg-white py-1 pl-1 pr-3 transition hover:border-indigo-500"
            aria-label="Update profile"
          >
            {user?.image ? (
              <img
                src={user.image}
                alt=""
                className="h-8 w-8 rounded-full object-cover"
              />
            ) : (
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700">
                {initials(user?.name)}
              </span>
            )}
            <span className="hidden max-w-24 truncate text-sm font-semibold text-slate-800 sm:block">
              {user?.name}
            </span>
          </Link>
        </div>
      </nav>
    </header>
  );
}
