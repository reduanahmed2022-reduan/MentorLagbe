"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { apiFetch } from "@/lib/api";
import { PREFERRED_SCHEDULE_OPTIONS } from "@/lib/constants";
import type { TuitionApplication } from "@/lib/types";

export default function ApplyForm({ tuitionId }: { tuitionId: string }) {
  const { user, ready, isAuthenticated } = useAuth();
  const [studentPhone, setStudentPhone] = useState("");
  const [preferredSchedule, setPreferredSchedule] = useState("");
  const [studentNote, setStudentNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [restoring, setRestoring] = useState(false);
  const [existingApplication, setExistingApplication] =
    useState<TuitionApplication | null>(null);
  const [checking, setChecking] = useState(false);
  const [duplicateNotice, setDuplicateNotice] = useState(false);

  // Restore the application state after a reload. A rejected row is kept so the
  // student can restore it to pending instead of being blocked by the unique index.
  useEffect(() => {
    if (!ready || !isAuthenticated || user?.role !== "student") return;

    const controller = new AbortController();
    Promise.resolve().then(() => {
      if (!controller.signal.aborted) setChecking(true);
    });

    apiFetch<{ applications: TuitionApplication[] }>("/applications/my-applications", {
      auth: true,
      signal: controller.signal,
    })
      .then((data) => {
        const existing = data.applications?.find(
          (item) => item.tuitionId === tuitionId
        );
        if (!existing) return;

        setExistingApplication(existing);
        setStudentPhone(existing.studentPhone || "");
        setPreferredSchedule(existing.preferredSchedule || "");
        setStudentNote(existing.studentNote || "");
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

  const rejectedApplication =
    existingApplication?.status === "rejected" ? existingApplication : null;
  const applied = Boolean(
    existingApplication && existingApplication.status !== "rejected"
  );

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-500";

  const handleRestore = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!rejectedApplication || restoring) return;

    if (!preferredSchedule.trim()) {
      toast.error("Please select your preferred schedule");
      return;
    }

    setRestoring(true);

    try {
      const data = await apiFetch<{ application?: TuitionApplication }>(
        `/applications/${rejectedApplication._id}/restore`,
        {
          method: "PATCH",
          auth: true,
          body: { studentPhone, preferredSchedule, studentNote },
        }
      );

      setExistingApplication(data.application || { ...rejectedApplication, status: "pending" });
      toast.success("Application restored to pending");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not restore application");
    } finally {
      setRestoring(false);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (submitting || applied) return;

    if (!preferredSchedule.trim()) {
      toast.error("Please select your preferred schedule");
      return;
    }

    setSubmitting(true);

    try {
      await apiFetch("/applications", {
        method: "POST",
        auth: true,
        body: { tuitionId, studentPhone, preferredSchedule, studentNote },
      });

      setExistingApplication({
        _id: "local",
        tuitionId,
        tuitionTitle: "",
        subject: "",
        monthlyFee: 0,
        tutorEmail: "",
        studentName: user?.name || "",
        studentEmail: user?.email || "",
        studentPhone,
        preferredSchedule,
        studentNote,
        status: "pending",
        appliedAt: new Date().toISOString(),
      });
      toast.success("Application submitted successfully!");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Could not submit application";
      if (message.toLowerCase().includes("already applied")) {
        // The duplicate row already exists on the server — never fabricate a
        // fresh "pending" application or report a submission that never happened.
        setDuplicateNotice(true);
        toast.info("You have already applied to this tuition. Check its status below.");
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

  if (rejectedApplication) {
    return (
      <form
        onSubmit={handleRestore}
        className="space-y-3 rounded-xl border border-rose-200 bg-rose-50 p-5"
      >
        <div className="text-center">
          <p className="text-sm font-bold text-rose-800">Application was rejected</p>
          <p className="mt-1 text-xs leading-5 text-rose-700">
            Choose a new schedule and restore it to pending. The tutor will review it again.
          </p>
        </div>
        <div>
          <label htmlFor="restore-student-phone" className="mb-1 block text-xs font-semibold text-slate-600">
            Phone number
          </label>
          <input
            id="restore-student-phone"
            value={studentPhone}
            onChange={(event) => setStudentPhone(event.target.value)}
            placeholder="+880 1XXX-XXXXXX"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="restore-preferred-schedule" className="mb-1 block text-xs font-semibold text-slate-600">
            Preferred schedule <span className="text-rose-500">*</span>
          </label>
          <select
            id="restore-preferred-schedule"
            value={preferredSchedule}
            onChange={(event) => setPreferredSchedule(event.target.value)}
            className={inputClass}
            required
          >
            <option value="">Select a preferred schedule</option>
            {PREFERRED_SCHEDULE_OPTIONS.map((slot) => (
              <option key={slot} value={slot}>
                {slot}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="restore-student-note" className="mb-1 block text-xs font-semibold text-slate-600">
            Learning note
          </label>
          <textarea
            id="restore-student-note"
            value={studentNote}
            onChange={(event) => setStudentNote(event.target.value)}
            rows={3}
            className={inputClass}
          />
        </div>
        <button
          type="submit"
          disabled={restoring}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-emerald-700 disabled:opacity-60"
        >
          {restoring && <Loader2 className="h-4 w-4 animate-spin" />}
          {restoring ? "Restoring…" : "Restore to pending"}
        </button>
        <Link
          href="/dashboard/student/my-applications"
          className="block text-center text-xs font-bold text-emerald-700 underline"
        >
          Track my applications
        </Link>
      </form>
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
          href={`/sign-in?next=${encodeURIComponent(`/tuitions/${tuitionId}`)}`}
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

  if (duplicateNotice) {
    return (
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5 text-center">
        <CheckCircle2 className="mx-auto h-8 w-8 text-emerald-600" />
        <p className="mt-3 text-sm font-bold text-emerald-800">
          Application already on record
        </p>
        <p className="mt-1 text-xs leading-5 text-emerald-700">
          You have applied to this tuition before. Check the latest status in My Applications.
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
        <select
          id="apply-preferred-schedule"
          value={preferredSchedule}
          onChange={(event) => setPreferredSchedule(event.target.value)}
          className={inputClass}
          required
        >
          <option value="">Select a preferred schedule</option>
          {PREFERRED_SCHEDULE_OPTIONS.map((slot) => (
            <option key={slot} value={slot}>
              {slot}
            </option>
          ))}
        </select>
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
