
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type User = {
    id?: string;
    name: string;
    email: string;
    role: string;
};

export default function DashboardPage() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const savedUser = localStorage.getItem("user");

        if (!token || !savedUser) {
            router.replace("/sign-in");
            return;
        }

        try {
            const parsedUser = JSON.parse(savedUser) as User;
            setUser(parsedUser);
        } catch {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            router.replace("/sign-in");
            return;
        }

        setLoading(false);
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        router.replace("/sign-in");
    };

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-50">
                <p className="text-sm font-medium text-slate-500">
                    Loading dashboard...
                </p>
            </div>
        );
    }

    if (!user) return null;

    return (
        <main className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-6xl">

                {/* Header */}
                <header className="mb-10 flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">
                            Mentor<span className="text-indigo-600">Lagbe</span>
                        </h1>
                        <p className="mt-1 text-sm text-slate-500">
                            Your personal learning dashboard
                        </p>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="rounded-xl border border-red-200 bg-white px-5 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                    >
                        Logout
                    </button>
                </header>

                {/* Welcome Section */}
                <section className="rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-700 to-violet-700 p-7 text-white shadow-lg sm:p-10">
                    <p className="text-sm font-medium text-blue-100">
                        {user.role === "student"
                            ? "Student Dashboard"
                            : user.role === "tutor"
                                ? "Tutor Dashboard"
                                : "Dashboard"}
                    </p>

                    <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">
                        Welcome, {user.name}!
                    </h2>

                    <p className="mt-4 max-w-xl text-sm leading-7 text-blue-100 sm:text-base">
                        {user.role === "student"
                            ? "Explore tuition opportunities, find experienced tutors, and continue your learning journey."
                            : user.role === "tutor"
                                ? "Manage your tutoring opportunities, connect with students, and grow your teaching career."
                                : "Welcome to your MentorLagbe dashboard."}
                    </p>
                </section>

                {/* User Information */}
                <section className="mt-8 grid gap-5 md:grid-cols-2">

                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-xl">
                            👤
                        </div>

                        <p className="text-sm font-medium text-slate-500">
                            Full Name
                        </p>

                        <h3 className="mt-2 text-xl font-bold text-slate-900">
                            {user.name}
                        </h3>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-xl">
                            ✉️
                        </div>

                        <p className="text-sm font-medium text-slate-500">
                            Email Address
                        </p>

                        <h3 className="mt-2 break-all text-lg font-bold text-slate-900">
                            {user.email}
                        </h3>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:col-span-2">
                        <p className="text-sm font-medium text-slate-500">
                            Account Type
                        </p>

                        <span className="mt-3 inline-flex rounded-full bg-indigo-50 px-4 py-2 text-sm font-bold capitalize text-indigo-700">
                            {user.role}
                        </span>
                    </div>

                </section>

                {/* Quick Actions */}
                <section className="mt-8">
                    <h2 className="mb-5 text-xl font-bold text-slate-900">
                        Quick Actions
                    </h2>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <button
                            onClick={() => router.push("/tuitions")}
                            className="rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:border-indigo-300 hover:shadow-md"
                        >
                            <span className="text-2xl">📚</span>
                            <h3 className="mt-3 font-bold text-slate-900">
                                Explore Tuitions
                            </h3>
                            <p className="mt-1 text-sm text-slate-500">
                                Browse available tuition opportunities.
                            </p>
                        </button>

                        <button
                            onClick={() => router.push("/profile")}
                            className="rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:border-indigo-300 hover:shadow-md"
                        >
                            <span className="text-2xl">⚙️</span>
                            <h3 className="mt-3 font-bold text-slate-900">
                                My Profile
                            </h3>
                            <p className="mt-1 text-sm text-slate-500">
                                View and manage your profile.
                            </p>
                        </button>
                    </div>
                </section>

            </div>
        </main>
    );
}
