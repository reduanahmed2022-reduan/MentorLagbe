import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site";

type Props = {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;

  return {
    title: { absolute: "Tutor Profile | MentorLagbe" },
    description: "View verified tutor profiles, subjects, rates and reviews on MentorLagbe.",
    alternates: { canonical: `${SITE_URL}/tutors/${id}` },
  };
}

export default function TutorDetailLayout({ children }: Props) {
  return children;
}
