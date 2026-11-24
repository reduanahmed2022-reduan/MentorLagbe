import Link from "next/link";

export default function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link href="/" className="group flex shrink-0 items-center gap-2.5" aria-label="MentorLagbe home">
      <span className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-[#0f9f6e] text-white shadow-md transition group-hover:bg-[#087a54]">
        <svg
          className="h-6 w-6 fill-white"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M12 3L1 9l11 6 9-4.917V15h2V9L12 3zM5 13.188V17c0 2.21 3.134 4 7 4s7-1.79 7-4v-3.812L12 16.5 5 13.188z" />
        </svg>
      </span>
      <span
        className={`text-lg font-extrabold tracking-tight sm:text-xl ${
          light ? "text-white" : "text-[#111827]"
        }`}
      >
        Mentor<span className={light ? "text-emerald-300" : "text-[#0f9f6e]"}>Lagbe</span>
      </span>
    </Link>
  );
}
