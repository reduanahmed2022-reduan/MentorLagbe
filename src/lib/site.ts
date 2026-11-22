// Vercel exposes VERCEL_URL automatically at build time, so canonical URLs and
// the sitemap follow the real deployment origin without any manual config.
const vercelOrigin = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL.replace(/^https?:\/\//, "").replace(/\/$/, "")}`
  : "";

export const SITE_URL = vercelOrigin || "http://localhost:3000";
