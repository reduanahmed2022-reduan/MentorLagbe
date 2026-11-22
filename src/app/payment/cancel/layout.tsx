import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "Payment Cancelled | MentorLagbe" },
  robots: { index: false, follow: false },
};

export default function PaymentCancelLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}
