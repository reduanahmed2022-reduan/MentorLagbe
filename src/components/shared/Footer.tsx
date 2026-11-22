import Link from "next/link";
import { BRAND, PUBLIC_NAV } from "@/lib/constants";
import Logo from "./Logo";

const socials = [
  { label: "X", href: "https://x.com" },
  { label: "LinkedIn", href: "https://linkedin.com" },
  { label: "Facebook", href: "https://facebook.com" },
  { label: "Instagram", href: "https://instagram.com" },
];

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="mt-auto bg-[#0c2b2a] text-slate-300">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 sm:px-8 md:grid-cols-2 lg:grid-cols-4 lg:px-16">
        <div>
          <Logo light />
          <p className="mt-4 max-w-xs text-sm leading-7 text-slate-400">
            {BRAND.tagline} Learn from verified tutors online or at home, on
            your own schedule.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-widest text-white">
            Explore
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
            <li>{BRAND.phone}</li>
            <li>{BRAND.location}</li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-widest text-white">
            Follow us
          </h3>
          <div className="mt-5 flex flex-wrap gap-2">
            {socials.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noreferrer"
                aria-label={social.label}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-slate-300 transition hover:border-emerald-400 hover:text-emerald-300"
              >
                {social.label === "X" ? <XIcon /> : social.label[0]}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-6 py-5 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-16">
          <p>© {new Date().getFullYear()} {BRAND.name}. All rights reserved.</p>
          <p>Built for learners, by mentors.</p>
        </div>
      </div>
    </footer>
  );
}
