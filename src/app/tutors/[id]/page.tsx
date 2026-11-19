
import Link from "next/link";
import {
    ArrowLeft,
    BadgeCheck,
    BookOpen,
    CalendarDays,
    Clock,
    GraduationCap,
    MapPin,
    MessageCircle,
    Star,
} from "lucide-react";

const tutors = [
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
        image: "https://i.pravatar.cc/500?img=47",
        verified: true,
        bio: "I am an experienced mathematics tutor passionate about helping students understand complex concepts through simple explanations and practical examples.",
        education: "Bachelor of Science in Mathematics",
        availability: "Saturday - Thursday",
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
        image: "https://i.pravatar.cc/500?img=12",
        verified: true,
        bio: "I help students improve their English grammar, writing, reading and communication skills with structured lessons.",
        education: "Bachelor of Arts in English",
        availability: "Sunday - Thursday",
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
        image: "https://i.pravatar.cc/500?img=44",
        verified: true,
        bio: "My teaching approach focuses on building strong physics fundamentals through real-life examples, problem-solving and regular practice.",
        education: "Master of Science in Physics",
        availability: "Saturday - Thursday",
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
        image: "https://i.pravatar.cc/500?img=13",
        verified: false,
        bio: "I make chemistry easier to understand with step-by-step explanations, concept building and exam preparation.",
        education: "Bachelor of Science in Chemistry",
        availability: "Sunday - Thursday",
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
        image: "https://i.pravatar.cc/500?img=49",
        verified: true,
        bio: "I support students in mastering biology through clear explanations, diagrams, revision and exam-focused preparation.",
        education: "Master of Science in Biology",
        availability: "Saturday - Thursday",
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
        image: "https://i.pravatar.cc/500?img=60",
        verified: true,
        bio: "I teach ICT and computer fundamentals with practical examples to help students build confidence in technology.",
        education: "Bachelor of Science in Computer Science",
        availability: "Saturday - Thursday",
    },
];

type PageProps = {
    params: Promise<{ id: string }>;
};

export default async function TutorProfilePage({ params }: PageProps) {
    const { id } = await params;

    const tutor = tutors.find((item) => item.id === Number(id));

    if (!tutor) {
        return (
            <main className="flex min-h-[70vh] flex-col items-center justify-center bg-[#f8faf9] px-4 text-center">
                <h1 className="text-3xl font-bold text-slate-900">
                    Tutor Not Found
                </h1>
                <p className="mt-3 text-slate-500">
                    This tutor profile may not exist.
                </p>
                <Link
                    href="/tutors"
                    className="mt-6 rounded-xl bg-emerald-600 px-6 py-3 font-semibold text-white hover:bg-emerald-700"
                >
                    Back to Tutors
                </Link>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#f8faf9]">
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
                        {/* Profile Header */}
                        <section className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8">
                            <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
                                <img
                                    src={tutor.image}
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
                                            {tutor.experience} Experience
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

                        {/* About */}
                        <section className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8">
                            <h2 className="text-xl font-bold text-slate-900">
                                About Me
                            </h2>

                            <p className="mt-4 leading-8 text-slate-600">
                                {tutor.bio}
                            </p>
                        </section>

                        {/* Education and Experience */}
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
                                            {tutor.education}
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
                                            {tutor.experience} of teaching experience
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
                                            {tutor.availability}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Booking Card */}
                    <aside>
                        <div className="sticky top-24 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                            <p className="text-sm text-slate-500">
                                Tutor's hourly rate
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
                                href={`/bookings?tutorId=${tutor.id}`}
                                className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-4 text-sm font-bold text-white transition hover:bg-emerald-700"
                            >
                                <CalendarDays size={18} />
                                Book This Tutor
                            </Link>

                            <button
                                type="button"
                                className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 py-4 text-sm font-semibold text-slate-700 transition hover:border-emerald-300 hover:text-emerald-700"
                            >
                                <MessageCircle size={18} />
                                Contact Tutor
                            </button>

                            <p className="mt-4 text-center text-xs leading-5 text-slate-400">
                                Booking and contact features will be connected to the backend.
                            </p>
                        </div>
                    </aside>
                </div>
            </div>
        </main>
    );
}
