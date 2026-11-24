"use client";

import Link from "next/link";
import { BadgeCheck, Clock, GraduationCap, MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import type { Tutor } from "@/lib/types";

function getExperience(tutor: Tutor) {
  return typeof tutor.experience === "number"
    ? `${tutor.experience}+ years`
    : tutor.experience;
}

export default function FeaturedTutors() {
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    apiFetch<{ tutors: Tutor[] }>("/tutors?limit=6", {
      signal: controller.signal,
    })
      .then((data) => setTutors((data.tutors ?? []).slice(0, 6)))
      .catch(() => setTutors([]))
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, []);

  return (
    <section className="bg-[#f8faf9] py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#0f9f6e]">
              MEET OUR MENTORS
            </span>
            <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-[#111827] sm:text-3xl">
              Learn from experienced mentors
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Friendly, verified tutors ready to help you reach your goals.
            </p>
          </div>
          <Link
            href="/tutors"
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-[#0f9f6e] hover:text-[#0f9f6e]"
          >
            Browse all tutors
          </Link>
        </div>

        {loading ? (
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm animate-pulse"
              >
                <div className="flex items-center gap-4">
                  <div className="h-20 w-20 shrink-0 rounded-full bg-slate-100" />
                  <div className="flex-1 space-y-3">
                    <div className="h-4 w-2/3 rounded bg-slate-100" />
                    <div className="h-3 w-1/2 rounded bg-slate-100" />
                  </div>
                </div>
                <div className="mt-6 space-y-3 border-t border-slate-100 pt-5">
                  <div className="h-3 w-4/5 rounded bg-slate-100" />
                  <div className="h-3 w-3/5 rounded bg-slate-100" />
                  <div className="h-3 w-2/3 rounded bg-slate-100" />
                </div>
                <div className="mt-6 h-8 w-1/2 rounded bg-slate-100" />
              </div>
            ))}
          </div>
        ) : tutors.length ? (
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {tutors.map((tutor) => (
              <article
                key={tutor.id}
                className="flex h-full flex-col rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full border-4 border-emerald-50 bg-emerald-100 text-xl font-bold text-[#0f9f6e]">
                    {tutor.image?.trim() ? (
                      <img
                        src={tutor.image}
                        alt={tutor.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      tutor.name.charAt(0)
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h3 className="truncate text-base font-bold text-[#111827]">
                        {tutor.name}
                      </h3>
                      {tutor.verified && (
                        <BadgeCheck
                          className="h-4 w-4 shrink-0 text-[#0f9f6e]"
                          aria-label="Verified mentor"
                          role="img"
                        />
                      )}
                    </div>
                    <p className="mt-1 text-sm font-semibold text-[#0f9f6e]">
                      {tutor.subject} Tutor
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex-1 space-y-3 border-t border-slate-100 pt-5">
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <GraduationCap size={17} className="shrink-0 text-slate-400" />
                    <span>{tutor.qualification}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <MapPin size={17} className="shrink-0 text-slate-400" />
                    <span>{tutor.location}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <Clock size={17} className="shrink-0 text-slate-400" />
                    <span>{getExperience(tutor)} experience</span>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-5">
                  <div>
                    <p className="text-xs text-slate-400">Starting from</p>
                    <p className="mt-1 text-xl font-bold text-slate-900">
                      ${tutor.hourlyRate}
                      <span className="text-xs font-normal text-slate-500">
                        /hour
                      </span>
                    </p>
                  </div>
                  <Link
                    href={`/tutors/${tutor.id}`}
                    className="inline-flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-2.5 text-sm font-semibold text-emerald-700 transition hover:bg-[#0f9f6e] hover:text-white"
                  >
                    View profile
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div
            aria-live="polite"
            className="mt-10 rounded-3xl border border-dashed border-slate-200 bg-white p-10 text-center text-sm text-slate-500"
          >
            Mentors will appear here soon.
          </div>
        )}
      </div>
    </section>
  );
}
