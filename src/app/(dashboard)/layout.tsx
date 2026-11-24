import type { Metadata } from "next";
import DashboardNavbar from "@/components/dashboard/DashboardNavbar";
import DashboardShell from "@/components/dashboard/DashboardShell";

export const metadata: Metadata = {
  title: { absolute: "Dashboard | MentorLagbe" },
  robots: { index: false, follow: false },
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <DashboardNavbar />
      <DashboardShell>{children}</DashboardShell>
    </>
  );
}
