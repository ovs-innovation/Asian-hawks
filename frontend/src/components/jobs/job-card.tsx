"use client";

import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { Bookmark, BookmarkCheck, Briefcase, Clock, MapPin, Wallet } from "lucide-react";
import { toast } from "sonner";
import { formatSalary, timeAgo } from "@/lib/utils";
import type { DemoJob } from "@/lib/demo-data";
import { CompanyLogo } from "@/components/company-logo";
import type { RootState } from "@/store";
import { updateUser } from "@/store/authSlice";
import { api } from "@/lib/api";

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
  job: Partial<DemoJob> & { _id?: string; title?: string; createdAt?: string };
  variant?: "grid" | "list";
  href?: string;
  preview?: boolean;
}) {
  const dispatch = useDispatch();
  const user = useSelector((s: RootState) => s.auth.user);

  const companyName = job.company?.name || "Asian Hawks Manpower Services Pvt. Ltd.";
  const location = job.location || job.company?.location || "Pan India";
  const cardHref = href || (job.slug ? `/jobs/${job.slug}` : "/signup");
  const salary = formatSalary(job.minSalary, job.maxSalary, job.currency || "INR");

  const isSaved = Boolean(job._id && user?.savedJobs?.includes(String(job._id)));

  async function handleToggleSave(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast.error("Please sign in to save jobs");
      return;
    }
    if (!job._id) return;

    try {
      const res = await api<{ saved: boolean; savedJobs: string[] }>(`/jobs/${job._id}/save`, {
        method: "POST",
      });

      dispatch(updateUser({ savedJobs: res.savedJobs.map(String) }));
      toast.success(res.saved ? "Job saved to your list!" : "Job removed from saved list");
    } catch (err: any) {
      toast.error(err.message || "Could not save job");
    }
  }

  const inner = (
    <div className="flex flex-col gap-3">
      <div className="flex min-w-0 items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3 flex-1">
          <CompanyLogo name={companyName} logo={job.company?.logo} size={40} className="h-10 w-10 shrink-0 sm:h-12 sm:w-12" />
          <div className="min-w-0 flex-1">
            <h3 className="text-[15px] font-semibold leading-snug text-[#111827] group-hover:text-[#0f5daa] sm:text-[17px]">
              {job.title || "Job title"}
            </h3>
            <p className="mt-0.5 line-clamp-1 text-[12px] text-[#64748b] sm:text-[13px]">{companyName}</p>
            <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[12px] text-[#64748b] sm:text-[13px]">
              <span className="inline-flex items-center gap-1"><MapPin size={12} />{location.split(",")[0]}</span>
              <span className="inline-flex items-center gap-1"><Wallet size={12} />{salary}</span>
              <span className="hidden items-center gap-1 sm:inline-flex"><Briefcase size={12} />{employmentLabel(job.employmentType)}</span>
              <span className="hidden items-center gap-1 sm:inline-flex"><Clock size={12} />{job.createdAt ? timeAgo(job.createdAt) : "Today"}</span>
            </div>
          </div>
        </div>

        {/* Bookmark Button */}
        {!preview && job._id ? (
          <button
            type="button"
            onClick={handleToggleSave}
            className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl transition ${
              isSaved
                ? "bg-amber-50 text-amber-600 hover:bg-amber-100"
                : "bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            }`}
            title={isSaved ? "Remove from saved jobs" : "Save job"}
          >
            {isSaved ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
          </button>
        ) : null}
      </div>

      <div className="flex items-center justify-between gap-3 pt-1">
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
    "group block rounded-xl border border-[#e8eef5] bg-white px-3.5 py-3.5 sm:px-5 sm:py-5 hover:border-blue-200 transition-all";

  if (preview) {
    return <article className={className}>{inner}</article>;
  }

  return (
    <Link href={cardHref} className={className}>
      {inner}
    </Link>
  );
}
