# MentorLagbe Client

The Next.js frontend for **MentorLagbe**, a Bangladesh-based tuition and mentorship marketplace. Students can discover and apply for tuitions, tutors can publish listings and manage applicants, and admins can moderate the platform.

## বাংলা কুইক স্টার্ট

১. প্রথমে `npm install` দিয়ে ডিপেন্ডেন্সি ইনস্টল করুন।
২. রুট ফোল্ডারে `.env.local` বানিয়ে লিখুন: `NEXT_PUBLIC_API_URL=http://localhost:5000/api`।
৩. তারপর `npm run dev` চালিয়ে http://localhost:3000 এ অ্যাপ দেখুন।
৪. ডেমো লগইন (প্রথমে server ফোল্ডারে `npm run seed` দিন):
- অ্যাডমিন: `admin@mentorlagbe.com` / `Admin@12345`
- টিউটর: `sarah@mentorlagbe.com` / `Tutor@12345`
- স্টুডেন্ট: `student1@mentorlagbe.com` / `Tutor@12345`
৫. CORS সমস্যা এড়াতে server-এ `CLIENT_URL` ঠিক `http://localhost:3000` রাখতে হবে।

## Live URL

`https://<your-vercel-app>.vercel.app`

> Replace the placeholder above with your deployed Vercel URL.

## Tech Stack

- **Framework:** Next.js 16.4.6 (App Router)
- **UI:** React 19.3.0, TypeScript, Tailwind CSS 4.3.3
- **Icons & toasts:** lucide-react, sonner
- **Auth / styling libraries:** better-auth, styled-components
- **API:** Express REST API (separate `server` project)

## Getting Started

### Prerequisites

- Node.js and npm
- The MentorLagbe API server running locally (see the `server` project)

### Installation

```bash
npm install
```

Copy the environment example and keep the default local API URL:

```bash
# macOS / Linux
cp .env.local.example .env.local

# Windows (PowerShell)
copy .env.local.example .env.local
```

`.env.local` should contain:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

If `.env.local.example` is not present in your checkout, create `.env.local` with the value above. The app also falls back to `http://localhost:5000/api` when the variable is unset.

### Run and verify

```bash
npm run dev     # Start the development server at http://localhost:3000
npm run build   # Create a production build
npm run lint    # Run ESLint
npm start       # Serve the production build (after npm run build)
```

## Demo Credentials

From `server/seedDemoData.js`. Seed the database from the **server** directory first:

```bash
cd ../server
npm run seed
```

| Role | Email | Password |
| --- | --- | --- |
| Admin | `admin@mentorlagbe.com` | `Admin@12345` |
| Tutor | `sarah@mentorlagbe.com` | `Tutor@12345` |
| Tutor | `rahim@mentorlagbe.com` | `Tutor@12345` |
| Tutor | `nusrat@mentorlagbe.com` | `Tutor@12345` |
| Tutor | `sabbir@mentorlagbe.com` | `Tutor@12345` |
| Tutor | `ayesha@mentorlagbe.com` | `Tutor@12345` |
| Tutor | `tanvir@mentorlagbe.com` | `Tutor@12345` |
| Student | `student1@mentorlagbe.com` | `Tutor@12345` |
| Student | `student2@mentorlagbe.com` | `Tutor@12345` |

The admin email/password can be overridden with `ADMIN_EMAIL` and `ADMIN_PASSWORD` in the server environment. The seed script also creates 12 approved tuitions and sample applications. It only inserts missing users, so existing accounts keep their current passwords.

## Key Features

- **Role-based dashboards:** dedicated overviews and navigation for students, tutors, and admins, including profile updates.
- **Authentication:** JWT stored in `localStorage`, sent as a `Bearer` token on protected API requests, with automatic sign-out on `401` responses.
- **Protected routes:** the dashboard shell redirects unauthenticated users to sign-in and sends users to the dashboard for their role; role-specific links keep each area separate.
- **Tuition discovery:** search, filter by subject/class level/mode/location/fee, sorting, and paginated results, plus tuition detail pages.
- **Applications:** students apply to tuitions with schedule and notes, then track application status; tutors review and respond to applicants.
- **Tutor tools:** create, edit, and delete tuition posts, upload images through the server's ImgBB-backed endpoint, and review incoming applicants.
- **Admin tools:** manage users and roles, approve or reject tuitions, and review payment transactions.
- **Pro plans:** Stripe checkout for one-time upgrades — **$15 for tutors** and **$10 for students** — with success/cancel return pages.
- **Public experience:** featured mentors/tuitions on the home page, tutor browsing, pricing, terms, privacy, and password recovery flows.
- **Feedback and states:** sonner toast notifications, loading indicators, inline error handling, and custom loading, error, and 404 pages.

## Folder Structure

```text
client/
├── public/                      # Static assets
├── src/
│   ├── app/
│   │   ├── (dashboard)/dashboard/# Role-protected student, tutor, and admin areas
│   │   ├── payment/             # Stripe success and cancel pages
│   │   ├── pricing/             # Free and Pro plan checkout
│   │   ├── sign-in/             # Authentication pages
│   │   ├── sign-up/
│   │   ├── forgot-password/
│   │   ├── terms/ privacy/      # Legal pages
│   │   ├── tutors/ tuitions/    # Listings and detail pages
│   │   ├── error.tsx            # Global error boundary
│   │   ├── loading.tsx          # Global loading state
│   │   └── not-found.tsx        # Custom 404 page
│   ├── components/
│   │   ├── dashboard/           # Dashboard shell, stat cards, status badges
│   │   ├── home/                # Featured listings, highlights, pricing preview
│   │   ├── shared/              # Navbar, footer, logo, tuition card
│   │   └── tuitions/            # Tuition form and application form
│   ├── hooks/useAuth.ts         # Auth state and session helpers
│   └── lib/
│       ├── api.ts               # API client, Bearer token, image upload
│       ├── auth.ts              # localStorage session utilities
│       ├── constants.ts         # Public filters, pricing, brand config
│       └── types.ts             # Shared TypeScript types
├── .env.local.example           # Environment template
├── next.config.ts
├── tsconfig.json
└── package.json
```

## npm Packages

### Dependencies

| Package | Version |
| --- | --- |
| `better-auth` | `^1.7.27` |
| `lucide-react` | `^1.75.0` |
| `next` | `16.4.6` |
| `react` | `19.3.0` |
| `react-dom` | `19.3.0` |
| `sonner` | `^2.0.8` |
| `styled-components` | `^6.6.0` |

### Development Dependencies

| Package | Version |
| --- | --- |
| `@tailwindcss/turbopack` | `4.3.3` |
| `@types/node` | `^20` |
| `@types/react` | `^19` |
| `@types/react-dom` | `^19` |
| `@types/styled-components` | `^5.1.36` |
| `eslint` | `^9` |
| `eslint-config-next` | `16.4.6` |
| `tailwindcss` | `4.3.3` |
| `typescript` | `^5` |

## Deployment

1. Deploy the API server first and note its base URL.
2. In the Vercel project, set `NEXT_PUBLIC_API_URL` to the **deployed API URL including `/api`** (for example, `https://<your-api-host>/api`). This value is embedded in the client bundle at build time, so redeploy after changing it.
3. On the server, set `CLIENT_URL` to this client's exact origin (for example, `https://<your-vercel-app>.vercel.app`) so CORS allows browser requests to the API. A mismatched origin will cause blocked requests.
4. Run `npm run build` locally or let Vercel build the project; no other client environment variables are required.

## License

Private project. All rights reserved.
