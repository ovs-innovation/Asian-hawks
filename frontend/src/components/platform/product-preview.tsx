"use client";

import Link from "next/link";
import { Bell, BookOpen, Briefcase, FileText, TrendingUp } from "lucide-react";
import { PLATFORM_STATS } from "@/lib/platform-data";
import { formatSalary } from "@/lib/utils";
import { useJobs } from "@/hooks/use-jobs";
import { DEMO_TENDERS, DEMO_COURSES } from "@/lib/platform-data";

export function ProductPreview() {
  const { data: jobs = [] } = useJobs();
  const job = jobs[0];
  const tender = DEMO_TENDERS[0];
  const course = DEMO_COURSES[0];

  return (
    <div className="rounded-[var(--radius)] border border-[var(--border)] bg-[var(--card)]/95 p-5 shadow-[0_8px_32px_rgba(27,27,27,0.12)] backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <p className="text-[13px] font-semibold text-[var(--text)]">Your dashboard preview</p>
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-[var(--primary)]">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--secondary)]" />
          Live
        </span>
      </div>

      <div className="mt-4 space-y-2.5">
        {job && (
          <Link
            href={`/jobs/${job.slug}`}
            className="flex items-start gap-3 rounded-lg border border-[var(--border)] bg-[var(--bg)]/50 p-3 transition-colors hover:border-[var(--primary)]"
          >
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-emerald-50">
              <Briefcase size={15} className="text-[var(--primary)]" />
            </span>
            <div className="min-w-0">
              <p className="truncate text-[13px] font-semibold text-[var(--text)]">{job.title}</p>
              <p className="text-[12px] text-[var(--text-secondary)]">
                {job.location} · {formatSalary(job.minSalary, job.maxSalary, job.currency)}
              </p>
            </div>
          </Link>
        )}

        <Link
          href={`/tenders/${tender.slug}`}
          className="flex items-start gap-3 rounded-lg border border-[var(--border)] bg-[var(--bg)]/50 p-3 transition-colors hover:border-[var(--primary)]"
        >
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-teal-50">
            <FileText size={15} className="text-[var(--accent)]" />
          </span>
          <div className="min-w-0">
            <p className="truncate text-[13px] font-semibold text-[var(--text)]">Tender closing soon</p>
            <p className="text-[12px] text-[var(--text-secondary)]">
              {tender.department} · {tender.value}
            </p>
          </div>
        </Link>

        <Link
          href={`/courses/${course.slug}`}
          className="flex items-start gap-3 rounded-lg border border-[var(--border)] bg-[var(--bg)]/50 p-3 transition-colors hover:border-[var(--primary)]"
        >
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-emerald-50">
            <BookOpen size={15} className="text-[var(--secondary)]" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-semibold text-[var(--text)]">Course progress</p>
            <p className="text-[12px] text-[var(--text-secondary)]">{course.title} — 68%</p>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[var(--border)]">
              <div className="h-full w-[68%] rounded-full bg-[var(--primary)]" />
            </div>
          </div>
        </Link>

        <div className="flex items-center gap-2 rounded-lg bg-emerald-50/80 px-3 py-2.5">
          <Bell size={14} className="text-[var(--primary)]" />
          <p className="text-[12px] text-[var(--text-secondary)]">3 new job matches · 1 tender alert</p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 border-t border-[var(--border)] pt-4">
        {[
          [PLATFORM_STATS.jobs.toLocaleString(), "Jobs"],
          [PLATFORM_STATS.tenders.toLocaleString(), "Tenders"],
          [PLATFORM_STATS.courses.toLocaleString(), "Courses"],
        ].map(([n, l]) => (
          <div key={l} className="rounded-lg bg-[var(--bg)] py-2 text-center">
            <p className="flex items-center justify-center gap-0.5 text-[14px] font-bold text-[var(--primary)]">
              <TrendingUp size={11} />
              {n}
            </p>
            <p className="text-[10px] text-[var(--text-secondary)]">{l}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
