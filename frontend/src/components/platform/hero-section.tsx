"use client";

import Link from "next/link";
import { Bell, Briefcase, CheckCircle2, FileText, TrendingUp } from "lucide-react";
import { JobSearchBar } from "@/components/platform/job-search-bar";
import { CompanyLogo } from "@/components/company-logo";
import { formatSalary } from "@/lib/utils";
import { useJobs } from "@/hooks/use-jobs";
import { GOV_JOBS_PREVIEW } from "@/lib/platform-data";

function DashboardMockup() {
  const { data: jobs = [] } = useJobs();
  const rows = jobs.slice(0, 3);

  return (
    <div className="relative mx-auto w-full max-w-[520px] lg:max-w-none">
      <div className="absolute -inset-3 rounded-[24px] bg-[var(--primary)]/8 blur-xl" />
      <div className="relative overflow-hidden rounded-[20px] border border-[var(--border)] bg-white shadow-[var(--shadow-md)]">
        <div className="flex items-center gap-2 border-b border-[var(--border)] bg-[var(--section)] px-4 py-3">
          <span className="h-2.5 w-2.5 rounded-full bg-[#f87171]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#fbbf24]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#34d399]" />
          <div className="ml-2 flex-1 rounded-md bg-white px-3 py-1 text-[11px] text-[var(--muted)]">asianhawks.com/jobs</div>
        </div>

        <div className="grid grid-cols-[88px_1fr] gap-0">
          <aside className="hidden space-y-2 border-r border-[var(--border)] bg-[var(--bg)] p-3 sm:block">
            {["Jobs", "Apply", "Saved"].map((item, i) => (
              <div
                key={item}
                className={`rounded-lg px-2 py-1.5 text-[10px] font-semibold ${i === 0 ? "bg-[var(--primary)] text-white" : "text-[var(--muted)]"}`}
              >
                {item}
              </div>
            ))}
          </aside>

          <div className="p-4">
            <div className="mb-3 grid grid-cols-3 gap-2">
              {[
                ["248", "New matches"],
                ["12", "Applied"],
                ["4", "Interviews"],
              ].map(([n, l]) => (
                <div key={l} className="rounded-xl border border-[var(--border)] bg-[var(--bg)] px-2 py-2 text-center">
                  <p className="text-[16px] font-bold text-[var(--primary)]">{n}</p>
                  <p className="text-[9px] text-[var(--muted)]">{l}</p>
                </div>
              ))}
            </div>

            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-[var(--muted)]">Latest openings</p>
            <div className="space-y-2">
              {rows.map((job) => (
                <div key={job.slug} className="flex items-center gap-3 rounded-xl border border-[var(--border)] px-3 py-2.5">
                  <CompanyLogo name={job.company?.name} logo={job.company?.logo} size={32} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[12px] font-semibold text-[var(--heading)]">{job.title}</p>
                    <p className="truncate text-[10px] text-[var(--muted)]">
                      {job.location} · {formatSalary(job.minSalary, job.maxSalary, job.currency)}
                    </p>
                  </div>
                  <span className="hidden rounded-md bg-[var(--cta)] px-2 py-1 text-[10px] font-bold text-white sm:inline">Apply</span>
                </div>
              ))}
              {rows.length === 0 && (
                <div className="flex items-center gap-3 rounded-xl border border-[var(--border)] px-3 py-2.5">
                  <FileText size={16} className="text-[var(--primary)]" />
                  <p className="text-[12px] font-medium">{GOV_JOBS_PREVIEW[0].title}</p>
                </div>
              )}
            </div>

            <div className="mt-3 flex items-center justify-between rounded-xl bg-[#eff6ff] px-3 py-2 text-[11px] text-[var(--primary)]">
              <span className="inline-flex items-center gap-1.5 font-medium">
                <Bell size={13} /> 3 new government postings today
              </span>
              <TrendingUp size={13} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function HeroSection() {
  return (
    <section className="border-b border-[var(--border)] bg-[var(--bg)]">
      <div className="mx-auto grid w-full max-w-[var(--max-w)] items-center gap-12 px-5 py-14 lg:grid-cols-[1.05fr_0.95fr] lg:py-16">
        <div>
          <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-[var(--primary)]">
            Find jobs faster. Build your career.
          </p>
          <h1 className="mt-4 max-w-xl text-[40px] font-extrabold leading-[1.12] tracking-tight text-[var(--heading)] md:text-[48px]">
            Find Your Next Opportunity
          </h1>
          <p className="mt-4 max-w-lg text-[16px] leading-relaxed text-[var(--text-secondary)]">
            Government Jobs, Private Jobs & Career Growth — All in One Place.
          </p>

          <JobSearchBar className="mt-8" />

          <div className="mt-8 flex flex-wrap items-center gap-5 text-[13px] text-[var(--text-secondary)]">
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 size={16} className="text-[var(--success)]" /> Verified listings
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Briefcase size={16} className="text-[var(--primary)]" /> Easy apply
            </span>
            <Link href="/signup" className="font-semibold text-[var(--cta)] hover:underline">
              Create free account
            </Link>
          </div>
        </div>
        <DashboardMockup />
      </div>
    </section>
  );
}
