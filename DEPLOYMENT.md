# Deployment Checklist — MentorLagbe Client

Next.js 16 App Router frontend. Deploy to Vercel.

## Vercel setup

- Framework preset: **Next.js**. Build command: `npm run build`. Start command: `npm start`. Node **>= 20.19.0**.
- Set this environment variable for **Production** and **Preview**, then redeploy:

  ```env
  NEXT_PUBLIC_API_URL=https://<your-server-host>/api
  ```

  No trailing slash. `.env.local` is gitignored, so it is not uploaded to Vercel.
- The client sets no BetterAuth env vars: it derives the endpoint as `<NEXT_PUBLIC_API_URL>/better-auth` (the API's `/api/better-auth`). Never add `BETTER_AUTH_SECRET` or `BETTER_AUTH_URL` in Vercel — both are server-only.
- No `next.config` rewrites are needed. Every API call uses the absolute `NEXT_PUBLIC_API_URL`.
- Test direct visits and hard refreshes of `/`, `/tutors`, `/tutors/[id]`, `/tuitions`, `/tuitions/[id]`, `/pricing`, `/sign-in`, `/sign-up`, `/payment/success`, and every `/dashboard/*` route.
- Public route groups and `(dashboard)` do not appear in URLs.

## Common checks

- CORS: the server `CLIENT_URL` must include the exact Vercel origin.
- A `401` from the API clears the local session and redirects to `/sign-in`.
- Stripe returns to `<client-origin>/payment/success?session_id=...`; the page verifies the session through the API.
- Image uploads complete without a 504 (server-side ImgBB key must be set).
- Reloading a protected route does not log the user out while the JWT is valid.

## Demo accounts

After running `npm run seed` on the server:

| Role | Email | Password |
|---|---|---|
| Admin | `admin@mentorlagbe.com` | `Admin@12345` |
| Tutor | `sarah@mentorlagbe.com` | `Tutor@12345` |
| Student | `student1@mentorlagbe.com` | `Tutor@12345` |
