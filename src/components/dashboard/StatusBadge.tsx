const styles: Record<string, string> = {
  pending: "bg-amber-50 text-amber-700 ring-amber-200",
  approved: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  accepted: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  active: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  rejected: "bg-rose-50 text-rose-700 ring-rose-200",
  closed: "bg-slate-100 text-slate-600 ring-slate-200",
  free: "bg-slate-100 text-slate-600 ring-slate-200",
  pro: "bg-indigo-50 text-indigo-700 ring-indigo-200",
  student: "bg-sky-50 text-sky-700 ring-sky-200",
  tutor: "bg-violet-50 text-violet-700 ring-violet-200",
  admin: "bg-indigo-50 text-indigo-700 ring-indigo-200",
  paid: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  failed: "bg-rose-50 text-rose-700 ring-rose-200",
};

export default function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold capitalize ring-1 ring-inset ${
        styles[status.toLowerCase()] || "bg-slate-100 text-slate-600 ring-slate-200"
      }`}
    >
      {status}
    </span>
  );
}
