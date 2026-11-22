import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site";

type Props = {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;

  return {
    title: { absolute: "Tuition Details | MentorLagbe" },
    description: "Approved tuition details, schedules, fees and application options on MentorLagbe.",
    alternates: { canonical: `${SITE_URL}/tuitions/${id}` },
  };
}

export default function TuitionDetailLayout({ children }: Props) {
  return children;
}
