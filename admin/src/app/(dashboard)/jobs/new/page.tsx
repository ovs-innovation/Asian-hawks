"use client";

import Link from "next/link";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { JobForm } from "@/components/job-form";

function NewJobContent() {
  const sp = useSearchParams();
  const initialCategory = sp.get("category") || undefined;

  return (
    <div className="p-6">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#0f5daa]">Jobs</p>
          <h2 className="mt-1 text-xl font-bold text-[#111827]">Create job posting</h2>
          <p className="mt-1 text-sm text-[#6b7280]">Pick a category, fill the details, then publish it live.</p>
        </div>
        <Link href="/jobs" className="rounded-xl border border-[#e5e7eb] bg-white px-4 py-2 text-sm font-medium text-[#374151] hover:bg-[#f9fafb]">
          Back to jobs
        </Link>
      </div>
      <JobForm initialCategory={initialCategory} />
    </div>
  );
}

export default function NewJobPage() {
  return (
    <Suspense>
      <NewJobContent />
    </Suspense>
  );
}
