"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { apiFetch } from "@/lib/api";
import type { TuitionApplication } from "@/lib/types";

export default function ApplyForm({ tuitionId }: { tuitionId: string }) {
  const { user, ready, isAuthenticated } = useAuth();
  const [studentPhone, setStudentPhone] = useState("");
  const [preferredSchedule, setPreferredSchedule] = useState("");
  const [studentNote, setStudentNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [applied, setApplied] = useState(false);
  const [checking, setChecking] = useState(false);

  // Restore the applied state after a reload so students never see a form they
  // have already submitted. Duplicate submissions are still blocked server-side.
  useEffect(() => {
    if (!ready || !isAuthenticated || user?.role !== "student") return;

    const controller = new AbortController();
    setChecking(true);

    apiFetch<{ applications: TuitionApplication[] }>("/applications/my-applications", {
      auth: true,
      signal: controller.signal,
    })
      .then((data) => {
        if (data.applications?.some((item) => item.tuitionId === tuitionId)) {
          setApplied(true);
        }
      })
      .catch(() => {
        // A transient failure should not hide the form; the server still guards
        // against duplicates with a 409 response.
      })
      .finally(() => {
        if (!controller.signal.aborted) setChecking(false);
      });

    return () => controller.abort();
  }, [ready, isAuthenticated, user?.role, tuitionId]);

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-500";

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (submitting || applied) return;

    if (!preferredSchedule.trim()) {
      toast.error("Please tell us your preferred schedule");
      return;
    }

    setSubmitting(true);

    try {
      await apiFetch("/applications", {
        method: "POST",
        auth: true,
        body: { tuitionId, studentPhone, preferredSchedule, studentNote },
      });

      setApplied(true);
      toast.success("Application submitted successfully!");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Could not submit application";
      if (message.toLowerCase().includes("already applied")) {
        setApplied(true);
        toast.success("You have already applied to this tuition");
      } else {
        toast.error(message);
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (!ready) {
    return (
      <div className="flex h-16 items-center justify-center">
        <Loader2 className="h-5 w-5 animate-spin text-emerald-600" />
      </div>
    );
  }

  if (checking) {
    return (
      <div className="flex h-16 items-center justify-center gap-2 text-xs text-slate-500">
        <Loader2 className="h-4 w-4 animate-spin text-emerald-600" />
        Checking your applications…
      </div>
    );
  }

  if (applied) {
    return (
      <div className="rounded-xl bg-emerald-50 p-5 text-center">
        <CheckCircle2 className="mx-auto h-8 w-8 text-emerald-600" />
        <p className="mt-3 text-sm font-bold text-emerald-800">Application sent!</p>
        <p className="mt-1 text-xs text-emerald-700">
          The tutor will review it and update your status.
        </p>
        <Link
          href="/dashboard/student/my-applications"
          className="mt-4 inline-block text-xs font-bold text-emerald-700 underline"
        >
          Track my applications
        </Link>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <>
        <Link
          href="/sign-in"
          className="flex w-full items-center justify-center rounded-xl bg-emerald-600 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-emerald-700"
        >
          Apply for This Tuition
        </Link>
        <p className="mt-4 text-center text-xs leading-5 text-slate-400">
          Sign in with your student account to apply for this tuition.
        </p>
      </>
    );
  }

  if (user?.role !== "student") {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-5 text-center">
        <p className="text-sm font-bold text-amber-800">Students only</p>
        <p className="mt-1 text-xs leading-5 text-amber-700">
          {user?.role === "tutor"
            ? "Tutors cannot apply to tuition posts. Use your student account instead."
            : "Admin accounts cannot apply to tuition posts."}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label htmlFor="apply-student-phone" className="mb-1 block text-xs font-semibold text-slate-600">
          Phone number
        </label>
        <input
          id="apply-student-phone"
          value={studentPhone}
          onChange={(event) => setStudentPhone(event.target.value)}
          placeholder="+880 1XXX-XXXXXX"
          className={inputClass}
        />
      </div>
      <div>
        <label htmlFor="apply-preferred-schedule" className="mb-1 block text-xs font-semibold text-slate-600">
          Preferred schedule <span className="text-rose-500">*</span>
        </label>
        <input
          id="apply-preferred-schedule"
          value={preferredSchedule}
          onChange={(event) => setPreferredSchedule(event.target.value)}
          placeholder="e.g. Weekdays 6–8 PM"
          className={inputClass}
          required
        />
      </div>
      <div>
        <label htmlFor="apply-student-note" className="mb-1 block text-xs font-semibold text-slate-600">
          Learning note
        </label>
        <textarea
          id="apply-student-note"
          value={studentNote}
          onChange={(event) => setStudentNote(event.target.value)}
          placeholder="Tell the tutor about your learning goals…"
          rows={3}
          className={inputClass}
        />
      </div>
      <button
        type="submit"
        disabled={submitting}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-emerald-700 disabled:opacity-60"
      >
        {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
        {submitting ? "Submitting…" : "Submit Application"}
      </button>
      <p className="text-center text-[11px] leading-4 text-slate-400">
        Your application stays pending until the tutor reviews it.
      </p>
    </form>
  );
}
