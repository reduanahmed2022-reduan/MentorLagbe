# 🎓 MentorLagbe — Client

> **Smart tuition & mentorship, made personal.**  
> A polished, role-based tuition marketplace built with the Next.js App Router. Students discover and apply for tuitions, tutors publish listings and manage applicants, and admins moderate the whole platform.

[![Next.js](https://img.shields.io/badge/Next.js-16.4.6-000000?logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.3.0-149eca?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.3.3-06b6d4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Live Demo](https://img.shields.io/badge/Live-Demo-0f9f6e?logo=vercel&logoColor=white)](https://mentorlagbe-client-weld.vercel.app)

---

## 🔗 Assignment Links

| What | Link |
| --- | --- |
| 🌐 **Live Website (Vercel)** | **https://mentorlagbe-client-weld.vercel.app** |
| ⚙️ Live REST API (Render) | https://mentorlagbe-server-q3fr.onrender.com/api |
| 💻 Client GitHub Repository | https://github.com/reduanahmed2022-reduan/MentorLagbe |
| 🖥️ Server GitHub Repository | https://github.com/reduanahmed2022-reduan/MentorLagbe-Server |
| 📮 Contact | reduanahmed@gmail.com |

---

## 🔑 Demo Login (Admin)

| Role | Email | Password |
| --- | --- | --- |
| **Admin** | `admin@mentorlagbe.com` | `Admin@12345` |
| Tutor | `sarah@mentorlagbe.com` | `Tutor@12345` |
| Student | `student1@mentorlagbe.com` | `Tutor@12345` |

> Admin panel: **https://mentorlagbe-client-weld.vercel.app/dashboard/admin**

---

## ✅ Assignment Requirements Coverage

| Requirement | Status | Where |
| --- | --- | --- |
| Next.js **App Router** + TypeScript | ✅ | `src/app/`, `tsconfig.json` |
| Tailwind CSS responsive UI | ✅ | `src/app/globals.css` |
| Express + MongoDB REST backend | ✅ | separate [server repo](https://github.com/reduanahmed2022-reduan/MentorLagbe-Server) |
| BetterAuth (+ MongoDB adapter) in stack | ✅ | `src/lib/better-auth.ts`, server `config/betterAuth.js` |
| Google sign-up / sign-in | ✅ | `GET /api/auth/google/start` → `/auth/google/callback` |
| JWT bearer auth for REST routes | ✅ | `src/lib/api.ts`, `src/lib/auth.ts` |
| Stripe Checkout (Student $10 / Tutor $15) | ✅ | `/pricing`, `/payment/success` |
| ImgBB image upload | ✅ | tutor tuition form → server `/api/upload/image` |
| Student / Tutor / Admin dashboards | ✅ | `src/app/(dashboard)/dashboard/` |
| Live deployment | ✅ | Vercel (client) + Render (API) |
| README with live URL, credentials, features, packages | ✅ | this file |
| Version control history | ✅ | 50+ meaningful client commits |

---

## ✨ Features

- **Role-based experience** — separate dashboards, navigation and protected routes for students, tutors and admins.
- **Tuition discovery** — search, filter by subject / class / mode / location / fee, sort, paginate, and view details.
- **Applications** — students apply with schedule & notes and track status; tutors review and accept/reject applicants.
- **Tutor tools** — post, edit and close tuitions; upload banners through the ImgBB-backed API.
- **Admin tools** — manage users and roles, approve/reject tuitions, inspect payment transactions and stats.
- **Authentication** — email/password with JWT, plus Google OAuth bridged into the same session contract.
- **Pro plans** — Stripe one-time upgrades ($10 student / $15 tutor) with success and cancel pages.
- **Sharing & SEO** — LinkedIn / X / Facebook share buttons + copy-link on detail pages, generated OG image, sitemap and robots.
- **Polished states** — sonner toasts, loading screens, error boundary, custom 404, responsive mobile layout.

---

## 🧱 Tech Stack & npm Packages

### Dependencies

| Package | Version | Purpose |
| --- | --- | --- |
| `next` | `16.4.6` | App Router framework |
| `react` / `react-dom` | `19.3.0` | UI runtime |
| `better-auth` | `^1.7.27` | BetterAuth client |
| `tailwindcss` | `4.3.3` | Utility CSS |
| `@tailwindcss/turbopack` | `4.3.3` | Tailwind build integration |
| `lucide-react` | `^1.75.0` | Icons |
| `sonner` | `^2.0.8` | Toast notifications |
| `styled-components` | `^6.6.0` | Component styling |

### Dev dependencies

`@types/node`, `@types/react`, `@types/react-dom`, `@types/styled-components`, `eslint`, `eslint-config-next`, `typescript`.

---

## 🚀 Quick Start (বাংলা)

```bash
# 1. Install dependencies
npm install

# 2. Create the environment file (this is the ONLY client env var)
copy .env.local.example .env.local
#    NEXT_PUBLIC_API_URL=http://localhost:5000/api

# 3. Start the app
npm run dev
```

Open **http://localhost:3000**. For full functionality, run the [server](https://github.com/reduanahmed2022-reduan/MentorLagbe-Server) on port `5000` and seed it once with `npm run seed`.

### Available scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Development server on port 3000 |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run lint` | ESLint checks |

---

## 🔐 Environment Variables

The client needs **exactly one** variable:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Production value: `https://mentorlagbe-server-q3fr.onrender.com/api`

> ⚠️ Never add `BETTER_AUTH_SECRET`, `GOOGLE_CLIENT_SECRET`, Stripe or ImgBB keys here. Those are **server-only**. Google availability is discovered at runtime via `GET /api/auth/google/status`.

---

## 🔄 Authentication Flow

1. **Email / password** → `POST /api/auth/login` returns a JWT; stored in `localStorage` and sent as `Authorization: Bearer <token>`. A `401` signs the user out automatically.
2. **Google** → the button performs a **top-level navigation** to `GET /api/auth/google/start?role=student|tutor`. The API sets the BetterAuth state cookie, redirects to Google, then converts the session to the same JWT and returns to `/auth/google/callback`. Errors also finish on the client origin — never on the API domain.

---

## 📁 Project Structure

```text
client/
├── public/
│   ├── og-image.png              # 1200×630 social preview
│   └── hero-*.svg / tutor images
├── src/
│   ├── app/
│   │   ├── (dashboard)/dashboard/  # student, tutor, admin areas
│   │   ├── auth/google/callback/   # Google OAuth landing page
│   │   ├── payment/{success,cancel}/
│   │   ├── pricing/ sign-in/ sign-up/ forgot-password/
│   │   ├── tutors/ tuitions/       # listings + [id] detail pages
│   │   ├── terms/ privacy/
│   │   ├── layout.tsx              # metadata, Open Graph, Twitter card
│   │   ├── sitemap.ts robots.ts
│   │   └── error.tsx loading.tsx not-found.tsx
│   ├── components/
│   │   ├── auth/                   # GoogleButton
│   │   ├── dashboard/              # shell, navbar, stats, badges
│   │   ├── home/                   # featured tutors/tuitions, highlights
│   │   ├── shared/                 # Navbar, Footer, Logo, ShareButtons
│   │   └── tuitions/               # post + apply forms
│   ├── hooks/useAuth.ts
│   └── lib/{api,auth,better-auth,constants,site,types}.ts
├── .env.local.example
└── package.json
```

---

## 🚀 Deployment

1. Deploy the [server](https://github.com/reduanahmed2022-reduan/MentorLagbe-Server) first (Render) and note its base URL.
2. Import this folder into Vercel and set `NEXT_PUBLIC_API_URL=https://mentorlagbe-server-q3fr.onrender.com/api`.
3. On the server, set `CLIENT_URL=https://mentorlagbe-client-weld.vercel.app` so CORS and Stripe redirects use the correct origin.
4. Push to `main` — Vercel auto-deploys.

---

## 📄 License

Private project — all rights reserved. Built with 💚 for the MentorLagbe assignment.
