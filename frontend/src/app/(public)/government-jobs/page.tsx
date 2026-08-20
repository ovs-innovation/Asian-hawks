"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { SectionHeader } from "@/components/platform/section-header";
import { GOV_JOBS_PREVIEW } from "@/lib/platform-data";

function GovJobsContent() {
  const params = useSearchParams();
  const keyword = params.get("keyword")?.toLowerCase() || "";
  const filtered = GOV_JOBS_PREVIEW.filter(
    (j) => !keyword || j.title.toLowerCase().includes(keyword) || j.org.toLowerCase().includes(keyword)
  );

  return (
    <div className="mx-auto w-full max-w-[var(--max-w)] px-5 py-10">
      <SectionHeader title="Government Jobs" subtitle="SSC, Railway, Banking, PSU & state recruitment" />
      <div className="overflow-hidden rounded-[var(--radius)] border border-[var(--border)] bg-[var(--card)]">
        {filtered.map((j) => (
          <div key={j.title} className="flex flex-col gap-3 border-b border-[var(--border)] px-5 py-5 last:border-b-0 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[16px] font-semibold text-[var(--text)]">{j.title}</p>
              <p className="mt-1 text-[14px] text-[var(--text-secondary)]">{j.org}</p>
              <p className="mt-1 text-[13px] text-[var(--text-secondary)]">Qualification: {j.qualification} · {j.location}</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-md bg-emerald-50 px-3 py-1 text-[13px] font-semibold text-[var(--primary)]">{j.vacancies.toLocaleString()} vacancies</span>
              <span className="text-[13px] font-medium text-red-600">Last date: {j.lastDate}</span>
              <Link href="/contact" className="rounded-lg bg-[var(--primary)] px-4 py-2 text-[13px] font-semibold text-white hover:bg-[var(--primary-hover)]">
                Enquire
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function GovernmentJobsPage() {
  return (
    <Suspense>
      <GovJobsContent />
    </Suspense>
  );
}
