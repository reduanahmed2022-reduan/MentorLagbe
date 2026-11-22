import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  GraduationCap,
  MapPin,
  Monitor,
  Wallet,
} from "lucide-react";
import type { Tuition } from "@/lib/types";

export default function TuitionCard({ tuition }: { tuition: Tuition }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-emerald-900/5">
      <Link href={`/tuitions/${tuition._id}`} className="relative block h-44 overflow-hidden">
        {tuition.bannerImage ? (
          <img
            src={tuition.bannerImage}
            alt={tuition.title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-100 text-4xl">
            📘
          </div>
        )}
        <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-slate-700 shadow-sm">
          {tuition.subject}
        </span>
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-[#0f9f6e]">
            {tuition.mode === "Online" ? <Monitor className="h-3 w-3" /> : <MapPin className="h-3 w-3" />}
            {tuition.mode}
          </span>
          <span className="text-xs font-semibold text-slate-500">{tuition.classLevel}</span>
        </div>

        <h3 className="mt-4 line-clamp-2 text-base font-bold leading-6 text-slate-900">
          {tuition.title}
        </h3>

        <div className="mt-4 space-y-2 text-xs text-slate-500">
          <p className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4 text-[#0f9f6e]" /> {tuition.tutorName}
          </p>
          <p className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-[#0f9f6e]" /> {tuition.daysPerWeek} days / week
          </p>
          <p className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-[#0f9f6e]" /> {tuition.location}
          </p>
        </div>

        <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-4">
          <span className="flex items-center gap-1 text-sm font-extrabold text-slate-900">
            <Wallet className="h-4 w-4 text-[#0f9f6e]" />
            ৳{Number(tuition.monthlyFee).toLocaleString("en-BD")}
            <span className="text-xs font-medium text-slate-400">/mo</span>
          </span>
          <Link
            href={`/tuitions/${tuition._id}`}
            className="inline-flex items-center gap-1 text-xs font-bold text-[#0f9f6e] transition hover:gap-2"
          >
            View Details <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}
