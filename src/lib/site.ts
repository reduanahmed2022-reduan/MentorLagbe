// Canonical origin for metadata, canonical links, sitemap and robots.
// Prefer the fixed production domain: Vercel's VERCEL_URL can point at a stale
// deployment alias, which would make shared OG images and canonicals resolve
// to an unreachable host. Preview deployments intentionally use the same
// canonical production URL so search engines index one location.
const PRODUCTION_URL = "https://mentorlagbe-client-weld.vercel.app";

const vercelOrigin = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL.replace(/^https?:\/\//, "").replace(/\/$/, "")}`
  : "";

export const SITE_URL =
  process.env.NODE_ENV === "production"
    ? PRODUCTION_URL
    : vercelOrigin || "http://localhost:3000";
