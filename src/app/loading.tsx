export default function Loading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f8faf9] px-6">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0f9f6e]/10">
          <span className="h-6 w-6 animate-spin rounded-full border-2 border-[#0f9f6e]/25 border-t-[#0f9f6e]" />
        </div>
        <p className="mt-5 text-center text-sm font-semibold text-slate-700">
          Preparing your learning space…
        </p>
        <div className="mt-6 space-y-3">
          <div className="h-3 w-full animate-pulse rounded-full bg-slate-100" />
          <div className="h-3 w-4/5 animate-pulse rounded-full bg-slate-100" />
          <div className="h-3 w-2/3 animate-pulse rounded-full bg-slate-100" />
        </div>
      </div>
    </main>
  );
}
