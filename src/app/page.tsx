

"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import FeaturedTutors from "@/components/home/FeaturedTutors";
import FeaturedTuitions from "@/components/home/FeaturedTuitions";
import Highlights from "@/components/home/Highlights";
import PricingPreview from "@/components/home/PricingPreview";
import Footer from "@/components/shared/Footer";
import Navbar from "@/components/shared/Navbar";
import { apiFetch } from "@/lib/api";
import type { Tutor } from "@/lib/types";

// Only subjects that actually have tutor/tuition listing pages.
const categories = [
  { name: "Mathematics", icon: "🧮", bg: "bg-blue-600", subject: "Mathematics" },
  { name: "Physics", icon: "⚛️", bg: "bg-indigo-600", subject: "Physics" },
  { name: "Chemistry", icon: "🧪", bg: "bg-emerald-600", subject: "Chemistry" },
  { name: "Biology", icon: "🧬", bg: "bg-green-600", subject: "Biology" },
  { name: "English", icon: "🌐", bg: "bg-amber-600", subject: "English" },
  { name: "ICT", icon: "💻", bg: "bg-orange-500", subject: "ICT" },
  { name: "Others", icon: "📚", bg: "bg-fuchsia-600" },
];

const locations = [
  "Dhaka",
  "Sylhet",
  "Chattogram",
  "Rajshahi",
  "Khulna",
  "Barishal",
  "Rangpur",
  "Mymensingh",
];

