
"use client";

import { useState } from "react";
import Link from "next/link";

export default function RegisterPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    return (
        <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f5f7ff] px-4 py-8 sm:px-6 lg:px-8">

            {/* Background Decorations */}
            <div className="absolute -left-32 -top-32 h-80 w-80 rounded-full bg-blue-200/40 blur-3xl" />
            <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-indigo-200/40 blur-3xl" />

            <div className="relative grid w-full max-w-6xl overflow-hidden rounded-[28px] bg-white shadow-[0_25px_80px_-25px_rgba(30,64,175,0.18)] lg:grid-cols-2">

                {/* Left Side - Branding */}
                <section className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-blue-700 via-indigo-700 to-violet-800 p-10 text-white lg:flex xl:p-14">

                    <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full border border-white/10" />
                    <div className="absolute -right-12 -top-12 h-52 w-52 rounded-full border border-white/10" />
                    <div className="absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-white/5" />

                    <div className="relative z-10">
                        <Link href="/" className="inline-flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 text-xl font-bold backdrop-blur">
                                M
                            </div>
                            <span className="text-2xl font-bold tracking-tight">
                                Mentor<span className="text-blue-200">Lagbe</span>
                            </span>
                        </Link>
                    </div>

                    <div className="relative z-10 my-12">
                        <span className="mb-6 inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-blue-100">
                            Start Your Journey Today
                        </span>

                        <h2 className="max-w-md text-4xl font-bold leading-tight xl:text-5xl">
                            Your next chapter
                            <span className="mt-2 block text-blue-200">
                                starts with learning.
                            </span>
                        </h2>

                        <p className="mt-6 max-w-md text-base leading-8 text-blue-100/90">
                            Join MentorLagbe and connect with the right tutors.
                            Build your skills, explore opportunities, and take
                            the next step toward your goals.
                        </p>

                        <div className="mt-10 space-y-5">
                            {[
                                "Find experienced tutors",
                                "Discover learning opportunities",
                                "Learn at your own pace",
                            ].map((item) => (
                                <div key={item} className="flex items-center gap-3">
                                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/15 text-sm">
                                        ✓
                                    </div>
                                    <span className="text-sm font-medium text-blue-50">
                                        {item}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <p className="relative z-10 text-sm text-blue-200">
                        © 2026 MentorLagbe. All rights reserved.
                    </p>
                </section>

                {/* Right Side - Register Form */}
                <section className="flex items-center justify-center px-6 py-10 sm:px-10 lg:px-12 xl:px-16">

                    <div className="w-full max-w-md">

                        {/* Mobile Logo */}
                        <Link href="/" className="mb-8 flex items-center justify-center gap-2 lg:hidden">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-lg font-bold text-white">
                                M
                            </div>
                            <span className="text-2xl font-bold text-slate-900">
                                Mentor<span className="text-blue-600">Lagbe</span>
                            </span>
                        </Link>

                        <div className="mb-7">
                            <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                                <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" stroke="currentColor" strokeWidth="1.8">
                                    <path d="M15 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" strokeLinecap="round" />
                                    <circle cx="9" cy="7" r="4" />
                                    <path d="M19 8v6M22 11h-6" strokeLinecap="round" />
                                </svg>
                            </div>

                            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                                Create account
                            </h1>

                            <p className="mt-3 text-sm leading-6 text-slate-500 sm:text-base">
                                Join MentorLagbe and start your learning journey today.
                            </p>
                        </div>

                        {/* Google Sign Up */}
                        <button
                            type="button"
                            className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:bg-blue-50/50"
                        >
                            <svg viewBox="0 0 48 48" className="h-5 w-5">
                                <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917Z" />
                                <path fill="#FF3D00" d="m6.306 14.691 6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4c-7.682 0-14.344 4.337-17.694 10.691Z" />
                                <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44Z" />
                                <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917Z" />
                            </svg>
                            Sign up with Google
                        </button>

                        {/* Divider */}
                        <div className="my-6 flex items-center gap-4">
                            <div className="h-px flex-1 bg-slate-200" />
                            <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
                                Or register with email
                            </span>
                            <div className="h-px flex-1 bg-slate-200" />
                        </div>

                        {/* Registration Form */}
                        <form className="space-y-4">

                            {/* Full Name */}
                            <div>
                                <label htmlFor="name" className="mb-2 block text-sm font-semibold text-slate-700">
                                    Full Name
                                </label>

                                <div className="relative">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400">
                                        <circle cx="12" cy="8" r="4" />
                                        <path d="M5 21v-2a7 7 0 0 1 14 0v2" />
                                    </svg>

                                    <input
                                        id="name"
                                        name="name"
                                        type="text"
                                        placeholder="Enter your full name"
                                        autoComplete="name"
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3.5 pl-12 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Email */}
                            <div>
                                <label htmlFor="email" className="mb-2 block text-sm font-semibold text-slate-700">
                                    Email Address
                                </label>

                                <div className="relative">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400">
                                        <rect x="3" y="5" width="18" height="14" rx="2" />
                                        <path d="m3 7 9 6 9-6" />
                                    </svg>

                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="you@example.com"
                                        autoComplete="email"
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3.5 pl-12 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div>
                                <label htmlFor="password" className="mb-2 block text-sm font-semibold text-slate-700">
                                    Password
                                </label>

                                <div className="relative">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400">
                                        <rect x="4" y="10" width="16" height="11" rx="2" />
                                        <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                                    </svg>

                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Create a password"
                                        autoComplete="new-password"
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3.5 pl-12 pr-12 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                                        required
                                    />

                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-blue-600"
                                    >
                                        {showPassword ? "Hide" : "Show"}
                                    </button>
                                </div>
                            </div>

                            {/* Confirm Password */}
                            <div>
                                <label htmlFor="confirmPassword" className="mb-2 block text-sm font-semibold text-slate-700">
                                    Confirm Password
                                </label>

                                <div className="relative">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400">
                                        <rect x="4" y="10" width="16" height="11" rx="2" />
                                        <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                                    </svg>

                                    <input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type={showConfirmPassword ? "text" : "password"}
                                        placeholder="Confirm your password"
                                        autoComplete="new-password"
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3.5 pl-12 pr-12 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                                        required
                                    />

                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-blue-600"
                                    >
                                        {showConfirmPassword ? "Hide" : "Show"}
                                    </button>
                                </div>
                            </div>

                            {/* Terms */}
                            <div className="flex items-start gap-3 pt-1">
                                <input
                                    id="terms"
                                    type="checkbox"
                                    className="mt-1 h-4 w-4 shrink-0 rounded border-slate-300 accent-blue-600"
                                    required
                                />

                                <label htmlFor="terms" className="text-xs leading-5 text-slate-500">
                                    I agree to the{" "}
                                    <Link href="/terms" className="font-semibold text-blue-600 hover:underline">
                                        Terms & Conditions
                                    </Link>
                                    {" "}and{" "}
                                    <Link href="/privacy" className="font-semibold text-blue-600 hover:underline">
                                        Privacy Policy
                                    </Link>.
                                </label>
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl active:translate-y-0"
                            >
                                Create Account

                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4 transition group-hover:translate-x-1">
                                    <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>
                        </form>

                        {/* Sign In Link */}
                        <p className="mt-7 text-center text-sm text-slate-500">
                            Already have an account?{" "}
                            <Link
                                href="/sign-in"
                                className="font-bold text-blue-600 transition hover:text-indigo-700 hover:underline"
                            >
                                Sign In
                            </Link>
                        </p>

                        <p className="mt-7 text-center text-xs text-slate-400 lg:hidden">
                            © 2026 MentorLagbe. All rights reserved.
                        </p>

                    </div>
                </section>
            </div>
        </main>
    );
}
