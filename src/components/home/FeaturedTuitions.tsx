"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import TuitionCard from "@/components/shared/TuitionCard";
import { apiFetch } from "@/lib/api";
import type { Tuition } from "@/lib/types";

export default function FeaturedTuitions() {
  const [tuitions, setTuitions] = useState<Tuition[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    apiFetch<{ tuitions: Tuition[] }>("/tuitions?limit=6", {
      signal: controller.signal,
    })
      .then((data) => setTuitions(data.tuitions.slice(0, 6)))
      .catch(() => setTuitions([]))
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, []);

  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#0f9f6e]">
              FEATURED TUITIONS
            </span>
            <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-[#111827] sm:text-3xl">
              Latest approved batches for you
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Handpicked, verified and ready to join.
            </p>
          </div>
          <Link
            href="/tuitions"
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-[#0f9f6e] hover:text-[#0f9f6e]"
          >
            Browse All <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {loading ? (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="h-80 animate-pulse rounded-2xl border border-slate-100 bg-slate-50"
              />
            ))}
          </div>
        ) : tuitions.length ? (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {tuitions.map((tuition) => (
              <TuitionCard key={tuition._id} tuition={tuition} />
            ))}
          </div>
        ) : (
          <div
            aria-live="polite"
            className="mt-10 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-10 text-center text-sm text-slate-500"
          >
            No approved tuitions yet. Check back soon — new batches are added every week.
          </div>
        )}
      </div>
    </section>
  );
}
