"use client";

import { useAuthStore } from "@/store/auth";
import Link from "next/link";

export default function HomeActions() {
  const { hydrated, session } = useAuthStore();

  if (!hydrated) {
    return (
      <div className="flex flex-wrap items-center justify-center gap-3">
        <div className="h-11 w-28 rounded-full bg-white/10" />
        <div className="h-11 w-28 rounded-full bg-white/10" />
      </div>
    );
  }

  if (session) {
    return (
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/questions/ask"
          className="rounded-full bg-orange-500 px-5 py-2.5 font-medium text-white transition hover:bg-orange-600"
        >
          Ask Question
        </Link>
        <Link
          href="/questions"
          className="rounded-full border border-current px-5 py-2.5 font-medium transition hover:bg-white/10"
        >
          Browse Questions
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <Link
        href="/login"
        className="rounded-full bg-orange-500 px-5 py-2.5 font-medium text-white transition hover:bg-orange-600"
      >
        Login
      </Link>
      <Link
        href="/register"
        className="rounded-full border border-current px-5 py-2.5 font-medium transition hover:bg-white/10"
      >
        Register
      </Link>
      <Link
        href="/users"
        className="rounded-full border border-current px-5 py-2.5 font-medium transition hover:bg-white/10"
      >
        Browse Users
      </Link>
    </div>
  );
}
