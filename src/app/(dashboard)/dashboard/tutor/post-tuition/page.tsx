"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import TuitionForm from "@/components/tuitions/TuitionForm";

export default function PostTuitionPage() {
  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/dashboard/tutor/my-tuitions"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-indigo-600"
        >
          <ArrowLeft className="h-4 w-4" /> Back to my tuitions
        </Link>
        <h2 className="mt-3 text-xl font-extrabold text-slate-900">Post a New Tuition</h2>
        <p className="mt-1 text-sm text-slate-500">
          Describe your batch. An admin will review it before it goes live.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
        <TuitionForm />
      </div>
    </div>
  );
}
