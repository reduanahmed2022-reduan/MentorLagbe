"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Footer from "@/components/shared/Footer";
import Navbar from "@/components/shared/Navbar";
import { apiFetch } from "@/lib/api";
import {
    ArrowLeft,
    BadgeCheck,
    BookOpen,
    CalendarDays,
    Clock,
    GraduationCap,
    MapPin,
    Search,
    Star,
} from "lucide-react";

type Tutor = {
    id: string;
    name: string;
    subject: string;
    qualification: string;
    location: string;
    experience: number | string;
    rating: number;
    reviews: number;
    hourlyRate: number;
    mode: string;
    image: string;
    verified: boolean;
    bio: string;
    education?: string | {
        degree?: string;
        institution?: string;
    }[];
    availability?: string;
};

export default function TutorProfilePage() {
    const params = useParams();
    const id = params.id as string;

    const [tutor, setTutor] = useState<Tutor | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!id) return;

        const fetchTutor = async () => {
            try {
                setLoading(true);
                setError("");

                const data = await apiFetch<{ tutor: Tutor }>(`/tutors/${id}`);

                setTutor(data.tutor);
            } catch (err) {
                setError(
                    err instanceof Error
                        ? err.message
                        : "Something went wrong"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchTutor();
    }, [id]);

    if (loading) {
        return (
            <>
            <Navbar />
            <main className="flex min-h-[70vh] items-center justify-center bg-[#f8faf9]">
                <div className="text-center">
                    <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-emerald-100 border-t-emerald-600" />
                    <p className="mt-4 font-medium text-slate-600">
                        Loading tutor profile...
                    </p>
                </div>
            </main>
            <Footer />
            </>
        );
    }

    if (error || !tutor) {
        return (
            <>
            <Navbar />
            <main className="flex min-h-[70vh] flex-col items-center justify-center bg-[#f8faf9] px-4 text-center">
                <h1 className="text-3xl font-bold text-slate-900">
                    Tutor Not Found
                </h1>
                <p className="mt-3 text-slate-500">
                    {error || "This tutor profile may not exist."}
                </p>
                <Link
                    href="/tutors"
                    className="mt-6 rounded-xl bg-emerald-600 px-6 py-3 font-semibold text-white hover:bg-emerald-700"
                >
                    Back to Tutors
                </Link>
            </main>
            <Footer />
            </>
        );
    }

    const educationText = Array.isArray(tutor.education)
        ? tutor.education
            .map((item) =>
                [item.degree, item.institution].filter(Boolean).join(" - ")
            )
            .filter(Boolean)
            .join(", ")
        : tutor.education || tutor.qualification;

    const experienceText =
        typeof tutor.experience === "number"
            ? `${tutor.experience} Years`
            : tutor.experience;

    const portraitUrl =
        tutor.image?.trim() ||
        "https://randomuser.me/api/portraits/men/32.jpg";

    return (
        <>
        <Navbar />
        <main className="min-h-screen flex-1 bg-[#f8faf9]">
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <Link
                    href="/tutors"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-emerald-600"
                >
                    <ArrowLeft size={18} />
                    Back to All Tutors
                </Link>

                <div className="mt-7 grid gap-8 lg:grid-cols-[1fr_350px]">
                    <div className="space-y-8">
                        <section className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8">
                            <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
                                <img
                                    src={portraitUrl}
                                    alt={tutor.name}
                                    className="h-28 w-28 rounded-3xl object-cover"
                                />

                                <div className="flex-1">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                                            {tutor.name}
                                        </h1>

                                        {tutor.verified && (
                                            <BadgeCheck
                                                size={21}
                                                className="text-emerald-600"
                                                role="img"
                                                aria-label="Verified tutor"
                                            />
                                        )}
                                    </div>

                                    <p className="mt-2 font-medium text-emerald-700">
                                        {tutor.subject} Tutor
                                    </p>

                                    <div className="mt-4 flex flex-wrap gap-x-5 gap-y-3 text-sm text-slate-500">
                                        <span className="flex items-center gap-1.5">
                                            <MapPin size={16} />
                                            {tutor.location}
                                        </span>

                                        <span className="flex items-center gap-1.5">
                                            <Clock size={16} />
                                            {experienceText} Experience
                                        </span>

                                        <span className="flex items-center gap-1.5">
                                            <Star
                                                size={16}
                                                className="fill-amber-400 text-amber-400"
                                            />
                                            {tutor.rating} ({tutor.reviews} reviews)
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8">
                            <h2 className="text-xl font-bold text-slate-900">
                                About Me
                            </h2>

                            <p className="mt-4 leading-8 text-slate-600">
                                {tutor.bio || "No biography available yet."}
                            </p>
                        </section>

                        <section className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8">
                            <h2 className="text-xl font-bold text-slate-900">
                                Education & Experience
                            </h2>

                            <div className="mt-6 space-y-6">
                                <div className="flex gap-4">
                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                                        <GraduationCap size={22} />
                                    </div>

                                    <div>
                                        <h3 className="font-semibold text-slate-900">
                                            Education
                                        </h3>
                                        <p className="mt-1 text-sm text-slate-500">
                                            {educationText}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                                        <BookOpen size={22} />
                                    </div>

                                    <div>
                                        <h3 className="font-semibold text-slate-900">
                                            Teaching Experience
                                        </h3>
                                        <p className="mt-1 text-sm text-slate-500">
                                            {experienceText} of teaching experience
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                                        <CalendarDays size={22} />
                                    </div>

                                    <div>
                                        <h3 className="font-semibold text-slate-900">
                                            Availability
                                        </h3>
                                        <p className="mt-1 text-sm text-slate-500">
                                            {tutor.availability || "Contact tutor for availability"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>

                    <aside>
                        <div className="sticky top-24 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                            <p className="text-sm text-slate-500">
                                Tutor&apos;s hourly rate
                            </p>

                            <p className="mt-2 text-3xl font-bold text-slate-900">
                                ৳{tutor.hourlyRate}
                                <span className="text-sm font-normal text-slate-500">
                                    / hour
                                </span>
                            </p>

                            <div className="my-6 space-y-4 border-y border-slate-100 py-5">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-slate-500">Subject</span>
                                    <span className="font-semibold text-slate-800">
                                        {tutor.subject}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-slate-500">Teaching Mode</span>
                                    <span className="font-semibold text-slate-800">
                                        {tutor.mode}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-slate-500">Location</span>
                                    <span className="font-semibold text-slate-800">
                                        {tutor.location}
                                    </span>
                                </div>
                            </div>

                            <Link
                                href="/tuitions"
                                className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-4 text-sm font-bold text-white transition hover:bg-emerald-700"
                            >
                                <CalendarDays size={18} />
                                Find a Tuition Batch
                            </Link>

                            <Link
                                href={`/tuitions?search=${encodeURIComponent(tutor.subject)}`}
                                className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 py-4 text-sm font-semibold text-slate-700 transition hover:border-emerald-300 hover:text-emerald-700"
                            >
                                <Search size={18} />
                                Find {tutor.subject} Tuitions
                            </Link>

                            <p className="mt-4 text-center text-xs leading-5 text-slate-400">
                                Browse approved batches and apply with your student account.
                            </p>
                        </div>
                    </aside>
                </div>
            </div>
        </main>
        <Footer />
        </>
    );
}
