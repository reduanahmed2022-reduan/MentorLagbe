const subjects = [
  { name: "Mathematics", icon: "📐" },
  { name: "Physics", icon: "⚛️" },
  { name: "Programming", icon: "💻" },
  { name: "IELTS", icon: "🌍" },
];

const testimonials = [
  {
    name: "Ayesha K.",
    role: "HSC Student, Dhaka",
    quote:
      "I found a mathematics tutor who actually explains things step by step. My grades improved in just two months.",
  },
  {
    name: "Tanvir R.",
    role: "Programming learner",
    quote:
      "The batch system is brilliant. Regular classes and real projects made learning web development enjoyable.",
  },
  {
    name: "Mrs. Saleha",
    role: "Parent, Chattogram",
    quote:
      "Verified tutors, transparent fees and easy scheduling. MentorLagbe made tuition hunting stress-free.",
  },
];

export default function Highlights() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-8 sm:py-20 lg:px-16">
      <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#0f9f6e]">
            POPULAR SUBJECTS
          </span>
          <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-[#111827] sm:text-3xl">
            Learn what matters to you
          </h2>
          <div className="mt-8 grid grid-cols-2 gap-4">
            {subjects.map((subject) => (
              <div
                key={subject.name}
                className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-1"
              >
                <span className="text-2xl">{subject.icon}</span>
                <p className="mt-3 text-sm font-bold text-slate-800">{subject.name}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 grid grid-cols-3 gap-4 rounded-3xl bg-[#0c2b2a] p-6 text-center text-white">
            <div>
              <p className="text-2xl font-extrabold text-emerald-300">500+</p>
              <p className="mt-1 text-xs text-slate-300">Verified tutors</p>
            </div>
            <div>
              <p className="text-2xl font-extrabold text-emerald-300">12k+</p>
              <p className="mt-1 text-xs text-slate-300">Happy students</p>
            </div>
            <div>
              <p className="text-2xl font-extrabold text-emerald-300">40+</p>
              <p className="mt-1 text-xs text-slate-300">Subjects</p>
            </div>
          </div>
        </div>

        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#0f9f6e]">
            TESTIMONIALS
          </span>
          <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-[#111827] sm:text-3xl">
            Loved by learners
          </h2>
          <div className="mt-8 space-y-4">
            {testimonials.map((item) => (
              <blockquote
                key={item.name}
                className="rounded-2xl border border-slate-200 bg-white p-6"
              >
                <div className="mb-2 text-amber-400">★★★★★</div>
                <p className="text-sm leading-7 text-slate-600">“{item.quote}”</p>
                <footer className="mt-4 text-xs font-bold text-slate-800">
                  {item.name} <span className="font-normal text-slate-400">· {item.role}</span>
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
