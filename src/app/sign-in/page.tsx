
"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const router = useRouter();

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");

        const formData = new FormData(e.currentTarget);

        const email = String(formData.get("email") || "").trim();
        const password = String(formData.get("password") || "");

        if (!email || !password) {
            setError("Please enter your email and password.");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(
                "http://localhost:5000/api/auth/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email,
                        password,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.message || "Login failed.");
            }

            if (!data.token || !data.user) {
                throw new Error("Invalid login response from server.");
            }

            // Save JWT token and user information
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));

            // Redirect according to user role
            router.push("/dashboard");

        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Something went wrong. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

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
                            Your Learning Journey Starts Here
                        </span>

                        <h2 className="max-w-md text-4xl font-bold leading-tight xl:text-5xl">
                            Find the right mentor.
                            <span className="mt-2 block text-blue-200">
                                Unlock your potential.
                            </span>
                        </h2>

                        <p className="mt-6 max-w-md text-base leading-8 text-blue-100/90">
                            Connect with experienced tutors, discover new
                            opportunities, and make learning easier with
                            MentorLagbe.
                        </p>

                        <div className="mt-10 flex items-center gap-4">
                            <div className="flex -space-x-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-indigo-700 bg-amber-300 font-bold text-indigo-900">
                                    S
                                </div>
                                <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-indigo-700 bg-pink-300 font-bold text-indigo-900">
                                    A
                                </div>
                                <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-indigo-700 bg-cyan-300 font-bold text-indigo-900">
                                    R
                                </div>
                            </div>

                            <div>
                                <p className="font-semibold">Learn with confidence</p>
                                <p className="text-sm text-blue-200">
                                    Your future, your way.
                                </p>
                            </div>
                        </div>
                    </div>

                    <p className="relative z-10 text-sm text-blue-200">
                        © 2026 MentorLagbe. All rights reserved.
                    </p>
                </section>

                {/* Right Side - Sign In Form */}
                <section className="flex items-center justify-center px-6 py-10 sm:px-10 lg:px-12 xl:px-16">

                    <div className="w-full max-w-md">

                        {/* Mobile Logo */}
                        <Link href="/" className="mb-9 flex items-center justify-center gap-2 lg:hidden">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-lg font-bold text-white">
                                M
                            </div>
                            <span className="text-2xl font-bold text-slate-900">
                                Mentor<span className="text-blue-600">Lagbe</span>
                            </span>
                        </Link>

                        <div className="mb-8">
                            <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                                <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" stroke="currentColor" strokeWidth="1.8">
                                    <path d="M15 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" strokeLinecap="round" />
                                    <circle cx="9" cy="7" r="4" />
                                    <path d="M19 8v6M22 11h-6" strokeLinecap="round" />
                                </svg>
                            </div>

                            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                                Welcome back!
                            </h1>

                            <p className="mt-3 text-sm leading-6 text-slate-500 sm:text-base">
                                Sign in to continue your learning journey with MentorLagbe.
                            </p>
                        </div>

                        {/* Google Button */}
                        <button
                            type="button"
                            disabled
                            title="Google login is not configured yet"
                            className="flex w-full cursor-not-allowed items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm font-semibold text-slate-400"
                        >
                            <svg viewBox="0 0 48 48" className="h-5 w-5">
                                <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917Z" />
                                <path fill="#FF3D00" d="m6.306 14.691 6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4c-7.682 0-14.344 4.337-17.694 10.691Z" />
                                <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44Z" />
                                <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917Z" />
                            </svg>
                            Continue with Google
                        </button>

                        <p className="mt-2 text-center text-xs text-slate-400">
                            Google sign-in is not available yet.
                        </p>

                        {/* Divider */}
                        <div className="my-7 flex items-center gap-4">
                            <div className="h-px flex-1 bg-slate-200" />
                            <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
                                Or continue with email
                            </span>
                            <div className="h-px flex-1 bg-slate-200" />
                        </div>

                        {/* Login Form */}
                        <form onSubmit={handleLogin} className="space-y-5">

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
                                <div className="mb-2 flex items-center justify-between">
                                    <label htmlFor="password" className="text-sm font-semibold text-slate-700">
                                        Password
                                    </label>

                                    <Link href="/forgot-password" className="text-xs font-semibold text-blue-600 transition hover:text-blue-700 hover:underline">
                                        Forgot password?
                                    </Link>
                                </div>

                                <div className="relative">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400">
                                        <rect x="4" y="10" width="16" height="11" rx="2" />
                                        <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                                    </svg>

                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Enter your password"
                                        autoComplete="current-password"
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3.5 pl-12 pr-12 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                                        required
                                    />

                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-blue-600"
                                    >
                                        {showPassword ? (
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="h-5 w-5">
                                                <path d="M3 3l18 18M10.6 10.6a2 2 0 0 0 2.8 2.8" />
                                                <path d="M9.9 5.2A10.7 10.7 0 0 1 12 5c5 0 9 4.5 10 7-.4.9-1.2 2-2.3 3M6.2 6.2C4.1 7.6 2.5 9.7 2 12c1 2.5 5 7 10 7 1.1 0 2.1-.2 3.1-.5" strokeLinecap="round" />
                                            </svg>
                                        ) : (
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="h-5 w-5">
                                                <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z" />
                                                <circle cx="12" cy="12" r="3" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Remember Me */}
                            <div className="flex items-center gap-2">
                                <input
                                    id="remember"
                                    name="remember"
                                    type="checkbox"
                                    className="h-4 w-4 rounded border-slate-300 accent-blue-600"
                                />
                                <label htmlFor="remember" className="text-sm text-slate-500">
                                    Remember me
                                </label>
                            </div>

                            {/* Error Message */}
                            {error && (
                                <div
                                    role="alert"
                                    className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600"
                                >
                                    {error}
                                </div>
                            )}

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {loading ? "Signing In..." : "Sign In"}

                                {!loading && (
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4 transition group-hover:translate-x-1">
                                        <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                )}
                            </button>
                        </form>

                        {/* Register Link */}
                        <p className="mt-8 text-center text-sm text-slate-500">
                            Don't have an account?{" "}
                            <Link
                                href="/sign-up"
                                className="font-bold text-blue-600 transition hover:text-indigo-700 hover:underline"
                            >
                                Create an account
                            </Link>
                        </p>

                        <p className="mt-8 text-center text-xs text-slate-400 lg:hidden">
                            © 2026 MentorLagbe. All rights reserved.
                        </p>

                    </div>
                </section>
            </div>
        </main>
    );
}
