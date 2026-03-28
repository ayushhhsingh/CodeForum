import Link from "next/link";

export default function UsersPage() {
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="text-3xl font-semibold">Users</h1>
      <p className="text-neutral-600 dark:text-neutral-300">
        Open a user profile with a URL like
        {" "}
        <code>/users/&lt;userId&gt;/&lt;userSlug&gt;</code>.
      </p>
      <Link
        href="/"
        className="rounded-full border border-current px-5 py-2.5 font-medium transition hover:bg-white/10"
      >
        Back Home
      </Link>
    </main>
  );
}