export default function HomePage() {
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [heroTutors, setHeroTutors] = useState<Tutor[]>([]);
  const [heroTutorsLoading, setHeroTutorsLoading] = useState(true);

  // Real tutors from the API power both the hero circle and the floating card.
  useEffect(() => {
    const controller = new AbortController();
    setHeroTutorsLoading(true);

    apiFetch<{ tutors: Tutor[] }>("/tutors?limit=50", { signal: controller.signal })
      .then((data) => {
        if (!controller.signal.aborted) setHeroTutors(data.tutors ?? []);
      })
      .catch(() => {
        if (!controller.signal.aborted) setHeroTutors([]);
      })
      .finally(() => {
        if (!controller.signal.aborted) setHeroTutorsLoading(false);
      });

    return () => controller.abort();
  }, []);

  // Ahmed Rahman is the featured mentor in both the circle and the floating card.
  const featuredTutor =
    heroTutors.find(
      (tutor) => tutor.name.trim().toLowerCase() === "ahmed rahman"
    ) ?? heroTutors[0] ?? null;
  const floatingTutor = featuredTutor;
  const circleTutor = featuredTutor;
  const circleImageSrc = circleTutor?.image?.trim() || "";
  const [circleImageState, setCircleImageState] = useState<
    "loading" | "loaded" | "error"
  >("loading");
  const circleImageRef = useRef<HTMLImageElement | null>(null);

  // A new tutor photo must never paint the previous image while it loads.
  useEffect(() => {
    setCircleImageState("loading");

    // A cached image can finish before React attaches onLoad, so inspect it here too.
    const img = circleImageRef.current;
    if (img?.complete) {
      setCircleImageState(img.naturalWidth > 0 ? "loaded" : "error");
    }
  }, [circleImageSrc]);

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const params = new URLSearchParams();

    if (searchQuery.trim()) {
      params.set("search", searchQuery.trim());
    }

    if (selectedLocation) {
      params.set("location", selectedLocation);
    }

    const queryString = params.toString();

    router.push(queryString ? `/tuitions?${queryString}` : "/tuitions");
  };

  return (
    <div className="min-h-screen overflow-x-clip bg-[#f1f7f4] font-sans text-[#1e293b]">

      <Navbar />

      {/* ================= HERO SECTION ================= */}

      <section className="mx-auto max-w-7xl px-4 pb-16 pt-12 sm:px-8 sm:pt-16 lg:px-16 lg:pt-20">

        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">

          {/* Left Content */}

          <div className="space-y-6 lg:col-span-7">

            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-white px-4 py-2 text-xs font-bold text-[#0f9f6e] shadow-sm">
              ✦ YOUR LEARNING JOURNEY STARTS HERE
            </span>

            <h1 className="text-4xl font-extrabold leading-[1.15] tracking-tight text-[#111827] sm:text-5xl lg:text-6xl">
              Achieve your
              <br className="hidden sm:block" />
              long-standing goals
              <br />
              <span className="text-[#0f9f6e]">with us.</span>
            </h1>

            <p className="max-w-lg text-base leading-8 text-gray-600 sm:text-lg">
              Find verified tutors for Math, Science, Programming and IELTS —
              online or at home, on a schedule that works for you.
            </p>

            {/* Search Form */}

            <form
              onSubmit={handleSearch}
              className="flex max-w-xl flex-col gap-3 rounded-2xl border border-gray-100 bg-white p-3 shadow-lg sm:flex-row sm:items-center"
            >

              {/* Speciality Input */}

              <div className="flex w-full items-center gap-3 border-b border-gray-200 px-3 py-3 sm:w-1/2 sm:border-b-0 sm:border-r">

                <svg
                  className="h-5 w-5 shrink-0 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 103.5 10.5a7.5 7.5 0 0013.15 6.15z"
                  />
                </svg>

                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Enter speciality"
                  aria-label="Search tutor speciality"
                  className="w-full min-w-0 bg-transparent text-sm text-gray-800 outline-none placeholder:text-gray-400"
                />

              </div>

              {/* Location Select */}

              <div className="w-full px-2 sm:w-1/3">

                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  aria-label="Select location"
                  className="w-full cursor-pointer bg-transparent py-3 text-sm text-gray-600 outline-none"
                >
                  <option value="">All Locations</option>

                  {locations.map((location) => (
                    <option key={location} value={location}>
                      {location}
                    </option>
                  ))}

                </select>

              </div>

              {/* Search Button */}

              <button
                type="submit"
                className="w-full shrink-0 rounded-xl bg-[#0f9f6e] px-7 py-3.5 text-sm font-semibold text-white shadow-md transition hover:bg-[#087a54] sm:w-auto"
              >
                Search
              </button>

            </form>

            <p className="text-xs text-gray-500">
              Find the right tutor based on your skills and preferred location.
            </p>

          </div>

          {/* Hero Visual — placed to the left of the heading on large screens */}

          <div className="flex justify-center lg:col-span-5">

            <div className="relative flex h-[340px] w-full max-w-md items-center justify-center sm:h-[420px]">

              {/* Background Decoration */}

              <div className="absolute h-64 w-64 rounded-full bg-emerald-200/60 blur-3xl sm:h-80 sm:w-80" />

              {/* Floating Tutor Card — uses a real tutor from the API */}

              {floatingTutor && (
                <div className="absolute right-0 top-2 z-20 flex items-center gap-3 rounded-2xl border border-gray-100 bg-white p-3 shadow-xl sm:right-2">
                  {floatingTutor.image?.trim() ? (
                    <img
                      src={floatingTutor.image}
                      alt={floatingTutor.name}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  ) : (
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-[#0f9f6e]">
                      {floatingTutor.name.charAt(0)}
                    </span>
                  )}

                  <div>
                    <h4 className="text-xs font-bold text-gray-800">
                      {floatingTutor.name}
                    </h4>
                    <p className="text-[10px] text-gray-500">
                      {floatingTutor.subject} Tutor
                    </p>
                  </div>
                </div>
              )}

              {/* Main Tutor Image */}

              <div className="relative z-10 h-56 w-56 overflow-hidden rounded-full border-[8px] border-white bg-emerald-100 shadow-2xl sm:h-72 sm:w-72">

                {/* Neutral skeleton while the real tutor/photo is loading.
                    The old placeholder illustration is never shown here. */}
                {(heroTutorsLoading ||
                  (circleImageSrc && circleImageState === "loading")) && (
                  <div
                    className="absolute inset-0 flex animate-pulse items-center justify-center bg-gradient-to-br from-emerald-100 to-emerald-200"
                    role="status"
                    aria-label="Loading featured tutor"
                  >
                    <span className="text-5xl font-black text-[#0f9f6e]/30">M</span>
                  </div>
                )}

                {!heroTutorsLoading && circleImageSrc && circleImageState !== "error" && (
                  <img
                    key={circleImageSrc}
                    ref={circleImageRef}
                    src={circleImageSrc}
                    alt={`${circleTutor?.name ?? "Featured tutor"}, ${circleTutor?.subject ?? "tutor"}`.trim()}
                    onLoad={() => setCircleImageState("loaded")}
                    onError={() => setCircleImageState("error")}
                    className={`relative h-full w-full object-cover transition-opacity duration-300 ${
                      circleImageState === "loaded" ? "opacity-100" : "opacity-0"
                    }`}
                  />
                )}

                {!heroTutorsLoading &&
                  (!circleImageSrc || circleImageState === "error") && (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-emerald-100 to-emerald-200 text-5xl font-black text-[#0f9f6e]">
                      {circleTutor?.name?.charAt(0)?.toUpperCase() ?? "M"}
                    </div>
                  )}

              </div>

              {/* Bottom Floating Card */}

              <div className="absolute bottom-5 left-0 z-20 flex items-center gap-3 rounded-2xl border border-gray-100 bg-white px-4 py-3 shadow-xl sm:bottom-8 sm:left-2">

                <div className="h-3 w-3 rounded-full bg-emerald-500" />

                <div>
                  <p className="text-xs font-bold text-gray-800">
                    Flexible Learning
                  </p>
                  <p className="text-[10px] text-gray-500">
                    Learn at your own pace
                  </p>
                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* ================= CATEGORIES SECTION ================= */}

      <section className="border-y border-gray-100 bg-white py-14">

        <div className="mx-auto max-w-7xl px-4 text-center sm:px-8 lg:px-16">

          <p className="mb-8 text-sm font-semibold text-gray-500">
            EXPLORE YOUR LEARNING CATEGORIES
          </p>

          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4 lg:grid-cols-7">

            {categories.map((cat) => (
              <Link
                key={cat.name}
                href={
                  "subject" in cat && cat.subject
                    ? `/tutors?subject=${encodeURIComponent(cat.subject)}`
                    : "/tutors"
                }
                className="group flex cursor-pointer flex-col items-center gap-3"
              >

                <div
                  className={`flex h-16 w-16 items-center justify-center rounded-2xl ${cat.bg} text-2xl shadow-md transition duration-300 group-hover:-translate-y-1 group-hover:scale-110`}
                >
                  {cat.icon}
                </div>

                <span className="text-xs font-bold text-gray-700 transition group-hover:text-[#0f9f6e]">
                  {cat.name}
                </span>

              </Link>
            ))}

          </div>

          <p className="mt-10 text-xs font-semibold text-gray-500">
            Discover verified tutors across{" "}
            <span className="font-bold text-[#0f9f6e]">
              all core subjects
            </span>
          </p>

        </div>

      </section>

      <FeaturedTuitions />

      <FeaturedTutors />

      {/* ================= HOW IT WORKS ================= */}

      <section id="how-it-works" className="mx-auto max-w-7xl px-4 py-16 sm:px-8 sm:py-20 lg:px-16">

        <div className="rounded-3xl border border-gray-100 bg-white p-8 text-center shadow-sm sm:p-14">

          <span className="text-xs font-bold uppercase tracking-widest text-[#0f9f6e]">
            HOW IT WORKS
          </span>

          <h2 className="mb-12 mt-3 text-2xl font-extrabold text-[#111827] sm:text-3xl">
            Easiest Learning Way
          </h2>

          <div className="grid grid-cols-1 gap-10 md:grid-cols-3">

            {/* Step 1 */}

            <div className="flex flex-col items-center">

              <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-2xl bg-emerald-50 text-[#0f9f6e] shadow-sm">

                <svg
                  className="h-8 w-8"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 103.5 10.5a7.5 7.5 0 0013.15 6.15z"
                  />
                </svg>

              </div>

              <h3 className="mb-2 text-base font-bold text-gray-900">
                Find Instructors
              </h3>

              <p className="max-w-xs text-xs leading-6 text-gray-500">
                Browse experienced tutors suited for your learning goals.
              </p>

            </div>

            {/* Step 2 */}

            <div className="flex flex-col items-center">

              <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-2xl bg-emerald-50 text-[#0f9f6e] shadow-sm">

                <svg
                  className="h-8 w-8"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>

              </div>

              <h3 className="mb-2 text-base font-bold text-gray-900">
                Schedule a Class
              </h3>

              <p className="max-w-xs text-xs leading-6 text-gray-500">
                Book consultations or trial sessions with your preferred tutor.
              </p>

            </div>

            {/* Step 3 */}

            <div className="flex flex-col items-center">

              <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-2xl bg-emerald-50 text-[#0f9f6e] shadow-sm">

                <svg
                  className="h-8 w-8"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>

              </div>

              <h3 className="mb-2 text-base font-bold text-gray-900">
                Start Learning
              </h3>

              <p className="max-w-xs text-xs leading-6 text-gray-500">
                Connect online or offline and achieve your learning targets.
              </p>

            </div>

          </div>

        </div>

      </section>

      <Highlights />

      <PricingPreview />

      <Footer />

    </div>
  );
}
