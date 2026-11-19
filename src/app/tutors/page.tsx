
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
    Search,
    MapPin,
    Star,
    SlidersHorizontal,
    GraduationCap,
    BookOpen,
    Clock,
    ArrowRight,
    X,
    Users,
    BadgeCheck,
} from "lucide-react";

type Tutor = {
    id: number;
    name: string;
    subject: string;
    qualification: string;
    location: string;
    experience: string;
    rating: number;
    reviews: number;
    hourlyRate: number;
    mode: string;
    image: string;
    verified: boolean;
};

const tutors: Tutor[] = [
    {
        id: 1,
        name: "Sarah Ahmed",
        subject: "Mathematics",
        qualification: "BSc in Mathematics",
        location: "Sylhet",
        experience: "5 Years",
        rating: 4.9,
        reviews: 120,
        hourlyRate: 500,
        mode: "Online & Offline",
        image: "https://i.pravatar.cc/300?img=47",
        verified: true,
    },
    {
        id: 2,
        name: "Rahim Hasan",
        subject: "English",
        qualification: "BA in English",
        location: "Dhaka",
        experience: "4 Years",
        rating: 4.8,
        reviews: 95,
        hourlyRate: 400,
        mode: "Online",
        image: "https://i.pravatar.cc/300?img=12",
        verified: true,
    },
    {
        id: 3,
        name: "Nusrat Jahan",
        subject: "Physics",
        qualification: "MSc in Physics",
        location: "Chattogram",
        experience: "6 Years",
        rating: 5.0,
        reviews: 86,
        hourlyRate: 600,
        mode: "Online & Offline",
        image: "https://i.pravatar.cc/300?img=44",
        verified: true,
    },
    {
        id: 4,
        name: "Tanvir Ahmed",
        subject: "Chemistry",
        qualification: "BSc in Chemistry",
        location: "Sylhet",
        experience: "3 Years",
        rating: 4.7,
        reviews: 65,
        hourlyRate: 350,
        mode: "Offline",
        image: "https://i.pravatar.cc/300?img=13",
        verified: false,
    },
    {
        id: 5,
        name: "Ayesha Rahman",
        subject: "Biology",
        qualification: "MSc in Biology",
        location: "Dhaka",
        experience: "7 Years",
        rating: 4.9,
        reviews: 150,
        hourlyRate: 700,
        mode: "Online",
        image: "https://i.pravatar.cc/300?img=49",
        verified: true,
    },
    {
        id: 6,
        name: "Sabbir Hossain",
        subject: "ICT",
        qualification: "BSc in CSE",
        location: "Rajshahi",
        experience: "4 Years",
        rating: 4.8,
        reviews: 72,
        hourlyRate: 450,
        mode: "Online & Offline",
        image: "https://i.pravatar.cc/300?img=60",
        verified: true,
    },
];

const subjects = [
    "All Subjects",
    "Mathematics",
    "English",
    "Physics",
    "Chemistry",
    "Biology",
    "ICT",
];

const locations = [
    "All Locations",
    "Dhaka",
    "Sylhet",
    "Chattogram",
    "Rajshahi",
];

const modes = ["All Modes", "Online", "Offline"];

