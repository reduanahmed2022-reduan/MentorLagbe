import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Pro Plans | MentorLagbe",
  description:
    "Compare MentorLagbe Free and Pro plans, see pricing and benefits, and upgrade to unlock premium tuition features.",
  alternates: {
    canonical: `${SITE_URL}/pricing`,
  },
};

export default function PricingLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}
