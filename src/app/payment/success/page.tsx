"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import Footer from "@/components/shared/Footer";
import Navbar from "@/components/shared/Navbar";
import { apiFetch } from "@/lib/api";
import { getStoredUser, updateStoredUser } from "@/lib/auth";

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [status, setStatus] = useState<
    "verifying" | "done" | "failed" | "pending"
  >(sessionId ? "verifying" : "failed");

  useEffect(() => {
    if (!sessionId) return;

    apiFetch<{ success: boolean; plan?: "free" | "pro" }>("/payments/verify", {
      method: "POST",
      auth: true,
      body: { sessionId },
    })
      .then((data) => {
        setStatus(data.success ? "done" : "failed");

        if (data.success) {
          const storedUser = getStoredUser();

          if (storedUser && data.plan) {
            updateStoredUser({ ...storedUser, plan: data.plan });
          }

          toast.success("Pro plan activated. Welcome aboard!");
        }
      })
      .catch((error: unknown) => {
        setStatus(
          error instanceof Error &&
            error.message === "Payment is not completed yet"
            ? "pending"
            : "failed"
        );
      });
  }, [sessionId]);

  return (
    <main className="mx-auto flex max-w-xl flex-1 items-center px-6 py-20">
      <div className="w-full rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
        {status === "verifying" ? (
          <>
            <Loader2 className="mx-auto h-12 w-12 animate-spin text-[#0f9f6e]" />
            <h1 className="mt-6 text-2xl font-extrabold text-slate-900">
              Confirming your payment…
            </h1>
            <p className="mt-3 text-sm text-slate-500">
              This takes just a moment. Please don&apos;t close this page.
            </p>
          </>
        ) : status === "done" ? (
          <>
            <CheckCircle2 className="mx-auto h-14 w-14 text-[#0f9f6e]" />
            <h1 className="mt-6 text-2xl font-extrabold text-slate-900">
              Payment successful!
            </h1>
            <p className="mt-3 text-sm leading-7 text-slate-500">
              Your Pro plan is now active. Refresh your dashboard to see your
              new benefits.
            </p>
          </>
        ) : (
          <>
            <p className="text-5xl">⏳</p>
            <h1 className="mt-6 text-2xl font-extrabold text-slate-900">
              {status === "pending"
                ? "Payment still processing"
                : "We couldn't confirm this payment yet"}
            </h1>
            <p className="mt-3 text-sm leading-7 text-slate-500">
              {status === "pending" ? (
                "Your payment is still being processed. Please refresh in a moment."
              ) : (
                <>
                  If you completed the checkout, your plan will be activated by
                  the Stripe webhook shortly. Contact support if it doesn&apos;t
                  update.
                </>
              )}
            </p>
          </>
        )}

        <Link
          href="/dashboard/profile"
          className="mt-8 inline-flex rounded-full bg-[#0f9f6e] px-7 py-3 text-sm font-bold text-white transition hover:bg-[#087a54]"
        >
          Go to my dashboard
        </Link>
      </div>
    </main>
  );
}

export default function PaymentSuccessPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#f8faf9]">
      <Navbar />
      <Suspense fallback={<SuccessSkeleton />}>
        <SuccessContent />
      </Suspense>
      <Footer />
    </div>
  );
}

function SuccessSkeleton() {
  return (
    <main className="mx-auto flex max-w-xl flex-1 items-center px-6 py-20">
      <div className="h-64 w-full animate-pulse rounded-3xl border border-slate-100 bg-white" />
    </main>
  );
}
