
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Footer from "@/components/shared/Footer";
import Navbar from "@/components/shared/Navbar";
import { apiFetch } from "@/lib/api";
import {
    Search,
    MapPin,
    BookOpen,
    GraduationCap,
    SlidersHorizontal,
    X,
    ArrowRight,
    RefreshCw,
    CalendarDays,
} from "lucide-react";

type Tuition = {
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
    approvalStatus: string;
    isActive: boolean;
    createdAt: string;
};

type TuitionResponse = {
    success: boolean;
    total: number;
    page?: number;
    limit?: number;
    totalPages?: number;
    tuitions: Tuition[];
};

const subjects = [
    "All Subjects",
    "Mathematics",
    "English",
    "Physics",
    "Chemistry",
    "Biology",
    "ICT",
];

const classLevels = [
    "All Classes",
    "Class 1",
    "Class 2",
    "Class 3",
    "Class 4",
    "Class 5",
    "Class 6",
    "Class 7",
    "Class 8",
    "Class 9",
    "Class 10",
    "SSC",
    "HSC",
    "University",
    "Adult",
];

export default function TuitionsPage() {
    const router = useRouter();

    const [tuitions, setTuitions] = useState<Tuition[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");
    const [subject, setSubject] = useState("All Subjects");
    const [classLevel, setClassLevel] = useState("All Classes");
    const [mode, setMode] = useState("All Modes");
    const [location, setLocation] = useState("");
    const [minFee, setMinFee] = useState("");
    const [maxFee, setMaxFee] = useState("");
    const [sort, setSort] = useState("newest");
    const [showFilters, setShowFilters] = useState(false);
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState({ total: 0, totalPages: 1 });

    // Read filters pushed by the home page once, on mount. Deferred so the
    // server-rendered markup and first client render stay identical.
    useEffect(() => {
        Promise.resolve().then(() => {
            const urlParams = new URLSearchParams(window.location.search);

            const initialSearch = urlParams.get("search");
            const initialLocation = urlParams.get("location");
            const initialSubject = urlParams.get("subject");
            const initialMode = urlParams.get("mode");

            if (initialSearch) setSearch(initialSearch);
            if (initialLocation) setLocation(initialLocation);
            if (initialSubject) setSubject(initialSubject);
            if (initialMode === "Online" || initialMode === "Offline") setMode(initialMode);
        });
    }, []);

    useEffect(() => {
        const controller = new AbortController();

        const fetchTuitions = async () => {
            try {
                setLoading(true);
                setError("");

                const params = new URLSearchParams();

                if (search.trim()) params.set("search", search.trim());
                if (subject !== "All Subjects") params.set("subject", subject);
                if (classLevel !== "All Classes") {
                    params.set("classLevel", classLevel);
                }
                if (mode !== "All Modes") params.set("mode", mode);
                if (location.trim()) params.set("location", location.trim());
                if (minFee !== "") params.set("minFee", minFee);
                if (maxFee !== "") params.set("maxFee", maxFee);
                params.set("page", String(page));
                params.set("limit", "9");

                const data = await apiFetch<TuitionResponse>(
                    `/tuitions?${params.toString()}`,
                    { signal: controller.signal }
                );

                setTuitions(data.tuitions || []);
                setPagination({
                    total: data.total,
                    totalPages: data.totalPages || 1,
                });
            } catch (err) {
                // StrictMode aborts the first request on mount. Chromium can
                // surface that either as AbortError or as a plain
                // "Failed to fetch" TypeError, so trust the signal itself.
                if (
                    controller.signal.aborted ||
                    (err as { name?: string })?.name === "AbortError"
                ) return;

                setError(
                    err instanceof Error
                        ? err.message
                        : "Something went wrong. Please try again."
                );
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        };

        fetchTuitions();

        return () => controller.abort();
    }, [search, subject, classLevel, mode, location, minFee, maxFee, page]);

    // Reset to the first page when filters change. Adjusting state during
    // render keeps the fetch effect from running once with a stale page.
    const filterKey = [search, subject, classLevel, mode, location, minFee, maxFee].join("|");
    const [appliedFilterKey, setAppliedFilterKey] = useState(filterKey);
    if (filterKey !== appliedFilterKey) {
        setAppliedFilterKey(filterKey);
        setPage(1);
    }

    const sortedTuitions = useMemo(() => {
        const result = [...tuitions];

        if (sort === "fee-low") {
            result.sort((a, b) => a.monthlyFee - b.monthlyFee);
        } else if (sort === "fee-high") {
            result.sort((a, b) => b.monthlyFee - a.monthlyFee);
        } else {
            result.sort(
                (a, b) =>
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime()
            );
        }

        return result;
    }, [tuitions, sort]);

    const clearFilters = () => {
        setSearch("");
        setSubject("All Subjects");
        setClassLevel("All Classes");
        setMode("All Modes");
        setLocation("");
        setMinFee("");
        setMaxFee("");
        setSort("newest");
        router.replace("/tuitions");
    };

    const hasFilters =
        search.trim() !== "" ||
        subject !== "All Subjects" ||
        classLevel !== "All Classes" ||
        mode !== "All Modes" ||
        location.trim() !== "" ||
        minFee !== "" ||
        maxFee !== "";

    return (
        <div className="flex min-h-screen flex-col bg-[#f8faf9] text-slate-900">
            <Navbar />
            <main className="flex-1">
            {/* Hero */}
            <section className="border-b border-slate-200 bg-white">
                <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
                    <div className="max-w-3xl">
                        <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
                            <GraduationCap size={18} />
                            Find your perfect tuition
                        </div>

                        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                            Find the right{" "}
                            <span className="text-emerald-600">Tuition</span> for you
                        </h1>

                        <p className="mt-4 max-w-2xl text-base leading-7 text-slate-500 sm:text-lg">
                            Explore approved tuition opportunities, connect with tutors,
                            and find the right learning support for your academic goals.
                        </p>
                    </div>

                    {/* Search */}
                    <div role="search" aria-label="Search tuitions" className="mt-9 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-lg shadow-slate-200/40 sm:flex-row">
                        <div className="flex flex-1 items-center gap-3 px-3">
                            <Search size={21} className="shrink-0 text-slate-400" />

                            <label htmlFor="tuition-search" className="sr-only">
                                Search tuitions
                            </label>
                            <input
                                id="tuition-search"
                                type="search"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search by title, subject, class or location..."
                                className="h-12 w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
                            />

                            {search && (
                                <button
                                    type="button"
                                    onClick={() => setSearch("")}
                                    aria-label="Clear search"
                                    className="text-slate-400 hover:text-slate-700"
                                >
                                    <X size={18} />
                                </button>
                            )}
                        </div>

                        <button
                            type="button"
                            onClick={() => setShowFilters(!showFilters)}
                            aria-expanded={showFilters}
                            aria-controls="tuition-filters"
                            className="flex h-12 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 text-sm font-semibold text-white transition hover:bg-emerald-700"
                        >
                            <SlidersHorizontal size={18} />
                            {showFilters ? "Hide Filters" : "Filters"}
                        </button>
                    </div>

                    {/* Filters */}
                    {showFilters && (
                        <div id="tuition-filters" className="mt-4 grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 sm:grid-cols-2 lg:grid-cols-3">
                            <div>
                                <label htmlFor="tuition-subject" className="mb-2 block text-sm font-semibold">
                                    Subject
                                </label>
                                <select
                                    id="tuition-subject"
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                    className="h-12 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-emerald-500"
                                >
                                    {subjects.map((item) => (
                                        <option key={item} value={item}>
                                            {item}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label htmlFor="tuition-class-level" className="mb-2 block text-sm font-semibold">
                                    Class Level
                                </label>
                                <select
                                    id="tuition-class-level"
                                    value={classLevel}
                                    onChange={(e) => setClassLevel(e.target.value)}
                                    className="h-12 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-emerald-500"
                                >
                                    {classLevels.map((item) => (
                                        <option key={item} value={item}>
                                            {item}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label htmlFor="tuition-mode" className="mb-2 block text-sm font-semibold">
                                    Teaching Mode
                                </label>
                                <select
                                    id="tuition-mode"
                                    value={mode}
                                    onChange={(e) => setMode(e.target.value)}
                                    className="h-12 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-emerald-500"
                                >
                                    <option value="All Modes">All Modes</option>
                                    <option value="Online">Online</option>
                                    <option value="Offline">Offline</option>
                                </select>
                            </div>

                            <div>
                                <label htmlFor="tuition-location" className="mb-2 block text-sm font-semibold">
                                    Location
                                </label>
                                <input
                                    id="tuition-location"
                                    type="text"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    placeholder="e.g. Sylhet"
                                    className="h-12 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-emerald-500"
                                />
                            </div>

                            <div>
                                <label htmlFor="tuition-min-fee" className="mb-2 block text-sm font-semibold">
                                    Minimum Monthly Fee (৳)
                                </label>
                                <input
                                    id="tuition-min-fee"
                                    type="number"
                                    min="0"
                                    value={minFee}
                                    onChange={(e) => setMinFee(e.target.value)}
                                    placeholder="Minimum fee"
                                    className="h-12 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-emerald-500"
                                />
                            </div>

                            <div>
                                <label htmlFor="tuition-max-fee" className="mb-2 block text-sm font-semibold">
                                    Maximum Monthly Fee (৳)
                                </label>
                                <input
                                    id="tuition-max-fee"
                                    type="number"
                                    min="0"
                                    value={maxFee}
                                    onChange={(e) => setMaxFee(e.target.value)}
                                    placeholder="Maximum fee"
                                    className="h-12 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-emerald-500"
                                />
                            </div>

                            <div className="flex items-end sm:col-span-2 lg:col-span-3">
                                <button
                                    type="button"
                                    onClick={clearFilters}
                                    className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                                >
                                    Clear All Filters
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* Tuition Listings */}
            <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h2 className="text-2xl font-bold">Available Tuitions</h2>
                        <p role="status" aria-live="polite" aria-atomic="true" className="mt-2 text-sm text-slate-500">
                            {loading
                                ? "Finding tuition opportunities..."
                                : `Showing ${sortedTuitions.length} approved tuition posts`}
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <label
                            htmlFor="sort-tuitions"
                            className="whitespace-nowrap text-sm text-slate-500"
                        >
                            Sort by:
                        </label>

                        <select
                            id="sort-tuitions"
                            value={sort}
                            onChange={(e) => setSort(e.target.value)}
                            className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium outline-none focus:border-emerald-500"
                        >
                            <option value="newest">Newest First</option>
                            <option value="fee-low">Fee: Low to High</option>
                            <option value="fee-high">Fee: High to Low</option>
                        </select>
                    </div>
                </div>

                {hasFilters && (
                    <div className="mb-6 flex flex-wrap items-center gap-3">
                        <span className="text-sm text-slate-500">Filters applied</span>
                        <button
                            type="button"
                            onClick={clearFilters}
                            className="text-sm font-semibold text-rose-600 hover:underline"
                        >
                            Clear all
                        </button>
                    </div>
                )}

                {/* Loading */}
                {loading && (
                    <div className="flex flex-col items-center justify-center py-24">
                        <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-100 border-t-emerald-600" />
                        <p className="mt-4 text-sm font-medium text-slate-500">
                            Loading tuition posts...
                        </p>
                    </div>
                )}

                {/* Error */}
                {!loading && error && (
                    <div role="alert" className="rounded-2xl border border-rose-200 bg-rose-50 px-6 py-12 text-center">
                        <h3 className="text-lg font-bold text-rose-700">
                            Unable to load tuitions
                        </h3>
                        <p className="mt-2 text-sm text-rose-600">{error}</p>
                        <button
                            type="button"
                            onClick={() => window.location.reload()}
                            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-700"
                        >
                            <RefreshCw size={16} />
                            Try Again
                        </button>
                    </div>
                )}

                {/* Tuition Cards */}
                {!loading && !error && sortedTuitions.length > 0 && (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {sortedTuitions.map((tuition) => (
                            <article
                                key={tuition._id}
                                className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-xl hover:shadow-emerald-900/5"
                            >
                                {tuition.bannerImage ? (
                                    <img
                                        src={tuition.bannerImage}
                                        alt={tuition.title}
                                        className="h-44 w-full object-cover"
                                    />
                                ) : (
                                    <div className="flex h-44 items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-100">
                                        <GraduationCap
                                            size={58}
                                            className="text-emerald-600"
                                        />
                                    </div>
                                )}

                                <div className="p-6">
                                    <div className="mb-4 flex flex-wrap items-center gap-2">
                                        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                                            {tuition.subject}
                                        </span>
                                        <span
                                            className={`rounded-full px-3 py-1 text-xs font-semibold ${tuition.mode === "Online"
                                                ? "bg-blue-50 text-blue-700"
                                                : "bg-amber-50 text-amber-700"
                                                }`}
                                        >
                                            {tuition.mode}
                                        </span>
                                    </div>

                                    <h3 className="line-clamp-2 text-lg font-bold text-slate-900 transition group-hover:text-emerald-700">
                                        {tuition.title}
                                    </h3>

                                    <div className="mt-5 space-y-3 border-t border-slate-100 pt-5">
                                        <div className="flex items-center gap-3 text-sm text-slate-600">
                                            <GraduationCap size={17} className="text-slate-400" />
                                            <span>{tuition.classLevel}</span>
                                        </div>

                                        <div className="flex items-center gap-3 text-sm text-slate-600">
                                            <MapPin size={17} className="text-slate-400" />
                                            <span>{tuition.location}</span>
                                        </div>

                                        <div className="flex items-center gap-3 text-sm text-slate-600">
                                            <CalendarDays size={17} className="text-slate-400" />
                                            <span>{tuition.daysPerWeek} days per week</span>
                                        </div>

                                        <div className="flex items-center gap-3 text-sm text-slate-600">
                                            <BookOpen size={17} className="text-slate-400" />
                                            <span>Tutor: {tuition.tutorName}</span>
                                        </div>
                                    </div>

                                    <div className="mt-6 flex items-center justify-between gap-3 border-t border-slate-100 pt-5">
                                        <div>
                                            <p className="text-xs text-slate-400">
                                                Monthly Fee
                                            </p>
                                            <p className="mt-1 text-xl font-bold text-slate-900">
                                                ৳{Number(tuition.monthlyFee).toLocaleString("en-BD")}
                                            </p>
                                        </div>

                                        <Link
                                            href={`/tuitions/${tuition._id}`}
                                            className="inline-flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-600 hover:text-white"
                                        >
                                            View Details
                                            <ArrowRight size={16} />
                                        </Link>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                )}

                {/* Empty State */}
                {!loading && !error && sortedTuitions.length === 0 && (
                    <div aria-live="polite" className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50">
                            <BookOpen size={32} className="text-emerald-600" />
                        </div>

                        <h3 className="mt-5 text-lg font-bold">
                            {hasFilters ? "No matching tuitions found" : "No tuitions available yet"}
                        </h3>

                        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                            {hasFilters
                                ? "Try changing your search or filters to find more tuition opportunities."
                                : "Approved tuition posts will appear here when they become available."}
                        </p>

                        {hasFilters && (
                            <button
                                type="button"
                                onClick={clearFilters}
                                className="mt-5 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-700"
                            >
                                Clear Filters
                            </button>
                        )}
                    </div>
                )}

                {/* Server-side pagination */}
                {!loading && pagination.total > 9 && (
                    <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
                        <button
                            type="button"
                            disabled={page <= 1}
                            onClick={() => setPage((value) => Math.max(1, value - 1))}
                            className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition disabled:opacity-40 hover:border-emerald-500 hover:text-emerald-700"
                        >
                            Previous
                        </button>
                        <span className="text-sm font-semibold text-slate-600">
                            Page {page} of {pagination.totalPages}
                            <span className="ml-2 font-normal text-slate-400">
                                ({pagination.total} results)
                            </span>
                        </span>
                        <button
                            type="button"
                            disabled={page >= pagination.totalPages}
                            onClick={() => setPage((value) => Math.min(pagination.totalPages, value + 1))}
                            className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition disabled:opacity-40 hover:border-emerald-500 hover:text-emerald-700"
                        >
                            Next
                        </button>
                    </div>
                )}
            </section>
            </main>
            <Footer />
        </div>
    );
}
