"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Check, Sparkles } from "lucide-react";
import { toast } from "sonner";
import Footer from "@/components/shared/Footer";
import Navbar from "@/components/shared/Navbar";
import { useAuth } from "@/hooks/useAuth";
import { apiFetch } from "@/lib/api";
import { dashboardPathFor } from "@/lib/auth";
import { PRO_PRICES } from "@/lib/constants";

const tiers = [
  {
    name: "Free Student",
    price: "৳0",
    plan: "free",
    role: "student",
    features: ["Browse all approved tuitions", "Apply to 5 tuitions", "Track application status"],
  },
  {
    name: "Pro Student",
    price: `$${PRO_PRICES.student}`,
    plan: "pro",
    role: "student",
    features: ["Unlimited tuition bookmarks", "Priority booking", "All tuition details", "Pro badge on profile"],
    popular: true,
  },
  {
    name: "Free Tutor",
    price: "৳0",
    plan: "free",
    role: "tutor",
    features: ["Post up to 2 tuitions", "Manage applicants", "Basic tutor profile"],
  },
  {
    name: "Pro Tutor",
    price: `$${PRO_PRICES.tutor}`,
    plan: "pro",
    role: "tutor",
    features: ["Unlimited tuition posts", "Verified Pro badge", "Priority listing", "Full applicant management"],
    popular: true,
  },
];

export default function PricingPage() {
  const router = useRouter();
  const { isAuthenticated, user, ready } = useAuth();
  const [loading, setLoading] = useState<string | null>(null);

  const handleCheckout = async (
    role: "student" | "tutor",
    plan: "free" | "pro",
  ) => {
    if (!ready) return;

    if (plan === "free") {
      if (!isAuthenticated) {
        toast.error("Please sign in to continue");
        router.push("/sign-in");
        return;
      }

      if (user?.role !== role) {
        toast.error(`This plan is for ${role} accounts only`);
        return;
      }

      router.push(dashboardPathFor(role));
      return;
    }

    if (!isAuthenticated) {
      toast.error("Please sign in before upgrading your plan");
      router.push("/sign-in");

      return;
    }

    if (user?.role !== role) {
      toast.error(`This plan is for ${role} accounts only`);
      return;
    }

    setLoading(role);

    try {
      const data = await apiFetch<{ url: string }>("/payments/checkout", {
        method: "POST",
        auth: true,
      });

      window.location.assign(data.url);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not start checkout");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8faf9] text-slate-900">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-14 sm:px-8 sm:py-20 lg:px-16">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-[#0f9f6e]">
            PRO PLANS
          </span>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-5xl">
            Invest in your <span className="text-[#0f9f6e]">next level</span>
          </h1>
          <p className="mt-4 text-sm leading-7 text-slate-500">
            Choose the plan that fits your goals. Payments are securely processed
            by Stripe and your Pro access activates instantly.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {tiers.map((tier) => {
            const isCurrent =
              ready &&
              isAuthenticated &&
              user?.role === tier.role &&
              (user?.plan || "free") === tier.plan;

            return (
              <article
                key={tier.name}
                className={`relative flex flex-col rounded-3xl border bg-white p-8 ${
                  tier.popular
                    ? "border-[#0f9f6e] shadow-lg shadow-emerald-900/5"
                    : "border-slate-200"
                }`}
              >
                {tier.popular && (
                  <span className="absolute right-6 top-6 inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-[#0f9f6e]">
                    <Sparkles className="h-3 w-3" /> Most popular
                  </span>
                )}

                <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
                  {tier.role}
                </p>
                <h2 className="mt-2 text-xl font-extrabold text-slate-900">{tier.name}</h2>
                <p className="mt-5 text-4xl font-extrabold text-[#0f9f6e]">
                  {tier.price}
                  {tier.plan === "pro" && (
                    <span className="text-sm font-medium text-slate-400"> / one-time</span>
                  )}
                </p>

                <ul className="mt-7 flex-1 space-y-3">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3 text-sm text-slate-600">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-50">
                        <Check className="h-3 w-3 text-[#0f9f6e]" />
                      </span>
                      {feature}
                    </li>
                  ))}
                </ul>

                <button
                  type="button"
                  disabled={isCurrent || loading !== null}
                  onClick={() =>
                    handleCheckout(
                      tier.role as "student" | "tutor",
                      tier.plan as "free" | "pro",
                    )
                  }
                  className={`mt-8 rounded-full px-6 py-3.5 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-60 ${
                    tier.popular
                      ? "bg-[#0f9f6e] text-white hover:bg-[#087a54]"
                      : "border border-slate-200 text-slate-700 hover:border-[#0f9f6e] hover:text-[#0f9f6e]"
                  }`}
                >
                  {isCurrent
                    ? "Your current plan"
                    : loading === tier.role
                      ? "Opening Stripe…"
                      : tier.plan === "pro"
                        ? `Subscribe with Stripe · ${tier.price}`
                        : "Continue for free"}
                </button>
              </article>
            );
          })}
        </div>

        <p className="mt-10 text-center text-xs text-slate-400">
          Need help choosing? <Link href="/#how-it-works" className="font-semibold text-[#0f9f6e]">See how MentorLagbe works</Link>
        </p>
      </main>

      <Footer />
    </div>
  );
}
