import type { Metadata } from "next";
import Navbar from "@/components/shared/Navbar";
import DashboardShell from "@/components/dashboard/DashboardShell";

export const metadata: Metadata = {
  title: "Dashboard | MentorLagbe",
  robots: { index: false, follow: false },
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <DashboardShell>{children}</DashboardShell>
    </>
  );
}
