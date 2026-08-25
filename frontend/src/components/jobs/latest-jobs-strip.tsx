"use client";

import Link from "next/link";
import {
  ArrowRight,
  Briefcase,
  Building2,
  Check,
  FileText,
  Landmark,
  Laptop,
  UserCheck,
} from "lucide-react";
import { useJobs } from "@/hooks/use-jobs";
import { formatSalary } from "@/lib/utils";

export function ImmediateVacanciesPanel({
  variant = "panel",
}: {
  variant?: "panel" | "horizontal";
}) {
  const { data: rawJobs = [], isLoading } = useJobs("?sort=latest&limit=8");

  // Sort and filter active published jobs (top 3 max)
  const jobs = [...rawJobs]
    .filter((j) => !j.status || j.status === "published")
    .sort((a, b) => {
      const timeA = new Date(a.publishedAt || a.createdAt || 0).getTime();
      const timeB = new Date(b.publishedAt || b.createdAt || 0).getTime();
      return timeB - timeA;
    })
    .slice(0, 3);

  // Accent color presets for 3 standalone floating cards (Blue, Green, Purple)
  const ACCENTS = [
    {
      title: "text-[#0f5daa]",
      iconBg: "bg-blue-100 text-[#0f5daa]",
      btn: "bg-[#0f5daa] hover:bg-[#0c4d8c]",
      check: "text-[#0f5daa]",
      cardBorder: "border-blue-300 border-l-[4px] border-l-[#0f5daa] bg-white shadow-md hover:border-blue-400 hover:shadow-lg",
    },
    {
      title: "text-[#0b6b5c]",
      iconBg: "bg-emerald-100 text-[#0b6b5c]",
      btn: "bg-[#0b6b5c] hover:bg-[#085247]",
      check: "text-[#0b6b5c]",
      cardBorder: "border-emerald-300 border-l-[4px] border-l-[#0b6b5c] bg-white shadow-md hover:border-emerald-400 hover:shadow-lg",
    },
    {
      title: "text-[#5b21b6]",
      iconBg: "bg-purple-100 text-[#5b21b6]",
      btn: "bg-[#5b21b6] hover:bg-[#4c1d95]",
      check: "text-[#5b21b6]",
      cardBorder: "border-purple-300 border-l-[4px] border-l-[#5b21b6] bg-white shadow-md hover:border-purple-400 hover:shadow-lg",
    },
  ];

  // Mobile/Tablet Horizontal Variant (< lg screens)
  if (variant === "horizontal") {
    return (
      <div className="w-full">
        {/* Compact Header */}
        <div className="mb-2 flex items-center justify-between gap-2 px-0.5">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#0f5daa]" />
            </span>
            <span className="text-[12.5px] font-black uppercase tracking-wider text-[#03224c]">
              Immediate Vacancies
            </span>
            <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[8.5px] font-extrabold uppercase text-[#0f5daa]">
              {jobs.length} Live
            </span>
          </div>
          <Link
            href="/jobs?sort=latest"
            className="group inline-flex items-center gap-1 text-[11.5px] font-bold text-[#0f5daa] hover:text-[#03224c]"
          >
            <span>View all</span>
            <ArrowRight size={12} className="transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* Cards Container */}
        {isLoading ? (
          <div className="flex gap-2.5 overflow-x-auto pb-1">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-[120px] w-[230px] shrink-0 animate-pulse rounded-xl border border-slate-200 bg-white p-2.5"
              />
            ))}
          </div>
        ) : jobs.length > 0 ? (
          <div className="flex gap-2.5 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden snap-x snap-mandatory">
            {jobs.map((job, idx) => {
              const pubDate = job.publishedAt || job.createdAt;
              const salaryStr = formatSalary(job.minSalary, job.maxSalary, job.currency);
              const accent = ACCENTS[idx % ACCENTS.length];
              const IconComponent = getJobIcon(job.category, job.title);

              return (
                <div
                  key={job._id || job.slug}
                  className={`group relative flex w-[230px] shrink-0 snap-start flex-col justify-between rounded-xl border p-2.5 transition-all ${accent.cardBorder}`}
                >
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className={`grid h-6 w-6 shrink-0 place-items-center rounded-md ${accent.iconBg}`}>
                        <IconComponent size={13} strokeWidth={2.2} />
                      </span>
                      <h4 className={`line-clamp-1 text-[11.5px] font-black uppercase tracking-wide ${accent.title}`}>
                        {job.title}
                      </h4>
                    </div>
                    <div className="mt-1.5 space-y-0.5 text-[10px] font-medium text-slate-700">
                      <p className="flex items-center gap-1">
                        <Check size={10} className={accent.check} />
                        <span className="truncate">Salary: <strong>{salaryStr}</strong></span>
                      </p>
                      <p className="flex items-center gap-1">
                        <Check size={10} className={accent.check} />
                        <span className="truncate">Location: {shortLocation(job.location)}</span>
                      </p>
                    </div>
                  </div>
                  <Link
                    href={`/jobs/${job.slug}`}
                    className={`mt-2 flex h-6.5 w-full items-center justify-center gap-1 rounded-md text-[10px] font-bold text-white transition-colors ${accent.btn}`}
                  >
                    <span>Apply Now</span>
                    <ArrowRight size={10} />
                  </Link>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-3 text-center text-[12px] text-slate-500">
            New vacancies coming soon.
          </div>
        )}
      </div>
    );
  }

  // 3 Standalone Floating White Cards with Distinct High-Impact Header Bar (w-[255px])
  return (
    <div className="w-[255px] shrink-0 space-y-2">
      {/* High-Impact Distinct Header Bar (No color mixing with dark navy backdrop) */}
      <div className="flex h-8 items-center justify-between rounded-xl border border-blue-400/30 bg-gradient-to-r from-[#0c3972] to-[#082852] px-3 shadow-md backdrop-blur-md">
        <div className="flex items-center gap-1.5">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-300 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-400" />
          </span>
          <span className="text-[11px] font-black uppercase tracking-wider text-white drop-shadow-2xs">
            Immediate Vacancies
          </span>
        </div>
        <span className="rounded-full bg-blue-500/30 border border-blue-300/40 px-2 py-0.5 text-[8.5px] font-extrabold uppercase text-white shadow-2xs">
          {jobs.length} Live
        </span>
      </div>

      {/* 3 Standalone Floating Job Cards */}
      <div className="space-y-2">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-[85px] w-full animate-pulse rounded-xl bg-white/20 p-2" />
          ))
        ) : jobs.length > 0 ? (
          jobs.map((job, idx) => {
            const salaryStr = formatSalary(job.minSalary, job.maxSalary, job.currency);
            const IconComponent = getJobIcon(job.category, job.title);
            const accent = ACCENTS[idx % ACCENTS.length];
            const qualStr = getQualText(job.experience);

            return (
              <div
                key={job._id || job.slug}
                className={`group relative rounded-xl border px-2.5 py-2 transition-all ${accent.cardBorder}`}
              >
                {/* Header: Icon + Title */}
                <div className="flex items-center gap-1.5">
                  <span className={`grid h-5.5 w-5.5 shrink-0 place-items-center rounded-md ${accent.iconBg} shadow-2xs`}>
                    <IconComponent size={11} strokeWidth={2.2} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <h4 className={`line-clamp-1 text-[11px] font-black uppercase tracking-wide leading-tight ${accent.title}`}>
                      {job.title}
                    </h4>
                  </div>
                </div>

                {/* Tightly Compressed Checklist details */}
                <div className="mt-1 space-y-[1px] text-[9.5px] font-medium leading-tight text-slate-700">
                  <div className="flex items-center gap-1 truncate">
                    <Check size={9} className={`shrink-0 font-extrabold stroke-[3] ${accent.check}`} />
                    <span className="truncate">
                      Salary: <strong className="text-slate-900">{salaryStr}</strong>
                    </span>
                  </div>
                  <div className="flex items-center gap-1 truncate">
                    <Check size={9} className={`shrink-0 font-extrabold stroke-[3] ${accent.check}`} />
                    <span className="truncate">Qualification: {qualStr}</span>
                  </div>
                  <div className="flex items-center gap-1 truncate">
                    <Check size={9} className={`shrink-0 font-extrabold stroke-[3] ${accent.check}`} />
                    <span className="truncate">Location: {shortLocation(job.location)}</span>
                  </div>
                  <div className="flex items-center gap-1 truncate">
                    <Check size={9} className={`shrink-0 font-extrabold stroke-[3] ${accent.check}`} />
                    <span className="truncate">Immediate Joining</span>
                  </div>
                </div>

                {/* Compact Apply Button (22px height) */}
                <div className="mt-1">
                  <Link
                    href={`/jobs/${job.slug}`}
                    className={`flex h-[22px] w-full items-center justify-center gap-1 rounded-md text-[9.5px] font-bold text-white shadow-2xs transition-colors ${accent.btn}`}
                  >
                    <span>Apply Now</span>
                    <ArrowRight size={8.5} className="transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </div>
              </div>
            );
          })
        ) : (
          <div className="py-2 text-center text-[10px] text-slate-300">
            New vacancies coming soon.
          </div>
        )}
      </div>

      {/* Floating View All Vacancies Button */}
      <div className="pt-0.5">
        <Link
          href="/jobs?sort=latest"
          className="flex h-7 w-full items-center justify-center gap-1 rounded-xl bg-gradient-to-r from-[#0c3972] to-[#082852] border border-blue-400/30 text-[10px] font-bold text-white shadow-md hover:border-blue-300 transition-all"
        >
          <span>View All Vacancies</span>
          <ArrowRight size={9} />
        </Link>
      </div>
    </div>
  );
}

