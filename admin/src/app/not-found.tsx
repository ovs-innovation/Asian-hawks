"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f7f9fc] px-4">
      <div className="max-w-md rounded-2xl border border-[#e5e7eb] bg-white p-8 text-center">
        <p className="text-sm font-semibold text-[#0f5daa]">Page not found</p>
        <h1 className="mt-2 text-2xl font-bold text-[#111827]">This admin page does not exist</h1>
        <p className="mt-2 text-sm text-[#6b7280]">Use the sidebar to open jobs, users, or settings.</p>
        <div className="mt-6 flex justify-center gap-3">
          <Link href="/" className="rounded-xl bg-[#0f5daa] px-4 py-2 text-sm font-semibold text-white">
            Dashboard
          </Link>
          <Link href="/jobs" className="rounded-xl border border-[#e5e7eb] px-4 py-2 text-sm font-medium text-[#374151]">
            Jobs
          </Link>
        </div>
      </div>
    </div>
  );
}
