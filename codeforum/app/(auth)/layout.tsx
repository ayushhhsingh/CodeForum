"use client";

import { useAuthStore } from "@/app/store/auth";
import { useRouter } from "next/navigation";
import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { session, hydrated } = useAuthStore();
  const router = useRouter();

  React.useEffect(() => {
    if (hydrated && session) {
      router.replace("/");
    }
  }, [hydrated, session, router]);

  if (!hydrated || session) {
    return null;
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">{children}</div>
    </div>
  );
};

export default Layout;
