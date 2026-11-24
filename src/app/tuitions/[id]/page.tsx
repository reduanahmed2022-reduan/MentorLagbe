
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Footer from "@/components/shared/Footer";
import Navbar from "@/components/shared/Navbar";
import ShareButtons from "@/components/shared/ShareButtons";
import ApplyForm from "@/components/tuitions/ApplyForm";
import BookmarkButton from "@/components/tuitions/BookmarkButton";
import { apiFetch } from "@/lib/api";
import {
    ArrowLeft,
    BookOpen,
    CalendarDays,
    Clock,
    GraduationCap,
    MapPin,
    Monitor,
    Wallet,
    Loader2,
    AlertCircle,
} from "lucide-react";

interface Tuition {
    _id: string;
    title: string;
    subject: string;
    classLevel: string;
    mode: "Online" | "Offline";
    location: string;
    monthlyFee: number;
    daysPerWeek: number;
    bannerImage?: string;
    description: string;
    tutorName: string;
    tutorEmail: string;
    createdAt: string;
}

export default function TuitionDetailsPage() {
    const params = useParams();
    const id = params.id as string;

    const [tuition, setTuition] = useState<Tuition | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!id) return;

        const fetchTuition = async () => {
            try {
                setLoading(true);
                setError("");

                const data = await apiFetch<{ tuition: Tuition }>(`/tuitions/${id}`);

                setTuition(data.tuition);
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

        fetchTuition();
    }, [id]);

    if (loading) {
        return (
            <>
            <Navbar />
            <main className="flex min-h-[70vh] items-center justify-center bg-slate-50 px-4">
                <div className="text-center">
                    <Loader2 className="mx-auto h-10 w-10 animate-spin text-emerald-600" />
                    <p className="mt-4 text-sm font-medium text-slate-600">
                        Loading tuition details...
                    </p>
                </div>
            </main>
            <Footer />
            </>
        );
    }

    if (error || !tuition) {
        return (
            <>
            <Navbar />
            <main className="flex min-h-[70vh] items-center justify-center bg-slate-50 px-4">
                <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
                    <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
                    <h1 className="mt-4 text-xl font-bold text-slate-900">
                        Tuition Not Found
                    </h1>
                    <p className="mt-2 text-sm text-slate-500">
                        {error || "This tuition may no longer be available."}
                    </p>
                    <Link
                        href="/tuitions"
                        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
                    >
                        <ArrowLeft size={16} />
                        Back to Tuitions
                    </Link>
                </div>
            </main>
            <Footer />
            </>
        );
    }

    return (
        <>
        <Navbar />
        <main className="min-h-screen flex-1 bg-slate-50 pb-16">
            <section className="border-b border-slate-200 bg-white">
                <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
                    <Link
                        href="/tuitions"
                        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-emerald-600"
                    >
                        <ArrowLeft size={17} />
                        Back to All Tuitions
                    </Link>
                </div>
            </section>

            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
                    <div className="space-y-7">
                        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                            {tuition.bannerImage ? (
                                <div className="h-56 overflow-hidden bg-slate-100 sm:h-72">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={tuition.bannerImage}
                                        alt={tuition.title}
                                        className="h-full w-full object-cover"
                                    />
                                </div>
                            ) : (
                                <div className="flex h-56 items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-100 sm:h-72">
                                    <BookOpen className="h-20 w-20 text-emerald-300" />
                                </div>
                            )}

                            <div className="p-6 sm:p-8">
                                <div className="flex flex-wrap items-center gap-2">
                                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                                        {tuition.subject}
                                    </span>
                                    <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
                                        {tuition.mode}
                                    </span>
                                </div>

                                <h1 className="mt-5 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                                    {tuition.title}
                                </h1>

                                <p className="mt-3 flex items-center gap-2 text-sm text-slate-500">
                                    <MapPin size={17} className="text-emerald-600" />
                                    {tuition.location}
                                </p>

                                <ShareButtons
                                    title={tuition.title}
                                    path={`/tuitions/${tuition._id}`}
                                />

                                <div className="my-7 grid grid-cols-2 gap-4 border-y border-slate-100 py-6 sm:grid-cols-3">
                                    <div>
                                        <GraduationCap className="mb-2 h-5 w-5 text-emerald-600" />
                                        <p className="text-xs text-slate-400">Class Level</p>
                                        <p className="mt-1 font-bold text-slate-800">
                                            {tuition.classLevel}
                                        </p>
                                    </div>

                                    <div>
                                        <CalendarDays className="mb-2 h-5 w-5 text-emerald-600" />
                                        <p className="text-xs text-slate-400">Days Per Week</p>
                                        <p className="mt-1 font-bold text-slate-800">
                                            {tuition.daysPerWeek} Days
                                        </p>
                                    </div>

                                    <div>
                                        {tuition.mode === "Online" ? (
                                            <Monitor className="mb-2 h-5 w-5 text-emerald-600" />
                                        ) : (
                                            <MapPin className="mb-2 h-5 w-5 text-emerald-600" />
                                        )}
                                        <p className="text-xs text-slate-400">Tuition Mode</p>
                                        <p className="mt-1 font-bold text-slate-800">
                                            {tuition.mode}
                                        </p>
                                    </div>
                                </div>

                                <h2 className="text-lg font-bold text-slate-900">
                                    About This Tuition
                                </h2>
                                <p className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-600">
                                    {tuition.description}
                                </p>
                            </div>
                        </section>

                        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                            <h2 className="text-lg font-bold text-slate-900">
                                About the Tutor
                            </h2>
                            <div className="mt-5 flex items-center gap-4">
                                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-xl font-extrabold text-emerald-700">
                                    {tuition.tutorName?.charAt(0).toUpperCase() || "T"}
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900">
                                        {tuition.tutorName}
                                    </h3>
                                    <p className="mt-1 text-sm text-slate-500">Tuition Provider</p>
                                </div>
                            </div>
                        </section>
                    </div>

                    <aside>
                        <div className="sticky top-24 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                            <p className="text-sm font-medium text-slate-500">
                                Monthly Tuition Fee
                            </p>

                            <div className="mt-2 flex items-baseline gap-1">
                                <span className="text-3xl font-extrabold text-slate-900">
                                    ${tuition.monthlyFee?.toLocaleString("en-US")}
                                </span>
                                <span className="text-sm text-slate-400">/ month</span>
                            </div>

                            <div className="my-6 space-y-4 border-y border-slate-100 py-6">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="flex items-center gap-2 text-slate-500">
                                        <BookOpen size={16} />
                                        Subject
                                    </span>
                                    <span className="font-semibold text-slate-800">
                                        {tuition.subject}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between text-sm">
                                    <span className="flex items-center gap-2 text-slate-500">
                                        <Clock size={16} />
                                        Weekly Schedule
                                    </span>
                                    <span className="font-semibold text-slate-800">
                                        {tuition.daysPerWeek} days
                                    </span>
                                </div>

                                <div className="flex items-center justify-between text-sm">
                                    <span className="flex items-center gap-2 text-slate-500">
                                        <Wallet size={16} />
                                        Payment
                                    </span>
                                    <span className="font-semibold text-slate-800">
                                        Monthly
                                    </span>
                                </div>
                            </div>

                            <div className="mb-3">
                                <BookmarkButton tuitionId={tuition._id} variant="full" />
                            </div>
                            <ApplyForm tuitionId={tuition._id} />
                        </div>
                    </aside>
                </div>
            </div>
        </main>
        <Footer />
        </>
    );
}
