"use client";

import { toast } from "sonner";
import { SITE_URL } from "@/lib/site";

// Brand icons are inlined: lucide-react v1 no longer ships social brand marks.
const SHARE_TARGETS = [
  {
    label: "LinkedIn",
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
        <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.55V9h3.57v11.45z" />
      </svg>
    ),
    href: (url: string) =>
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
  },
  {
    label: "X",
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
        <path d="M18.9 2H22l-6.77 7.74L23.2 22h-6.25l-4.9-6.4L6.5 22H3.4l7.24-8.28L2.8 2h6.4l4.43 5.86L18.9 2Zm-1.1 18h1.73L7.36 3.9H5.5L17.8 20Z" />
      </svg>
    ),
    href: (url: string, text: string) =>
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
  },
  {
    label: "Facebook",
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
        <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12z" />
      </svg>
    ),
    href: (url: string) =>
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  },
];

export default function ShareButtons({
  title,
  path,
}: {
  title: string;
  path: string;
}) {
  // Use the browser's real origin so shares always point at the URL the user
  // is actually viewing (SITE_URL is only the build-time fallback).
  const origin =
    typeof window === "undefined" ? SITE_URL : window.location.origin;
  const url = `${origin}${path}`;
  const text = `${title} | MentorLagbe`;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard");
    } catch {
      toast.error("Could not copy the link");
    }
  };

  const nativeShare = async () => {
    if (!navigator.share) return copyLink();
    try {
      await navigator.share({ title, text, url });
    } catch {
      // The user dismissed the native share sheet.
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2 border-t border-slate-100 pt-4">
      <span className="mr-1 text-xs font-bold uppercase tracking-wider text-slate-400">
        Share
      </span>
      {SHARE_TARGETS.map(({ label, icon, href }) => (
        <a
          key={label}
          href={href(url, text)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Share on ${label}`}
          title={`Share on ${label}`}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:border-emerald-500 hover:text-emerald-600"
        >
          {icon}
        </a>
      ))}
      <button
        type="button"
        onClick={copyLink}
        className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-emerald-500 hover:text-emerald-600"
      >
        Copy link
      </button>
      <button
        type="button"
        onClick={nativeShare}
        className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-emerald-500 hover:text-emerald-600 sm:hidden"
      >
        Share
      </button>
    </div>
  );
}
