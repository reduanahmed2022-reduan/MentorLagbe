import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/shared/Footer";
import Navbar from "@/components/shared/Navbar";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: "Terms & Conditions | MentorLagbe" },
  description: "Terms and conditions for using the MentorLagbe tutoring platform.",
  alternates: { canonical: `${SITE_URL}/terms` },
};

export default function TermsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#f8faf9]">
      <Navbar />
      <main className="mx-auto max-w-3xl flex-1 px-6 py-16">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
          Terms &amp; Conditions
        </h1>
        <p className="mt-3 text-sm text-slate-400">Last updated: 2026</p>
        <div className="mt-10 space-y-7 text-sm leading-7 text-slate-600">
          <section>
            <h2 className="text-lg font-bold text-slate-900">1. Using MentorLagbe</h2>
            <p className="mt-2">
              MentorLagbe connects students with tutors. You agree to provide
              accurate information, use the platform lawfully, and respect other
              members of the community.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-slate-900">2. Tuitions &amp; payments</h2>
            <p className="mt-2">
              Tuition listings are moderated by admins before they appear in
              search. Pro plans are one-time purchases processed securely by
              Stripe and activate immediately after confirmation.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-slate-900">3. Your account</h2>
            <p className="mt-2">
              You are responsible for keeping your credentials safe. Notify us
              at hello@mentorlagbe.com if you suspect unauthorized access.
            </p>
          </section>
        </div>
        <Link href="/" className="mt-12 inline-block text-sm font-bold text-[#0f9f6e]">
          Back to home
        </Link>
      </main>
      <Footer />
    </div>
  );
}
