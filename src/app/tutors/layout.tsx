import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: "Find Tutors | MentorLagbe" },
  description:
    "Find experienced tutors on MentorLagbe and compare subjects, qualifications, locations, and reviews to book the right lessons for you.",
  alternates: {
    canonical: `${SITE_URL}/tutors`,
  },
};

export default function TutorsLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}
