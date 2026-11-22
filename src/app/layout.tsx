
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import { SITE_URL } from "@/lib/site";
import "./globals.css";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "MentorLagbe | Find Your Perfect Tutor",
    template: "%s | MentorLagbe",
  },
  description:
    "Find experienced tutors, explore subjects, and book personalized home or online tuition with MentorLagbe.",
  openGraph: {
    siteName: "MentorLagbe",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="min-h-screen flex flex-col antialiased">
        {children}
        <Toaster
          position="top-center"
          richColors
          closeButton
          toastOptions={{ duration: 3500 }}
        />
      </body>
    </html>
  );
}
