import Link from "next/link";
import Footer from "@/components/shared/Footer";
import Navbar from "@/components/shared/Navbar";

export default function PaymentCancelPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#f8faf9]">
      <Navbar />
      <main className="mx-auto flex max-w-xl flex-1 items-center px-6 py-20">
        <div className="w-full rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <p className="text-5xl">🙂</p>
          <h1 className="mt-6 text-2xl font-extrabold text-slate-900">
            Checkout cancelled
          </h1>
          <p className="mt-3 text-sm leading-7 text-slate-500">
            No charge was made. You can keep exploring tuitions and upgrade
            whenever you&apos;re ready.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/pricing"
              className="rounded-full bg-[#0f9f6e] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#087a54]"
            >
              Back to pricing
            </Link>
            <Link
              href="/tuitions"
              className="rounded-full border border-slate-200 px-6 py-3 text-sm font-bold text-slate-700 transition hover:border-[#0f9f6e] hover:text-[#0f9f6e]"
            >
              Browse tuitions
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
