"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Briefcase, Building2, Clock, MapPin } from "lucide-react";
import { useJobs } from "@/hooks/use-jobs";
import { formatSalary, timeAgo } from "@/lib/utils";
import { CompanyLogo } from "@/components/company-logo";
import { DatePostedFilter, type DatePostedValue } from "@/components/jobs/date-posted-filter";

export function LatestJobsSection() {
  const [datePosted, setDatePosted] = useState<DatePostedValue>("any");
  const queryParam = `?sort=latest&limit=12${datePosted !== "any" ? `&posted=${datePosted}` : ""}`;
  const { data: rawJobs = [], isLoading } = useJobs(queryParam);

  const now = Date.now();
  // Sort and filter active published jobs
  const jobs = [...rawJobs]
    .filter((j) => !j.status || j.status === "published")
    .filter((j) => {
      if (datePosted === "any") return true;
      const daysLimit = Number(datePosted);
      if (!isNaN(daysLimit) && daysLimit > 0) {
        const jobDateStr = j.publishedAt || j.createdAt;
        if (jobDateStr) {
          const diffDays = (now - new Date(jobDateStr).getTime()) / 86400000;
          return diffDays <= daysLimit;
        }
      }
      return true;
    })
    .sort((a, b) => {
      const timeA = new Date(a.publishedAt || a.createdAt || 0).getTime();
      const timeB = new Date(b.publishedAt || b.createdAt || 0).getTime();
      return timeB - timeA;
    })
    .slice(0, 6);

  return (
    <section className="border-t border-b border-slate-100 bg-gradient-to-b from-white via-[#f8fafc] to-[#f1f5f9] py-10 sm:py-14">
      <div className="mx-auto w-full max-w-[var(--max-w)] px-4 sm:px-5">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-[12px] font-semibold text-[#0f5daa]">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#0f5daa]"></span>
              </span>
              <span>Live Updates</span>
            </div>
            <h2 className="mt-2 text-[24px] font-extrabold tracking-tight text-[var(--heading)] sm:text-[30px]">
              Latest Job Openings
            </h2>
            <p className="mt-1 text-[14px] text-[var(--text-secondary)]">
              Fresh opportunities posted by top employers & admins
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <DatePostedFilter value={datePosted} onChange={setDatePosted} resultCount={jobs.length} />
            <Link
              href="/jobs?sort=latest"
              className="group inline-flex items-center gap-1.5 text-[14px] font-bold text-[#0f5daa] hover:text-[#03224c]"
            >
              <span>View All Latest Jobs</span>
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        {/* Jobs Grid */}
        <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="animate-pulse rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-slate-200" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-3/4 rounded bg-slate-200" />
                    <div className="h-3 w-1/2 rounded bg-slate-200" />
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="h-3 w-full rounded bg-slate-150" />
                  <div className="h-3 w-2/3 rounded bg-slate-150" />
                </div>
              </div>
            ))
          ) : jobs.length > 0 ? (
            jobs.map((job) => {
              const pubDate = job.publishedAt || job.createdAt;
              const isNew = isRecent(pubDate);
              const companyName = job.company?.name || "Asian Hawks";
              const logo = job.company?.logo || "/logo.png";
              const salaryStr = formatSalary(job.minSalary, job.maxSalary, job.currency);

              return (
                <div
                  key={job._id || job.slug}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-1 hover:border-[#0f5daa]/30 hover:shadow-[0_12px_24px_rgba(15,93,170,0.12)]"
                >
                  {/* Top row: Logo & New badge */}
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <CompanyLogo name={companyName} logo={logo} size={42} className="shrink-0 rounded-xl border border-slate-100 shadow-sm" />
                        <div className="min-w-0">
                          <span className="block truncate text-[13px] font-semibold text-slate-500">
                            {companyName}
                          </span>
                          <h3 className="line-clamp-1 text-[16px] font-bold text-slate-900 group-hover:text-[#0f5daa]">
                            <Link href={`/jobs/${job.slug}`}>
                              <span className="absolute inset-0 z-10" />
                              {job.title}
                            </Link>
                          </h3>
                        </div>
                      </div>
                      {isNew && (
                        <span className="shrink-0 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-emerald-600 ring-1 ring-inset ring-emerald-600/20">
                          NEW
                        </span>
                      )}
                    </div>

                    {/* Details badges */}
                    <div className="mt-4 flex flex-wrap items-center gap-2 text-[12px] font-medium text-slate-600">
                      <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-1">
                        <MapPin size={13} className="text-slate-400" />
                        <span className="truncate max-w-[120px]">{job.location || "India"}</span>
                      </span>

                      <span className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2 py-1 text-[#0f5daa]">
                        <Briefcase size={13} />
                        <span>{job.workplace || job.employmentType || "Onsite"}</span>
                      </span>

                      {job.experience && (
                        <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2 py-1 text-amber-700">
                          <Building2 size={13} />
                          <span className="truncate max-w-[100px]">{job.experience}</span>
                        </span>
                      )}
                    </div>

                    {/* Salary */}
                    <div className="mt-3 text-[14px] font-bold text-slate-800">
                      {salaryStr}
                    </div>
                  </div>

                  {/* Bottom Action Footer */}
                  <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-3 text-[12px] text-slate-500">
                    <span className="inline-flex items-center gap-1">
                      <Clock size={13} className="text-slate-400" />
                      {pubDate ? timeAgo(pubDate) : "Recently"}
                    </span>
                    <span className="inline-flex items-center gap-1 font-bold text-[#0f5daa] group-hover:translate-x-0.5 transition-transform">
                      Apply Now <ArrowRight size={14} />
                    </span>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full rounded-2xl border border-dashed border-slate-200 p-8 text-center text-slate-500">
              <Briefcase size={32} className="mx-auto text-slate-400" />
              <p className="mt-2 text-[15px] font-semibold text-slate-700">No latest jobs posted yet</p>
              <p className="mt-1 text-[13px]">Check back soon or post a job as admin!</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function isRecent(date?: string | Date) {
  if (!date) return false;
  const diff = Date.now() - new Date(date).getTime();
  return diff >= 0 && diff <= 5 * 86400000;
}
