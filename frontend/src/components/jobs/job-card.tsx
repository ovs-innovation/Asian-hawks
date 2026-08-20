"use client";

import Link from "next/link";
import { Briefcase, Clock, MapPin, Wallet } from "lucide-react";
import { formatSalary, timeAgo } from "@/lib/utils";
import type { DemoJob } from "@/lib/demo-data";
import { CompanyLogo } from "@/components/company-logo";

function employmentLabel(type?: string) {
  if (!type) return "Full-time";
  if (type === "Full Time") return "Full-time";
  if (type === "Part Time") return "Part-time";
  return type;
}

export function JobCard({
  job,
  href,
  preview = false,
}: {
  job: Partial<DemoJob> & { title?: string; createdAt?: string };
  variant?: "grid" | "list";
  href?: string;
  preview?: boolean;
}) {
  const companyName = job.company?.name || "Asian Hawks Manpower Services Pvt. Ltd.";
  const location = job.location || job.company?.location || "Pan India";
  const cardHref = href || (job.slug ? `/jobs/${job.slug}` : "/signup");
  const salary = formatSalary(job.minSalary, job.maxSalary, job.currency || "INR");

  const inner = (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-start gap-3.5">
        <CompanyLogo name={companyName} logo={job.company?.logo} size={48} />
        <div className="min-w-0">
          <h3 className="text-[17px] font-semibold leading-snug text-[#111827] group-hover:text-[#0f5daa]">
            {job.title || "Job title"}
          </h3>
          <p className="mt-0.5 truncate text-[13px] text-[#64748b]">{companyName}</p>
          <div className="mt-2.5 flex flex-wrap gap-x-4 gap-y-1.5 text-[13px] text-[#64748b]">
            <span className="inline-flex items-center gap-1"><MapPin size={13} />{location}</span>
            <span className="inline-flex items-center gap-1"><Wallet size={13} />{salary}</span>
            <span className="inline-flex items-center gap-1"><Briefcase size={13} />{employmentLabel(job.employmentType)}</span>
            <span className="inline-flex items-center gap-1"><Clock size={13} />{job.createdAt ? timeAgo(job.createdAt) : "Today"}</span>
          </div>
        </div>
      </div>
      <div className="flex shrink-0 items-center justify-between gap-3 sm:flex-col sm:items-end">
        <span className="rounded-md bg-[#eaf3fb] px-2.5 py-1 text-[11px] font-semibold text-[#0f5daa]">
          {job.category || "Banking Jobs"}
        </span>
        <span className="inline-flex h-9 items-center rounded-lg bg-[var(--cta)] px-4 text-[13px] font-semibold text-white">
          Apply
        </span>
      </div>
    </div>
  );

  const className =
    "group block rounded-xl border border-[#e8eef5] bg-white px-3.5 py-4 transition hover:border-[#bfdbfe] hover:shadow-[0_8px_24px_rgba(15,93,170,0.08)] sm:px-5 sm:py-5";

  if (preview) {
    return <article className={className}>{inner}</article>;
  }

  return (
    <Link href={cardHref} className={className}>
      {inner}
    </Link>
  );
}
