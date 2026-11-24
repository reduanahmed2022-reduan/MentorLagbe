"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { dashboardPathFor } from "@/lib/auth";
import { PUBLIC_NAV } from "@/lib/constants";
import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";

function initials(name?: string) {
  if (!name) return "U";

  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (href: string) => {
    if (href.includes("#")) return pathname === "/";
    if (href === "/") return pathname === "/";

    return pathname.startsWith(href);
  };

  const handleSignOut = () => {
    logout();
    setProfileOpen(false);
    setMobileMenuOpen(false);
    toast.success("You have been signed out");
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-[100] w-full border-b border-gray-100 bg-[#f1f7f4]/90 px-4 py-3 backdrop-blur-xl sm:px-8 lg:px-16">
      <nav className="mx-auto flex h-[68px] max-w-7xl items-center justify-between rounded-2xl border border-white/70 bg-white/95 px-4 shadow-md shadow-gray-900/5 sm:px-6">
        <Logo />

        <div className="hidden items-center gap-7 lg:flex">
          {PUBLIC_NAV.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-semibold transition hover:text-[#0f9f6e] ${
                isActive(link.href) ? "text-[#0f9f6e]" : "text-gray-600"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <ThemeToggle />

          {!isAuthenticated ? (
            <>
              <Link
                href="/sign-in"
                className="text-sm font-semibold text-gray-700 transition hover:text-[#0f9f6e]"
              >
                Sign In
              </Link>
              <Link
                href="/sign-up"
                className="rounded-full bg-[#0f9f6e] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#087a54]"
              >
                Sign Up
              </Link>
            </>
          ) : (
            <>
              <Link
                href={dashboardPathFor(user?.role)}
                className="text-sm font-semibold text-gray-700 transition hover:text-[#0f9f6e]"
              >
                Dashboard
              </Link>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setProfileOpen((open) => !open)}
                  className="flex items-center gap-2 rounded-full border border-gray-200 bg-white py-1 pl-1 pr-3 transition hover:border-[#0f9f6e]"
                  aria-expanded={profileOpen}
                >
                  {user?.image ? (
                    <img
                      src={user.image}
                      alt={user.name}
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  ) : (
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-[#0f9f6e]">
                      {initials(user?.name)}
                    </span>
                  )}
                  <span className="max-w-24 truncate text-sm font-semibold text-slate-800">
                    {user?.name}
                  </span>
                </button>

                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-60 rounded-2xl border border-gray-100 bg-white p-4 shadow-xl">
                    <p className="truncate text-sm font-bold text-slate-900">{user?.name}</p>
                    <p className="mt-0.5 truncate text-xs text-slate-500">{user?.email}</p>
                    <span className="mt-2 inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold capitalize text-[#0f9f6e]">
                      {user?.role}
                    </span>
                    <div className="mt-4 space-y-1 border-t border-slate-100 pt-3">
                      <Link
                        href="/dashboard/profile"
                        onClick={() => setProfileOpen(false)}
                        className="block rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-emerald-50 hover:text-[#0f9f6e]"
                      >
                        Update Profile
                      </Link>
                      <button
                        type="button"
                        onClick={handleSignOut}
                        className="w-full rounded-xl px-3 py-2 text-left text-sm font-semibold text-rose-600 transition hover:bg-rose-50"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <ThemeToggle className="rounded-xl" />

          <button
            type="button"
            onClick={() => setMobileMenuOpen((open) => !open)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 text-slate-700 transition hover:border-[#0f9f6e] focus:outline-none focus:ring-2 focus:ring-[#0f9f6e]"
            aria-label="Toggle navigation"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
                <path d="m6 6 12 12M18 6 6 18" strokeLinecap="round" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
                <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {mobileMenuOpen && (
        <div
          id="mobile-navigation"
          className="mx-auto mt-2 max-h-[calc(100vh-100px)] max-w-7xl overflow-y-auto rounded-2xl border border-gray-100 bg-white p-5 shadow-xl lg:hidden"
        >
          <div className="flex flex-col gap-1">
            {PUBLIC_NAV.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`rounded-xl px-4 py-3 text-sm font-semibold transition ${
                  isActive(link.href)
                    ? "bg-emerald-50 text-[#0f9f6e]"
                    : "text-gray-700 hover:bg-slate-50"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="mt-4 space-y-2 border-t border-slate-100 pt-4">
            {!isAuthenticated ? (
              <>
                <Link
                  href="/sign-in"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block rounded-xl border border-slate-200 px-4 py-3 text-center text-sm font-semibold text-slate-700"
                >
                  Sign In
                </Link>
                <Link
                  href="/sign-up"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block rounded-full bg-[#0f9f6e] px-4 py-3 text-center text-sm font-semibold text-white"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <>
                <p className="px-1 text-sm font-bold text-slate-900">
                  {user?.name}{" "}
                  <span className="ml-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-bold capitalize text-[#0f9f6e]">
                    {user?.role}
                  </span>
                </p>
                <Link
                  href={dashboardPathFor(user?.role)}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block rounded-xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700"
                >
                  Dashboard
                </Link>
                <Link
                  href="/dashboard/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block rounded-xl bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700"
                >
                  Update Profile
                </Link>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="w-full rounded-xl px-4 py-3 text-sm font-semibold text-rose-600"
                >
                  Sign Out
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