export default function TutorsPage() {
    const [search, setSearch] = useState("");
    const [subject, setSubject] = useState("All Subjects");
    const [location, setLocation] = useState("All Locations");
    const [mode, setMode] = useState("All Modes");
    const [sort, setSort] = useState("recommended");
    const [showFilters, setShowFilters] = useState(false);

    const filteredTutors = useMemo(() => {
        let result = tutors.filter((tutor) => {
            const searchMatch =
                tutor.name.toLowerCase().includes(search.toLowerCase()) ||
                tutor.subject.toLowerCase().includes(search.toLowerCase()) ||
                tutor.qualification.toLowerCase().includes(search.toLowerCase());

            const subjectMatch =
                subject === "All Subjects" || tutor.subject === subject;

            const locationMatch =
                location === "All Locations" || tutor.location === location;

            const modeMatch =
                mode === "All Modes" || tutor.mode.includes(mode);

            return searchMatch && subjectMatch && locationMatch && modeMatch;
        });

        if (sort === "rating") {
            result = [...result].sort((a, b) => b.rating - a.rating);
        } else if (sort === "price-low") {
            result = [...result].sort(
                (a, b) => a.hourlyRate - b.hourlyRate
            );
        } else if (sort === "price-high") {
            result = [...result].sort(
                (a, b) => b.hourlyRate - a.hourlyRate
            );
        }

        return result;
    }, [search, subject, location, mode, sort]);

    const clearFilters = () => {
        setSearch("");
        setSubject("All Subjects");
        setLocation("All Locations");
        setMode("All Modes");
        setSort("recommended");
    };

    return (
        <main className="min-h-screen bg-[#f8faf9] text-slate-900">
            {/* Hero */}
            <section className="border-b border-slate-200 bg-white">
                <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
                    <div className="max-w-3xl">
                        <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
                            <GraduationCap size={17} />
                            Find your perfect learning partner
                        </div>

                        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                            Discover the right{" "}
                            <span className="text-emerald-600">Tutor</span> for you
                        </h1>

                        <p className="mt-4 max-w-2xl text-base leading-7 text-slate-500 sm:text-lg">
                            Connect with experienced and verified tutors. Find the
                            right teacher to achieve your academic goals.
                        </p>
                    </div>

                    <div className="mt-9 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-lg shadow-slate-200/40 sm:flex-row">
                        <div className="flex flex-1 items-center gap-3 px-3">
                            <Search className="shrink-0 text-slate-400" size={21} />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search tutor, subject or qualification..."
                                className="h-12 w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
                            />
                            {search && (
                                <button
                                    onClick={() => setSearch("")}
                                    aria-label="Clear search"
                                    className="text-slate-400 hover:text-slate-700"
                                >
                                    <X size={18} />
                                </button>
                            )}
                        </div>

                        <div className="flex items-center gap-2 border-t border-slate-100 px-3 sm:border-l sm:border-t-0">
                            <MapPin size={19} className="text-emerald-600" />
                            <select
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                className="h-12 w-full min-w-0 bg-transparent text-sm font-medium outline-none sm:w-40"
                            >
                                {locations.map((item) => (
                                    <option key={item}>{item}</option>
                                ))}
                            </select>
                        </div>

                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="flex h-12 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 text-sm font-semibold text-white transition hover:bg-emerald-700"
                        >
                            <SlidersHorizontal size={18} />
                            Filters
                        </button>
                    </div>

                    {showFilters && (
                        <div className="mt-4 grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 sm:grid-cols-2">
                            <div>
                                <label className="mb-2 block text-sm font-semibold">
                                    Subject
                                </label>
                                <select
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                    className="h-12 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-emerald-500"
                                >
                                    {subjects.map((item) => (
                                        <option key={item}>{item}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-semibold">
                                    Teaching Mode
                                </label>
                                <select
                                    value={mode}
                                    onChange={(e) => setMode(e.target.value)}
                                    className="h-12 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-emerald-500"
                                >
                                    {modes.map((item) => (
                                        <option key={item}>{item}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* Tutors */}
            <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h2 className="text-2xl font-bold">Available Tutors</h2>
                        <p className="mt-2 text-sm text-slate-500">
                            Showing {filteredTutors.length} tutors for your learning journey
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <span className="whitespace-nowrap text-sm text-slate-500">
                            Sort by:
                        </span>
                        <select
                            value={sort}
                            onChange={(e) => setSort(e.target.value)}
                            className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium outline-none focus:border-emerald-500"
                        >
                            <option value="recommended">Recommended</option>
                            <option value="rating">Highest Rating</option>
                            <option value="price-low">Price: Low to High</option>
                            <option value="price-high">Price: High to Low</option>
                        </select>
                    </div>
                </div>

                {(search ||
                    subject !== "All Subjects" ||
                    location !== "All Locations" ||
                    mode !== "All Modes") && (
                        <div className="mb-6 flex flex-wrap items-center gap-2">
                            <span className="text-sm text-slate-500">Active filters:</span>
                            {subject !== "All Subjects" && (
                                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                                    {subject}
                                </span>
                            )}
                            {location !== "All Locations" && (
                                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                                    {location}
                                </span>
                            )}
                            {mode !== "All Modes" && (
                                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                                    {mode}
                                </span>
                            )}
                            <button
                                onClick={clearFilters}
                                className="text-xs font-semibold text-rose-600 hover:underline"
                            >
                                Clear all
                            </button>
                        </div>
                    )}

                {filteredTutors.length > 0 ? (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {filteredTutors.map((tutor) => (
                            <article
                                key={tutor.id}
                                className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-xl hover:shadow-emerald-900/5"
                            >
                                <div className="p-6">
                                    <div className="flex items-start gap-4">
                                        <img
                                            src={tutor.image}
                                            alt={tutor.name}
                                            className="h-16 w-16 rounded-2xl object-cover"
                                        />

                                        <div className="min-w-0 flex-1">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <h3 className="font-bold text-slate-900">
                                                    {tutor.name}
                                                </h3>
                                                {tutor.verified && (
                                                    <BadgeCheck
                                                        size={17}
                                                        className="text-emerald-600"
                                                    />
                                                )}
                                            </div>

                                            <p className="mt-1 text-sm text-emerald-700">
                                                {tutor.subject} Tutor
                                            </p>

                                            <div className="mt-2 flex items-center gap-1 text-xs text-slate-500">
                                                <Star
                                                    size={14}
                                                    className="fill-amber-400 text-amber-400"
                                                />
                                                <span className="font-semibold text-slate-800">
                                                    {tutor.rating}
                                                </span>
                                                ({tutor.reviews} reviews)
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-6 space-y-3 border-t border-slate-100 pt-5">
                                        <div className="flex items-center gap-3 text-sm text-slate-600">
                                            <GraduationCap size={17} className="text-slate-400" />
                                            <span>{tutor.qualification}</span>
                                        </div>

                                        <div className="flex items-center gap-3 text-sm text-slate-600">
                                            <MapPin size={17} className="text-slate-400" />
                                            <span>{tutor.location}</span>
                                        </div>

                                        <div className="flex items-center gap-3 text-sm text-slate-600">
                                            <Clock size={17} className="text-slate-400" />
                                            <span>{tutor.experience} Experience</span>
                                        </div>

                                        <div className="flex items-center gap-3 text-sm text-slate-600">
                                            <BookOpen size={17} className="text-slate-400" />
                                            <span>{tutor.mode}</span>
                                        </div>
                                    </div>

                                    <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-5">
                                        <div>
                                            <p className="text-xs text-slate-400">Starting from</p>
                                            <p className="mt-1 text-xl font-bold text-slate-900">
                                                ৳{tutor.hourlyRate}
                                                <span className="text-xs font-normal text-slate-500">
                                                    /hour
                                                </span>
                                            </p>
                                        </div>

                                        <Link
                                            href={`/tutors/${tutor.id}`}
                                            className="inline-flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-600 hover:text-white"
                                        >
                                            View Profile
                                            <ArrowRight size={16} />
                                        </Link>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                ) : (
                    <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
                        <Users size={42} className="mx-auto text-slate-300" />
                        <h3 className="mt-4 text-lg font-bold">No tutors found</h3>
                        <p className="mt-2 text-sm text-slate-500">
                            Try changing your search or filters to find tutors.
                        </p>
                        <button
                            onClick={clearFilters}
                            className="mt-5 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-700"
                        >
                            Clear Filters
                        </button>
                    </div>
                )}
            </section>
        </main>
    );
}
