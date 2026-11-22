import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f8faf9] px-6">
      <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
        <p className="text-7xl font-extrabold tracking-tight text-[#0f9f6e]">
          404
        </p>
        <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900">
          This page took a different route
        </h1>
        <p className="mx-auto mt-3 max-w-sm text-sm leading-7 text-slate-500">
          The page you&apos;re looking for doesn&apos;t exist or has moved. Let&apos;s
          get you back to finding the right tutor.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex rounded-full bg-[#0f9f6e] px-7 py-3 text-sm font-semibold text-white transition hover:bg-[#087a54]"
        >
          Back to Home
        </Link>
      </div>
    </main>
  );
}
