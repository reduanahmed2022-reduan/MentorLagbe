import Link from "next/link";
import { BRAND, PUBLIC_NAV } from "@/lib/constants";
import Logo from "./Logo";

// Fixed value keeps server and client markup identical (no hydration mismatch).
const COPYRIGHT_YEAR = 2026;

// Brand icons are inlined so no extra icon dependency is needed. Each link
// opens the platform itself; no pretend account URLs are used.
const SOCIAL_LINKS = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/",
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
        <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.55V9h3.57v11.45z" />
      </svg>
    ),
  },
  {
    label: "X (Twitter)",
    href: "https://twitter.com/",
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
        <path d="M18.9 2H22l-6.77 7.74L23.2 22h-6.25l-4.9-6.4L6.5 22H3.4l7.24-8.28L2.8 2h6.4l4.43 5.86L18.9 2Zm-1.1 18h1.73L7.36 3.9H5.5L17.8 20Z" />
      </svg>
    ),
  },
];

export default function Footer() {
  return (
    <footer className="mt-auto bg-[#0c2b2a] text-slate-300">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 sm:px-8 md:grid-cols-2 lg:grid-cols-3 lg:px-16">
        <div>
          <Logo light />
          <p className="mt-4 max-w-xs text-sm leading-7 text-slate-400">
            {BRAND.tagline} Learn from verified tutors online or at home, on
            your own schedule.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-widest text-white">
            Quick Links
          </h3>
          <ul className="mt-5 space-y-3 text-sm">
            {PUBLIC_NAV.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="transition hover:text-emerald-300">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-widest text-white">
            Contact
          </h3>
          <ul className="mt-5 space-y-3 text-sm text-slate-400">
            <li>{BRAND.email}</li>
            <li>{BRAND.location}</li>
            <li>
              <a
                href="mailto:reduanahmed@gmail.com"
                className="transition hover:text-emerald-300"
              >
                reduanahmed@gmail.com
              </a>
            </li>
          </ul>
          <div className="mt-5 flex items-center gap-3">
            {SOCIAL_LINKS.map(({ label, href, icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                title={label}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-slate-300 transition hover:border-emerald-300 hover:bg-emerald-300/10 hover:text-emerald-300"
              >
                {icon}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-6 py-5 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-16">
          <p>© {COPYRIGHT_YEAR} {BRAND.name}. All rights reserved.</p>
          <p>Built for learners, by mentors.</p>
        </div>
      </div>
    </footer>
  );
}
