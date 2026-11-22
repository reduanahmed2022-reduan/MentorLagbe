import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "Payment Successful | MentorLagbe" },
  robots: { index: false, follow: false },
};

export default function PaymentSuccessLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}
