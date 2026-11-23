
"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import GoogleButton from "@/components/auth/GoogleButton";
import { apiFetch } from "@/lib/api";
import { dashboardPathFor, saveSession } from "@/lib/auth";
import type { AuthUser } from "@/lib/types";

export default function RegisterPage() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [role, setRole] = useState("student");

    // "Become a Tutor" from the home page preselects the tutor role.
    // Deferred so the server-rendered markup and first client render match.
    useEffect(() => {
        Promise.resolve().then(() => {
            const preset = new URLSearchParams(window.location.search).get("role");

            if (preset === "tutor" || preset === "student") {
                setRole(preset);
            }
        });
    }, []);

    const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        const form = e.currentTarget;
        const formData = new FormData(form);

        const name = String(formData.get("name") || "").trim();
        const email = String(formData.get("email") || "").trim();
        const password = String(formData.get("password") || "");
        const confirmPassword = String(
            formData.get("confirmPassword") || ""
        );

        if (!name || !email || !password || !confirmPassword) {
            setError("Please fill in all required fields.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        if (password.length < 8) {
            setError("Password must be at least 8 characters.");
            return;
        }

        setLoading(true);

        try {
            await apiFetch("/auth/register", {
                method: "POST",
                body: { name, email, password, role },
            });

            const loginData = await apiFetch<{
                token: string;
                user: AuthUser;
            }>("/auth/login", {
                method: "POST",
                body: { email, password },
            });

            if (!loginData.token || !loginData.user) {
                setSuccess("Account created! Please sign in manually.");
                form.reset();
                setRole("student");
                return;
            }

            saveSession(loginData.token, loginData.user);
            toast.success("Account created. Welcome to MentorLagbe!");
            router.push(dashboardPathFor(loginData.user.role));

        } catch (err) {
            const message =
                err instanceof Error
                    ? err.message
                    : "Something went wrong. Please try again.";

            setError(message);
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f5f7ff]">
            <main className="flex min-h-screen items-center justify-center px-4 py-6 sm:px-6 lg:px-8">
            <div className="mx-auto grid w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-xl shadow-slate-200/60 lg:grid-cols-2">

                {/* Left Branding Section */}
                <section className="relative hidden overflow-hidden bg-gradient-to-br from-blue-700 via-indigo-700 to-violet-800 p-8 text-white lg:flex lg:flex-col lg:justify-between">
                    <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
                    <div className="absolute -bottom-28 -left-20 h-80 w-80 rounded-full bg-indigo-400/20 blur-3xl" />

                    <div className="relative z-10">
                        <Link href="/" className="inline-flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-xl font-black text-indigo-700">
                                M
                            </div>
                            <span className="text-2xl font-extrabold tracking-tight">
                                Mentor<span className="text-blue-200">Lagbe</span>
                            </span>
                        </Link>
                    </div>

                    <div className="relative z-10 max-w-md">
                        <span className="mb-3 inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium">
                            Learn. Grow. Achieve.
                        </span>

                        <h1 className="text-3xl font-extrabold leading-tight xl:text-4xl">
                            Your Learning Journey Starts Here.
                        </h1>

                        <p className="mt-4 text-sm leading-7 text-blue-100">
                            Connect with experienced tutors, discover the right learning
                            opportunities, and take the next step toward your goals.
                        </p>

                        <div className="mt-7 space-y-3">
                            {[
                                "Find qualified and experienced tutors",
                                "Book personalized learning sessions",
                                "Build skills at your own pace",
                            ].map((item) => (
                                <div key={item} className="flex items-center gap-3">
                                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/20 text-sm">
                                        ✓
                                    </div>
                                    <span className="text-sm font-medium text-blue-50">
                                        {item}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <p className="relative z-10 text-sm text-blue-200" suppressHydrationWarning>
                        © {new Date().getFullYear()} MentorLagbe. All rights reserved.
                    </p>
                </section>

                {/* Right Register Form */}
                <section className="flex items-center justify-center px-6 py-8 sm:px-8 lg:px-10">
                    <div className="w-full max-w-md">

                        {/* Mobile Logo */}
                        <Link
                            href="/"
                            className="mb-5 inline-flex items-center gap-2 lg:hidden"
                        >
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-lg font-black text-white">
                                M
                            </div>
                            <span className="text-xl font-extrabold text-slate-900">
                                Mentor<span className="text-indigo-600">Lagbe</span>
                            </span>
                        </Link>

                        <div className="mb-5">
                            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-indigo-600">
                                Get Started Today
                            </p>

                            <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                                Create Account
                            </h2>

                            <p className="mt-2 text-sm leading-6 text-slate-500">
                                Join MentorLagbe and start your learning journey.
                            </p>
                        </div>

                        <form onSubmit={handleRegister} className="space-y-3">

                            {/* Full Name */}
                            <div>
                                <label
                                    htmlFor="name"
                                    className="mb-1.5 block text-sm font-semibold text-slate-700"
                                >
                                    Full Name
                                </label>

                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    placeholder="Enter your full name"
                                    autoComplete="name"
                                    aria-invalid={Boolean(error)}
                                    aria-describedby={error ? "form-error" : undefined}
                                    required
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
                                />
                            </div>

                            {/* Account Role */}
                            <div>
                                <label
                                    htmlFor="role"
                                    className="mb-1.5 block text-sm font-semibold text-slate-700"
                                >
                                    I want to join as
                                </label>

                                <select
                                    id="role"
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
                                >
                                    <option value="student">Student</option>
                                    <option value="tutor">Tutor</option>
                                </select>
                            </div>

                            {/* Email */}
                            <div>
                                <label
                                    htmlFor="email"
                                    className="mb-1.5 block text-sm font-semibold text-slate-700"
                                >
                                    Email Address
                                </label>

                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="you@example.com"
                                    autoComplete="email"
                                    aria-invalid={Boolean(error)}
                                    aria-describedby={error ? "form-error" : undefined}
                                    required
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
                                />
                            </div>

                            {/* Password */}
                            <div>
                                <label
                                    htmlFor="password"
                                    className="mb-1.5 block text-sm font-semibold text-slate-700"
                                >
                                    Password
                                </label>

                                <div className="relative">
                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Minimum 8 characters"
                                        autoComplete="new-password"
                                        aria-invalid={Boolean(error)}
                                        aria-describedby={error ? "form-error" : undefined}
                                        required
                                        minLength={8}
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 pr-16 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
                                    />

                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-indigo-600 hover:text-indigo-800"
                                    >
                                        {showPassword ? "Hide" : "Show"}
                                    </button>
                                </div>
                            </div>

                            {/* Confirm Password */}
                            <div>
                                <label
                                    htmlFor="confirmPassword"
                                    className="mb-1.5 block text-sm font-semibold text-slate-700"
                                >
                                    Confirm Password
                                </label>

                                <div className="relative">
                                    <input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type={showConfirmPassword ? "text" : "password"}
                                        placeholder="Re-enter your password"
                                        autoComplete="new-password"
                                        aria-invalid={Boolean(error)}
                                        aria-describedby={error ? "form-error" : undefined}
                                        required
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 pr-16 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowConfirmPassword(!showConfirmPassword)
                                        }
                                        aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-indigo-600 hover:text-indigo-800"
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
                                    required
                                    className="mt-1 h-4 w-4 rounded border-slate-300 accent-indigo-600"
                                />

                                <label
                                    htmlFor="terms"
                                    className="text-xs leading-5 text-slate-500"
                                >
                                    I agree to the{" "}
                                    <Link
                                        href="/terms"
                                        className="font-semibold text-indigo-600 hover:underline"
                                    >
                                        Terms & Conditions
                                    </Link>{" "}
                                    and{" "}
                                    <Link
                                        href="/privacy"
                                        className="font-semibold text-indigo-600 hover:underline"
                                    >
                                        Privacy Policy
                                    </Link>
                                    .
                                </label>
                            </div>

                            {/* Error Message */}
                            {error && (
                                <div id="form-error" role="alert" aria-live="polite" className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                                    {error}
                                </div>
                            )}

                            {/* Success Message */}
                            {success && (
                                <div aria-live="polite" className="rounded-xl border border-green-200 bg-green-50 p-3 text-sm text-green-700">
                                    {success}
                                    <Link
                                        href="/sign-in"
                                        className="ml-2 font-bold underline"
                                    >
                                        Sign In
                                    </Link>
                                </div>
                            )}

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:from-blue-700 hover:to-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {loading ? "Creating Account..." : "Create Account"}
                                {!loading && (
                                    <span className="transition group-hover:translate-x-1">
                                        →
                                    </span>
                                )}
                            </button>
                        </form>

                        {/* Google Sign Up */}
                        <div className="mt-5">
                            <div className="my-4 flex items-center gap-4">
                                <div className="h-px flex-1 bg-slate-200" />
                                <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
                                    Or sign up with
                                </span>
                                <div className="h-px flex-1 bg-slate-200" />
                            </div>

                            <GoogleButton role={role === "tutor" ? "tutor" : "student"} />
                        </div>

                        {/* Sign In Link */}
                        <p className="mt-5 text-center text-sm text-slate-500">
                            Already have an account?{" "}
                            <Link
                                href="/sign-in"
                                className="font-bold text-indigo-600 hover:text-indigo-800"
                            >
                                Sign In
                            </Link>
                        </p>

                        <p className="mt-5 text-center text-xs text-slate-400">
                            Secure registration powered by MentorLagbe.
                        </p>
                    </div>
                </section>
            </div>
            </main>
        </div>
    );
}