function getJobIcon(category?: string, title?: string) {
  const combined = `${category || ""} ${title || ""}`.toLowerCase();
  if (
    combined.includes("it") ||
    combined.includes("software") ||
    combined.includes("dev") ||
    combined.includes("tech") ||
    combined.includes("ui/ux") ||
    combined.includes("code")
  ) {
    return Laptop;
  }
  if (
    combined.includes("bank") ||
    combined.includes("loan") ||
    combined.includes("finance") ||
    combined.includes("account") ||
    combined.includes("credit") ||
    combined.includes("atm")
  ) {
    return Landmark;
  }
  if (
    combined.includes("gov") ||
    combined.includes("ssc") ||
    combined.includes("railway") ||
    combined.includes("public")
  ) {
    return Building2;
  }
  if (
    combined.includes("sales") ||
    combined.includes("field") ||
    combined.includes("executive") ||
    combined.includes("marketing") ||
    combined.includes("mitra") ||
    combined.includes("collection") ||
    combined.includes("fos")
  ) {
    return UserCheck;
  }
  if (
    combined.includes("entry") ||
    combined.includes("data") ||
    combined.includes("clerk") ||
    combined.includes("office") ||
    combined.includes("admin")
  ) {
    return FileText;
  }
  return Briefcase;
}

function getQualText(experience?: string) {
  if (!experience) return "Graduation";
  const expLower = experience.toLowerCase();
  if (expLower.includes("fresh") || experience === "0" || experience === "0-1") {
    return "Graduation";
  }
  return experience.length < 15 ? experience : "Graduation";
}

function isJobRecent(date?: string | Date) {
  if (!date) return false;
  const diff = Date.now() - new Date(date).getTime();
  return diff >= 0 && diff <= 2 * 86400000;
}

function shortLocation(location?: string) {
  if (!location) return "Pan India";
  const first = location.split(",")[0].trim();
  if (location.includes(",") || location.includes("+")) return `${first} +more`;
  return first;
}

export const LatestJobsStrip = ImmediateVacanciesPanel;
