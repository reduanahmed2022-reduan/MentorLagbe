import Link from "next/link";
import { Mail, MapPin, Phone, type LucideIcon } from "lucide-react";
import { BRAND, PUBLIC_NAV } from "@/lib/constants";
import Logo from "./Logo";

// Fixed value keeps server and client markup identical (no hydration mismatch).
const COPYRIGHT_YEAR = 2026;

// Brand icons are inlined so no extra icon dependency is needed. Each link
// opens the platform itself; no pretend account URLs are used.
const SOCIAL_LINKS = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/",
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
        <path d="M13.5 21v-7.5h2.52l.38-2.94H13.5V8.62c0-.85.24-1.43 1.46-1.43h1.56V4.54a20.8 20.8 0 0 0-2.27-.12c-2.25 0-3.79 1.37-3.79 3.9v2.14H7.94v2.94h2.52V21h3.04Z" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/",
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
        <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2Zm0 2A3.75 3.75 0 0 0 4 7.75v8.5A3.75 3.75 0 0 0 7.75 20h8.5a3.75 3.75 0 0 0 3.75-3.75v-8.5A3.75 3.75 0 0 0 16.25 4h-8.5ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm5.25-3a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5Z" />
      </svg>
    ),
  },
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
    label: "X",
    href: "https://x.com/",
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
        <path d="M18.9 2H22l-6.77 7.74L23.2 22h-6.25l-4.9-6.4L6.5 22H3.4l7.24-8.28L2.8 2h6.4l4.43 5.86L18.9 2Zm-1.1 18h1.73L7.36 3.9H5.5L17.8 20Z" />
      </svg>
    ),
  },
];

type ContactItemProps = {
  label: string;
  value: string;
  icon: LucideIcon;
  href?: string;
};

function ContactItem({ label, value, icon: Icon, href }: ContactItemProps) {
  const content = (
    <>
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/15 text-emerald-300 transition group-hover:border-emerald-300 group-hover:bg-emerald-300/10">
        <Icon className="h-4 w-4" aria-hidden="true" />
      </span>
      <span className="min-w-0 break-words pt-1.5">{value}</span>
    </>
  );

  const className =
    "group flex min-w-0 items-start gap-3 transition hover:text-emerald-300";

  return (
    <li>
      {href ? (
        <a href={href} aria-label={`${label}: ${value}`} className={className}>
          {content}
        </a>
      ) : (
        <div className={className}>{content}</div>
      )}
    </li>
  );
}

export default function Footer() {
  return (
    <footer className="mt-auto bg-[#0c2b2a] text-slate-300">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 py-14 sm:px-8 md:grid-cols-2 lg:grid-cols-3 lg:px-16">
        <div className="min-w-0">
          <Logo light />
          <p className="mt-4 max-w-xs text-sm leading-7 text-slate-400">
            {BRAND.tagline} Learn from verified tutors online or at home, on
            your own schedule.
          </p>
        </div>

        <div className="min-w-0">
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

        <div className="min-w-0 md:col-span-2 lg:col-span-1">
          <h3 className="text-sm font-bold uppercase tracking-widest text-white">
            Contact
          </h3>
          <ul className="mt-5 space-y-4 text-sm text-slate-400">
            <ContactItem
              label="Email"
              value={BRAND.email}
              icon={Mail}
              href={`mailto:${BRAND.email}`}
            />
            <ContactItem
              label="Phone"
              value={BRAND.phone}
              icon={Phone}
              href={`tel:${BRAND.phone.replace(/[^+\d]/g, "")}`}
            />
            <ContactItem label="Location" value={BRAND.location} icon={MapPin} />
          </ul>
          <div className="mt-6 flex flex-wrap items-center gap-3">
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
