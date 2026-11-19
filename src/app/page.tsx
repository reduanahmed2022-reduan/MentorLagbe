

"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const categories = [
  { name: "Language", icon: "🌐", bg: "bg-amber-600" },
  { name: "Coding", icon: "💻", bg: "bg-orange-500" },
  { name: "Drum", icon: "🥁", bg: "bg-emerald-600" },
  { name: "Horns", icon: "🎺", bg: "bg-blue-600" },
  { name: "Piano", icon: "🎹", bg: "bg-indigo-600" },
  { name: "Voice", icon: "🎤", bg: "bg-purple-600" },
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

    router.push(queryString ? `/tutors?${queryString}` : "/tutors");
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Find Tutor", href: "/tutors" },
    { name: "Become a Tutor", href: "/register?role=tutor" },
  ];

  return (
    <div className="min-h-screen overflow-x-clip bg-[#f1f7f4] font-sans text-[#1e293b]">

      {/* ================= NAVBAR ================= */}

      <header className="sticky top-0 z-[100] w-full border-b border-gray-100 bg-[#f1f7f4]/90 px-4 py-3 backdrop-blur-xl sm:px-8 lg:px-16">

        <div className="mx-auto flex h-[68px] max-w-7xl items-center justify-between rounded-2xl border border-white/70 bg-white/95 px-4 shadow-md shadow-gray-900/5 sm:px-6">

          {/* Logo */}

          <Link
            href="/"
            onClick={closeMobileMenu}
            className="group flex shrink-0 items-center gap-2.5"
          >
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-[#0f9f6e] text-white shadow-md transition group-hover:bg-[#087a54]">

              <svg
                className="absolute -top-1.5 h-5 w-5 fill-white text-[#0f9f6e]"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M12 3L1 9l11 6 9-4.917V15h2V9L12 3zM5 13.188V17c0 2.21 3.134 4 7 4s7-1.79 7-4v-3.812L12 16.5 5 13.188z" />
              </svg>

              <span className="mt-1 text-xl font-black tracking-tighter">
                M
              </span>
            </div>

            <span className="text-lg font-extrabold tracking-tight text-[#111827] sm:text-xl">
              Mentor<span className="text-[#0f9f6e]">Lagbe</span>
            </span>
          </Link>

          {/* Desktop Navigation */}

          <nav className="hidden items-center gap-7 text-sm font-semibold text-gray-600 lg:flex">

            <Link
              href="/"
              className="text-[#0f9f6e] transition hover:text-[#087a54]"
            >
              Home
            </Link>

            <Link
              href="/tutors"
              className="transition hover:text-[#0f9f6e]"
            >
              Find Tutor
            </Link>

            <Link
              href="/register?role=tutor"
              className="transition hover:text-[#0f9f6e]"
            >
              Become a Tutor
            </Link>

          </nav>

          {/* Desktop Actions */}

          <div className="hidden items-center gap-3 lg:flex">

            <span className="rounded-full bg-gray-100 px-3 py-2 text-xs font-semibold text-gray-700">
              English · BDT
            </span>

            <Link
              href="/bookings"
              className="rounded-full bg-[#0f9f6e] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#087a54]"
            >
              Book a Free Trial
            </Link>

            <Link
              href="/login"
              className="px-3 py-2 text-sm font-semibold text-[#111827] transition hover:text-[#0f9f6e]"
            >
              Login
            </Link>

          </div>

          {/* Mobile Menu Button */}

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
            className="flex h-10 w-10 items-center justify-center rounded-xl text-gray-700 transition hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#0f9f6e] lg:hidden"
          >
            {mobileMenuOpen ? (
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
            )}
          </button>

        </div>

        {/* Mobile Dropdown */}

        {mobileMenuOpen && (
          <nav
            id="mobile-navigation"
            className="mx-auto mt-2 flex max-w-7xl flex-col gap-2 rounded-2xl border border-gray-100 bg-white p-5 shadow-xl lg:hidden"
          >

            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={closeMobileMenu}
                className={`rounded-xl px-4 py-3 text-sm font-semibold transition ${link.name === "Home"
                  ? "bg-emerald-50 text-[#0f9f6e]"
                  : "text-gray-700 hover:bg-emerald-50 hover:text-[#0f9f6e]"
                  }`}
              >
                {link.name}
              </Link>
            ))}

            <div className="my-2 border-t border-gray-100" />

            <Link
              href="/bookings"
              onClick={closeMobileMenu}
              className="rounded-full bg-[#0f9f6e] py-3 text-center text-sm font-semibold text-white transition hover:bg-[#087a54]"
            >
              Book a Free Trial
            </Link>

            <Link
              href="/login"
              onClick={closeMobileMenu}
              className="rounded-full border border-gray-200 py-3 text-center text-sm font-semibold text-gray-700 transition hover:border-[#0f9f6e] hover:text-[#0f9f6e]"
            >
              Login
            </Link>

          </nav>
        )}

      </header>

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
              Music, coding and language platform that connects students with
              experienced tutors. Learn new skills and achieve your goals.
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
                Search →
              </button>

            </form>

            <p className="text-xs text-gray-500">
              Find the right tutor based on your skills and preferred location.
            </p>

          </div>

          {/* Right Hero Visual */}

          <div className="flex justify-center lg:col-span-5">

            <div className="relative flex h-[340px] w-full max-w-md items-center justify-center sm:h-[420px]">

              {/* Background Decoration */}

              <div className="absolute h-64 w-64 rounded-full bg-emerald-200/60 blur-3xl sm:h-80 sm:w-80" />

              {/* Floating Tutor Card */}

              <div className="absolute right-0 top-2 z-20 flex items-center gap-3 rounded-2xl border border-gray-100 bg-white p-3 shadow-xl sm:right-2">

                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop"
                  alt="Tutor Sarah Jenkins"
                  className="h-10 w-10 rounded-full object-cover"
                />

                <div>
                  <h4 className="text-xs font-bold text-gray-800">
                    Sarah Jenkins
                  </h4>
                  <p className="text-[10px] text-gray-500">
                    English Expert
                  </p>
                </div>

                <span className="text-sm text-amber-400">★</span>

              </div>

              {/* Main Tutor Image */}

              <div className="relative z-10 h-56 w-56 overflow-hidden rounded-full border-[8px] border-white bg-emerald-100 shadow-2xl sm:h-72 sm:w-72">

                <img
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&crop=face"
                  alt="Professional tutor"
                  className="h-full w-full object-cover"
                />

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
                href={`/tutors?category=${encodeURIComponent(cat.name)}`}
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
            Discover tutors across{" "}
            <span className="font-bold text-[#0f9f6e]">
              49+ Languages
            </span>
          </p>

        </div>

      </section>

      {/* ================= HOW IT WORKS ================= */}

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-8 sm:py-20 lg:px-16">

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

    </div>
  );
}
