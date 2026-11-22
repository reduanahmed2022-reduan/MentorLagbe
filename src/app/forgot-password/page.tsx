import Link from "next/link";
import Footer from "@/components/shared/Footer";
import Navbar from "@/components/shared/Navbar";
import { BRAND } from "@/lib/constants";

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#f5f7ff]">
      <Navbar />
      <main className="mx-auto flex max-w-lg flex-1 items-center px-6 py-20">
        <div className="w-full rounded-3xl border border-slate-200 bg-white p-9 text-center shadow-sm">
          <p className="text-4xl">🔐</p>
          <h1 className="mt-5 text-2xl font-extrabold text-slate-900">
            Reset your password
          </h1>
          <p className="mt-3 text-sm leading-7 text-slate-500">
            Password recovery is handled by our support team. Write to us from
            your registered email address and we&apos;ll help you get back in.
          </p>
          <a
            href={`mailto:${BRAND.email}?subject=Password%20reset%20request`}
            className="mt-7 inline-flex rounded-full bg-[#0f9f6e] px-7 py-3 text-sm font-bold text-white transition hover:bg-[#087a54]"
          >
            Email support
          </a>
          <p className="mt-5 text-sm">
            <Link href="/sign-in" className="font-semibold text-[#0f9f6e]">
              Back to sign in
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
