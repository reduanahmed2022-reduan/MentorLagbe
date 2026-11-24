"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import TuitionCard from "@/components/shared/TuitionCard";
import { apiFetch } from "@/lib/api";
import type { Tuition } from "@/lib/types";

type FeaturedTuitionsProps = {
  query?: string;
  eyebrow?: string;
  heading?: string;
  description?: string;
  emptyMessage?: string;
  className?: string;
  /** IDs rendered by another section, so the same card is never shown twice. */
  excludeIds?: string[];
  /** Lets the parent remember which cards this section actually rendered. */
  onTuitionsChange?: (tuitions: Tuition[]) => void;
};

export default function FeaturedTuitions({
  query = "/tuitions?limit=6",
  eyebrow = "FEATURED TUITIONS",
  heading = "Latest approved batches for you",
  description = "Handpicked approved batches — verified and ready to join.",
  emptyMessage = "No approved tuitions yet. Check back soon — new batches are added every week.",
  className = "bg-white py-16 sm:py-20",
  excludeIds = [],
  onTuitionsChange,
}: FeaturedTuitionsProps) {
  const [tuitions, setTuitions] = useState<Tuition[]>([]);
  const [loading, setLoading] = useState(true);
  const excludeKey = excludeIds.join(",");

  useEffect(() => {
    const controller = new AbortController();
    const excluded = new Set(excludeKey ? excludeKey.split(",") : []);

    // Keep the canonical query string as the section marker, but ask for a
    // wider page when cards must be skipped so six fresh batches remain.
    const requestQuery = excluded.size
      ? /([?&])limit=\d+/.test(query)
        ? query.replace(/([?&])limit=\d+/, "$1limit=50")
        : `${query}${query.includes("?") ? "&" : "?"}limit=50`
      : query;

    apiFetch<{ tuitions: Tuition[] }>(requestQuery, {
      signal: controller.signal,
    })
      .then((data) => {
        if (controller.signal.aborted) return;

        const visible = data.tuitions
          .filter((tuition) => !excluded.has(tuition._id))
          .slice(0, 6);

        setTuitions(visible);
        onTuitionsChange?.(visible);
      })
      .catch(() => {
        if (!controller.signal.aborted) setTuitions([]);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [query, excludeKey, onTuitionsChange]);

  return (
    <section className={className}>
      <div className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#0f9f6e]">
              {eyebrow}
            </span>
            <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-[#111827] sm:text-3xl">
              {heading}
            </h2>
            <p className="mt-2 text-sm text-slate-500">{description}</p>
          </div>
          <Link
            href="/tuitions"
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-[#0f9f6e] hover:text-[#0f9f6e]"
          >
            Browse All
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
            {emptyMessage}
          </div>
        )}
      </div>
    </section>
  );
}
