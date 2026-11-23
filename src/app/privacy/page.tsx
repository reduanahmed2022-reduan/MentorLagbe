import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/shared/Footer";
import Navbar from "@/components/shared/Navbar";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: "Privacy Policy | MentorLagbe" },
  description: "How MentorLagbe collects, uses and protects your information.",
  alternates: { canonical: `${SITE_URL}/privacy` },
};

export default function PrivacyPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#f8faf9]">
      <Navbar />
      <main className="mx-auto max-w-3xl flex-1 px-6 py-16">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
          Privacy Policy
        </h1>
        <p className="mt-3 text-sm text-slate-400">Last updated: 2026</p>
        <div className="mt-10 space-y-7 text-sm leading-7 text-slate-600">
          <section>
            <h2 className="text-lg font-bold text-slate-900">What we store</h2>
            <p className="mt-2">
              We store your name, email, role, profile details and the tuition or
              application information you submit. Passwords are hashed and never
              stored in plain text.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-slate-900">How we use it</h2>
            <p className="mt-2">
              Your data is used to operate the platform, match students with
              tutors and keep transaction records for Pro subscriptions. We do
              not sell your personal information.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-slate-900">Payments &amp; images</h2>
            <p className="mt-2">
              Payments are processed by Stripe and images are hosted by ImgBB.
              Their own privacy policies apply to data handled by those services.
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
