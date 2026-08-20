import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-5 py-16 text-center">
      <p className="text-sm font-semibold text-[var(--primary)]">Page not found</p>
      <h1 className="mt-2 text-3xl font-bold text-[var(--heading)]">This page is not available</h1>
      <p className="mt-3 text-sm text-[var(--text-secondary)]">
        The link may be old. Browse open jobs or go back home.
      </p>
      <div className="mt-6 flex gap-3">
        <Link href="/" className="rounded-lg bg-[var(--primary)] px-5 py-2.5 text-sm font-semibold text-white">
          Home
        </Link>
        <Link href="/jobs" className="rounded-lg border border-[var(--border)] px-5 py-2.5 text-sm font-semibold text-[var(--heading)]">
          Jobs
        </Link>
      </div>
    </div>
  );
}
