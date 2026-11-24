import Link from "next/link";
import { Check, Sparkles } from "lucide-react";
import { PRO_PRICES } from "@/lib/constants";

const plans = [
  {
    title: "Free Tutor",
    price: "$0",
    role: "tutor",
    highlight: false,
    features: ["Post up to 2 tuitions", "Manage applications", "Basic profile"],
  },
  {
    title: "Pro Tutor",
    price: `$${PRO_PRICES.tutor}`,
    role: "tutor",
    highlight: true,
    features: ["Unlimited tuition posts", "Pro badge on profile", "Full applicant management"],
  },
  {
    title: "Pro Student",
    price: `$${PRO_PRICES.student}`,
    role: "student",
    highlight: true,
    features: ["All tuition details", "Pro badge on profile", "Monthly Pro subscription"],
  },
];

export default function PricingPreview() {
  return (
    <section className="bg-[#f8faf9] py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-16">
        <div className="text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-[#0f9f6e]">
            PRICING
          </span>
          <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-[#111827] sm:text-3xl">
            Simple plans for every learner
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-slate-500">
            Start for free. Upgrade when you need more reach, more bookings and
            more ways to grow.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.title}
              className={`flex h-full flex-col rounded-2xl border bg-white p-7 ${
                plan.highlight
                  ? "border-[#0f9f6e] shadow-lg shadow-emerald-900/5"
                  : "border-slate-200"
              }`}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-extrabold text-slate-900">{plan.title}</h3>
                {plan.highlight && (
                  <Sparkles className="h-5 w-5 text-[#0f9f6e]" />
                )}
              </div>
              <p className="mt-4 text-3xl font-extrabold text-[#0f9f6e]">
                {plan.price}
                <span className="text-sm font-medium text-slate-400"> / month</span>
              </p>
              <ul className="mt-6 flex-1 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm text-slate-600">
                    <Check className="h-4 w-4 text-[#0f9f6e]" /> {feature}
                  </li>
                ))}
              </ul>
              <Link
                href="/pricing"
                className={`mt-7 rounded-full px-5 py-3 text-center text-sm font-semibold transition ${
                  plan.highlight
                    ? "bg-[#0f9f6e] text-white hover:bg-[#087a54]"
                    : "border border-slate-200 text-slate-700 hover:border-[#0f9f6e] hover:text-[#0f9f6e]"
                }`}
              >
                See details
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
