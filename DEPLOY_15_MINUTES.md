# 15-Minute Vercel Deployment Runbook — MentorLagbe Client

Next.js 16 App Router frontend. Goal: **15 মিনিটে Production deploy + smoke test**. General setup `DEPLOYMENT.md`-এ আছে; এটা শুধু দ্রুত runbook.

> ⚠️ Client-এ শুধু **একটিই** env var থাকবে: `NEXT_PUBLIC_API_URL`। কোনো secret (Stripe key, ImgBB key, JWT secret) client-এ দেবেন না — সব server-এ থাকবে।

---

## ⏱ 0–2 min — Repo / Root directory

- Vercel → **Add New → Project** → GitHub repo (`MentorLagbe`) import করুন।
- **Root Directory** = `client` (mono-repo হলে অবশ্যই `client`; root-এ `package.json` থাকলে সেটিই বেছে নিন)।
- Framework Preset: **Next.js** · Node **20+** · Build `npm run build` · Start `npm start` (Vercel auto-detect করে)।
- `.env.local` gitignored → Vercel-এ upload হয় না;(env Vercel Dashboard-এই দিতে হবে)।

## ⏱ 2–4 min — Environment variable (শুধু একটি)

Dashboard → Settings → **Environment Variables** → Production **ও** Preview-এ যোগ করুন:

```env
NEXT_PUBLIC_API_URL=https://<your-server-host>/api
```

- শেষে **`/` (trailing slash) দেবেন না** — `.../api` ✅, `.../api/` ❌।
- Placeholder `<your-server-host>`-এ আপনার আসল API host বসান; এখানে real secret/key লিখবেন না।

**🔑 NEXT_PUBLIC_* কেন আগে দিতে হবে:**
`NEXT_PUBLIC_` দিয়ে শুরু হওয়া ভ্যারিয়েবলগুলো **build-time-এ JavaScript bundle-এ inline (hard-code) হয়ে যায়**, runtime-এ Vercel Settings-এ বদলালে তাৎক্ষণিক প্রভাব পড়ে না। তাই **env changed → redeploy (Deployments → ⋯ → Redeploy, "Use existing Build Cache" বন্ধ করে)** করতেই হবে। Build-এর আগে ভ্যারিয়েবল সেট করা আছে কিনা নিশ্চিত করুন।

## ⏱ 4–7 min — Build

- Deploy চালান; **Build Logs** খুলে রাখুন।
- ✅ এগুলো দেখতে পাবেন: `Creating an optimized production build`, `Compiled successfully`, `Collecting page data`, `Generating static pages`।
- ❌ Fail হলে: Node version 20+, Root Directory `client`, `npm install` errors, অথবা build-এ env না পাওয়া — এগুলো চেক করুন, তারপর Redeploy।

## ⏱ 7–10 min — Route reload / direct-visit checks

Deployed URL-এ **প্রত্যেক route-এ সরাসরি যান + Hard refresh (Ctrl/Cmd+Shift+R)** দিন — 404 বা blank page চলবে না:

| Route | চেক |
|---|---|
| `/` | Home load |
| `/tutors` | Tutor list |
| `/tutors/[id]` | Tutor detail (valid id) |
| `/tuitions` | Tuition list |
| `/tuitions/[id]` | Tuition detail |
| `/pricing` | Pricing page |
| `/sign-in` / `/sign-up` | Auth pages |
| `/payment/success` | Return page (session_id ছাড়াও খুলতে হবে) |
| `/dashboard/*` | নিচের dashboard Routes |

**Dashboard routes** (`(dashboard)` group URL-এ দেখা যায় না → সব `/dashboard/...`):
`/dashboard`, `/dashboard/profile`, `/dashboard/tutor`, `/dashboard/tutor/post-tuition`, `/dashboard/tutor/my-tuitions`, `/dashboard/tutor/applicants`, `/dashboard/student`, `/dashboard/student/my-applications`, `/dashboard/admin`, `/dashboard/admin/users`, `/dashboard/admin/tuitions`, `/dashboard/admin/transactions`।

> সব protected route-এ direct visit/reload ঠিক থাকতে হবে; route group `(public)`/`(dashboard)` URL-এ যোগ হয় না।

## ⏱ 10–12 min — Sign-in → Dashboard → Payment flow

1. `/sign-in` → demo account দিয়ে login (seed চালানো থাকলে): Student `student1@mentorlagbe.com` / Tutor `sarah@mentorlagbe.com` / Admin `admin@mentorlagbe.com` (SERVER-side `npm run seed` থেকে)। **এখানে real password/share secrets লিখবেন না।**
2. Role-অনুযায়ী `/dashboard/*` খুলুন; JWT valid থাকা অবস্থায় refresh করলে logout হওয়া চলবে না।
3. `/pricing` → checkout → Stripe → **return to `<client-origin>/payment/success?session_id=...`**; পেজটি API দিয়ে session verify করবে (server-side Stripe key)।
4. cancel হলে `/payment/cancel` এ যায় কিনা দেখুন।

## ⏱ 12–15 min — CORS / Stripe return / 401 checks

**DevTools → Network + Console:**

- **CORS:** API response-এ `Access-Control-Allow-Origin` এর সাথে exact Vercel origin (`https://<project>.vercel.app` বা custom domain) মিলতে হবে → server `CLIENT_URL`-এ সেই origin যোগ করুন; client-এ কিছু change নেই (client proxy/rewrite নেই, সব কল absolute `NEXT_PUBLIC_API_URL`-এ যায়)।
- **401 behavior:** expired/invalid token-এ API `401` দিলে local session clear হয়ে **`/sign-in`-এ redirect** হতে হবে; Console-এ red CORS/500 error থাকবে না।
- **Stripe return:** `payment/success`-এ `session_id` সহ আসার পর verify call সফল (200) এবং UI সঠিক অবস্থা দেখায়; server log-এ Stripe webhook/verify error না থাকে।
- **Bonus:** image uploadে 504 না হওয়া (server ImgBB key) — client secret নয়।

---

### Quick recap / মনে রাখুন

1. Client env = **শুধু `NEXT_PUBLIC_API_URL`** (include `/api`, no trailing slash)।
2. `NEXT_PUBLIC_*` **build-time-এ inline** → env বদলালে **অবশ্যই redeploy**।
3. Root Directory = `client`, Node 20+।
4. Direct-hit + hard-refresh সব routes, 401 → `/sign-in`, CORS origin মিল, Stripe → `/payment/success` verify।
5. কোনো real secret কখনো client-এ /এই ডকুমেন্টে লিখবেন না।

*(Detailed background: see `DEPLOYMENT.md`.)*
