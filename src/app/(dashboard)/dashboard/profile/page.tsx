"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { ImagePlus, Loader2, Save, Sparkles } from "lucide-react";
import { toast } from "sonner";
import StatusBadge from "@/components/dashboard/StatusBadge";
import { useAuth } from "@/hooks/useAuth";
import { apiFetch, uploadImage } from "@/lib/api";
import { updateStoredUser } from "@/lib/auth";
import type { AuthUser } from "@/lib/types";

type Profile = AuthUser & {
  _id: string;
  location?: string;
  profileImage?: string;
  createdAt?: string;
};

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100";
const labelClass = "mb-1.5 block text-xs font-bold text-slate-600";

export default function ProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [bio, setBio] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [checkingOut, setCheckingOut] = useState(false);

  useEffect(() => {
    apiFetch<{ user: Profile }>("/auth/me", { auth: true })
      .then((data) => {
        setProfile(data.user);
        setName(data.user.name || "");
        setPhone(data.user.phone || "");
        setLocation(data.user.location || "");
        setBio(data.user.bio || "");
        setProfileImage(data.user.profileImage || "");
      })
      .catch((error) =>
        toast.error(error instanceof Error ? error.message : "Could not load profile")
      )
      .finally(() => setLoading(false));
  }, []);

  const handleImage = async (file?: File) => {
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be 5MB or smaller");
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file");
      return;
    }

    setUploading(true);

    try {
      setProfileImage(await uploadImage(file));
      toast.success("Profile picture uploaded — don't forget to save");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);

    try {
      const data = await apiFetch<{ user: Profile }>("/auth/me", {
        method: "PUT",
        auth: true,
        body: { name, phone, location, bio, profileImage },
      });

      setProfile(data.user);

      if (user) {
        updateStoredUser({
          ...user,
          name: data.user.name,
          image: data.user.profileImage,
          phone: data.user.phone,
          bio: data.user.bio,
        });
      }

      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleUpgrade = async () => {
    setCheckingOut(true);

    try {
      const data = await apiFetch<{ url: string }>("/payments/checkout", {
        method: "POST",
        auth: true,
      });
      window.location.assign(data.url);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not start checkout");
      setCheckingOut(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  const plan = profile?.plan || "free";
  const canUpgrade = user?.role === "tutor" || user?.role === "student";

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900">Update Profile</h2>
          <p className="mt-1 text-sm text-slate-500">
            Keep your details current so tutors and students can reach you.
          </p>
        </div>

        <form onSubmit={handleSave} className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
          <div className="flex flex-wrap items-center gap-5">
            <label
              htmlFor="profile-image"
              className="relative flex h-20 w-20 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-indigo-100 text-2xl font-black text-indigo-700 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2"
            >
              {profileImage ? (
                <img src={profileImage} alt={name} className="h-full w-full object-cover" />
              ) : (
                name.slice(0, 1).toUpperCase()
              )}
              <input
                id="profile-image"
                type="file"
                accept="image/*"
                aria-label="Change profile picture"
                className="sr-only"
                onChange={(event) => {
                  const file = event.currentTarget.files?.[0];
                  event.currentTarget.value = "";
                  handleImage(file);
                }}
              />
            </label>
            <div>
              <span
                aria-live="polite"
                className="inline-flex items-center gap-2 rounded-xl border border-dashed border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-600"
              >
                {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImagePlus className="h-4 w-4" />}
                {uploading ? "Uploading…" : "Change picture"}
              </span>
              <p className="mt-2 text-xs text-slate-400">Images hosted securely via ImgBB.</p>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="full-name" className={labelClass}>Full name</label>
              <input id="full-name" required value={name} onChange={(event) => setName(event.target.value)} className={inputClass} />
            </div>
            <div>
              <label htmlFor="email" className={labelClass}>Email (read-only)</label>
              <input id="email" value={profile?.email || ""} readOnly className={`${inputClass} bg-slate-50 text-slate-500`} />
            </div>
            <div>
              <label htmlFor="phone" className={labelClass}>Phone</label>
              <input id="phone" value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="+880 1XXX-XXXXXX" className={inputClass} />
            </div>
            <div>
              <label htmlFor="location" className={labelClass}>Location</label>
              <input id="location" value={location} onChange={(event) => setLocation(event.target.value)} placeholder="Dhaka, Bangladesh" className={inputClass} />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="bio" className={labelClass}>Short bio</label>
              <textarea
                id="bio"
                rows={4}
                value={bio}
                onChange={(event) => setBio(event.target.value)}
                placeholder="Tell the community a little about yourself…"
                className={inputClass}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={saving || uploading}
            className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-7 py-3 text-sm font-bold text-white transition hover:bg-indigo-700 disabled:opacity-60"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {saving ? "Saving…" : "Save Changes"}
          </button>
        </form>
      </div>

      <aside className="space-y-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <h3 className="text-sm font-bold text-slate-900">Account summary</h3>
          <dl className="mt-5 space-y-4 text-sm">
            <div className="flex items-center justify-between gap-3">
              <dt className="text-slate-500">Role</dt>
              <dd><StatusBadge status={user?.role || "student"} /></dd>
            </div>
            <div className="flex items-center justify-between gap-3">
              <dt className="text-slate-500">Plan</dt>
              <dd><StatusBadge status={plan} /></dd>
            </div>
            <div className="flex items-center justify-between gap-3">
              <dt className="text-slate-500">Member since</dt>
              <dd className="font-semibold text-slate-700">
                {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString() : "—"}
              </dd>
            </div>
          </dl>
        </div>

        {canUpgrade && (
          <div className="rounded-2xl border border-indigo-200 bg-gradient-to-br from-indigo-50 to-white p-6">
            <Sparkles className="h-6 w-6 text-indigo-600" />
            <h3 className="mt-3 text-base font-extrabold text-slate-900">
              {plan === "pro" ? "You're a Pro member 🎉" : "Unlock Pro features"}
            </h3>
            <p className="mt-2 text-xs leading-6 text-slate-500">
              {plan === "pro"
                ? "Your Pro plan is active. Enjoy unlimited posts, priority listing and more."
                : "Get unlimited tuition posts (tutors) or priority bookings (students) with a one-time payment."}
            </p>
            {plan === "free" && (
              <button
                type="button"
                onClick={handleUpgrade}
                disabled={checkingOut}
                className="mt-5 inline-flex items-center gap-2 rounded-full bg-indigo-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-indigo-700 disabled:opacity-60"
              >
                {checkingOut && <Loader2 className="h-4 w-4 animate-spin" />}
                {checkingOut ? "Opening Stripe…" : "Upgrade with Stripe"}
              </button>
            )}
            <Link
              href="/pricing"
              className="mt-3 block text-xs font-bold text-indigo-600 hover:underline"
            >
              Compare plans →
            </Link>
          </div>
        )}
      </aside>
    </div>
  );
}
