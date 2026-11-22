"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ImagePlus, Loader2, UploadCloud } from "lucide-react";
import { toast } from "sonner";
import { apiFetch, uploadImage } from "@/lib/api";
import { CLASS_LEVELS, LOCATIONS, MODES, SUBJECTS } from "@/lib/constants";
import type { Tuition } from "@/lib/types";

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100";
const labelClass = "mb-1.5 block text-xs font-bold text-slate-600";

export default function TuitionForm({
  initial,
  onDone,
}: {
  initial?: Tuition;
  onDone?: () => void;
}) {
  const router = useRouter();
  const isEdit = Boolean(initial);

  const [title, setTitle] = useState(initial?.title || "");
  const [subject, setSubject] = useState(initial?.subject || SUBJECTS[0]);
  const [classLevel, setClassLevel] = useState(initial?.classLevel || CLASS_LEVELS[0]);
  const [mode, setMode] = useState<"Online" | "Offline">(initial?.mode || "Online");
  const [location, setLocation] = useState(initial?.location || LOCATIONS[0]);
  const [monthlyFee, setMonthlyFee] = useState(String(initial?.monthlyFee || ""));
  const [daysPerWeek, setDaysPerWeek] = useState(String(initial?.daysPerWeek || 2));
  const [description, setDescription] = useState(initial?.description || "");
  const [bannerImage, setBannerImage] = useState(initial?.bannerImage || "");
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleImage = async (file?: File) => {
    if (!file) return;

    setUploading(true);

    try {
      setBannerImage(await uploadImage(file));
      toast.success("Cover image uploaded");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setSubmitting(true);

    try {
      const payload = {
        title: title.trim(),
        subject,
        classLevel,
        mode,
        location,
        monthlyFee: Number(monthlyFee),
        daysPerWeek: Number(daysPerWeek),
        description: description.trim(),
        bannerImage,
      };

      if (isEdit) {
        await apiFetch(`/tuitions/${initial!._id}`, {
          method: "PATCH",
          auth: true,
          body: payload,
        });
        toast.success("Tuition updated successfully");
      } else {
        await apiFetch("/tuitions", {
          method: "POST",
          auth: true,
          body: payload,
        });
        toast.success("Tuition submitted for admin approval");
      }

      if (onDone) {
        onDone();
      } else {
        router.push("/dashboard/tutor/my-tuitions");
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not save tuition");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className={labelClass}>Tuition title *</label>
          <input
            required
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="e.g. HSC Mathematics — Algebra to Calculus"
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Subject *</label>
          <select value={subject} onChange={(event) => setSubject(event.target.value)} className={inputClass}>
            {SUBJECTS.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass}>Class level *</label>
          <select value={classLevel} onChange={(event) => setClassLevel(event.target.value)} className={inputClass}>
            {CLASS_LEVELS.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass}>Mode *</label>
          <select
            value={mode}
            onChange={(event) => setMode(event.target.value as "Online" | "Offline")}
            className={inputClass}
          >
            {MODES.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass}>Location *</label>
          <select value={location} onChange={(event) => setLocation(event.target.value)} className={inputClass}>
            {LOCATIONS.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass}>Monthly fee (৳) *</label>
          <input
            required
            type="number"
            min={1}
            value={monthlyFee}
            onChange={(event) => setMonthlyFee(event.target.value)}
            placeholder="5000"
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Days per week *</label>
          <input
            required
            type="number"
            min={1}
            max={7}
            value={daysPerWeek}
            onChange={(event) => setDaysPerWeek(event.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label className={labelClass}>Description *</label>
        <textarea
          required
          rows={5}
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Describe the batch, teaching approach, target audience and schedule…"
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass}>Cover image (optional)</label>
        <div className="flex flex-wrap items-center gap-4">
          <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-slate-300 px-4 py-3 text-sm font-semibold text-slate-600 transition hover:border-indigo-500 hover:text-indigo-600">
            {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImagePlus className="h-4 w-4" />}
            {uploading ? "Uploading…" : "Choose image"}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(event) => handleImage(event.target.files?.[0])}
            />
          </label>
          {bannerImage && (
            <img src={bannerImage} alt="Cover preview" className="h-16 w-24 rounded-lg object-cover" />
          )}
          <span className="flex items-center gap-1 text-xs text-slate-400">
            <UploadCloud className="h-3.5 w-3.5" /> Hosted securely via ImgBB
          </span>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 border-t border-slate-100 pt-5">
        <button
          type="submit"
          disabled={submitting || uploading}
          className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-7 py-3 text-sm font-bold text-white transition hover:bg-indigo-700 disabled:opacity-60"
        >
          {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
          {isEdit ? "Save Changes" : "Submit for Approval"}
        </button>
        <button
          type="button"
          onClick={() => (onDone ? onDone() : router.back())}
          className="rounded-full border border-slate-200 px-7 py-3 text-sm font-bold text-slate-600 transition hover:border-slate-300"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
