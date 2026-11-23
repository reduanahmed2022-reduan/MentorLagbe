import Link from "next/link";
import { BRAND, PUBLIC_NAV } from "@/lib/constants";
import Logo from "./Logo";

// Fixed value keeps server and client markup identical (no hydration mismatch).
const COPYRIGHT_YEAR = 2026;

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
          </ul>
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
