"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { dashboardPathFor } from "@/lib/auth";

export default function DashboardIndexPage() {
  const router = useRouter();
  const { user, ready } = useAuth();

  useEffect(() => {
    if (!ready) return;

    if (!user) {
      router.replace("/sign-in");
      return;
    }

    router.replace(dashboardPathFor(user.role));
  }, [ready, user, router]);

  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="text-center">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-indigo-200 border-t-indigo-600" />
        <p className="mt-4 text-sm font-medium text-slate-500">
          Taking you to your dashboard…
        </p>
      </div>
    </div>
  );
}
