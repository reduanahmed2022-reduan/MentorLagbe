import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Browse Tuitions | MentorLagbe",
  description:
    "Browse verified tuition listings on MentorLagbe, filter by subject, class level, and location, and apply to the teaching opportunities that fit you.",
  alternates: {
    canonical: `${SITE_URL}/tuitions`,
  },
};

export default function TuitionsLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}
