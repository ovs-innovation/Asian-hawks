"use client";

import { FormEvent, Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { MapPin, Search } from "lucide-react";
import { JobCard } from "@/components/jobs/job-card";
import { useJobs } from "@/hooks/use-jobs";
import { CATEGORIES } from "@/lib/demo-data";

function JobsBrowser() {
  const params = useSearchParams();
  const { data: jobs = [], isLoading } = useJobs();
  const [role, setRole] = useState(params.get("role") || params.get("keyword") || "");
  const [location, setLocation] = useState(params.get("location") || "");
  const [filter, setFilter] = useState(params.get("category") || "All");
  const [applied, setApplied] = useState({ role, location });

  const chips = useMemo(() => {
    const fromJobs = [...new Set(jobs.map((j) => j.category).filter(Boolean))];
    const list = fromJobs.length ? fromJobs : CATEGORIES;
    return ["All", ...list];
  }, [jobs]);

  function onSearch(e: FormEvent) {
    e.preventDefault();
    setApplied({ role, location });
  }

  const filtered = useMemo(() => {
    return jobs.filter((j) => {
      const hay = `${j.title} ${j.company?.name ?? ""} ${j.location ?? ""} ${j.category ?? ""} ${j.workplace ?? ""} ${(j.skills ?? []).join(" ")}`.toLowerCase();
      if (applied.role && !hay.includes(applied.role.toLowerCase())) return false;
      if (applied.location && !`${j.location} ${j.workplace}`.toLowerCase().includes(applied.location.toLowerCase())) return false;
      if (filter !== "All" && j.category !== filter && !hay.includes(filter.toLowerCase())) return false;
      return true;
    });
  }, [jobs, applied, filter]);

  return (
    <section className="min-h-[70vh] bg-[#f7f9fc]">
      <div className="border-b border-[#e8eef5] bg-white">
        <div className="mx-auto w-full max-w-[1080px] px-4 py-6 sm:px-6 sm:py-10">
          <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#0f5daa]">Asian Hawks</p>
          <h1 className="mt-1 text-[24px] font-extrabold tracking-tight text-[#111827] sm:text-[32px]">Open jobs</h1>
          <p className="mt-2 max-w-xl text-[15px] text-[#64748b]">
            Banking, field, and customer roles with salary and location on every listing.
          </p>

          <form onSubmit={onSearch} className="mt-6 flex flex-col gap-2 rounded-xl border border-[#e8eef5] bg-[#f7f9fc] p-2 sm:flex-row sm:items-center">
            <label className="flex min-w-0 flex-1 items-center gap-2 rounded-lg bg-white px-3 py-2.5">
              <Search size={16} className="shrink-0 text-[#94a3b8]" />
              <input
                className="w-full bg-transparent text-[14px] text-[#111827] outline-none placeholder:text-[#94a3b8]"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="Job title or skill"
              />
            </label>
            <label className="flex min-w-0 flex-1 items-center gap-2 rounded-lg bg-white px-3 py-2.5">
              <MapPin size={16} className="shrink-0 text-[#94a3b8]" />
              <input
                className="w-full bg-transparent text-[14px] text-[#111827] outline-none placeholder:text-[#94a3b8]"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="City or Pan India"
              />
            </label>
            <button type="submit" className="h-11 shrink-0 rounded-lg bg-[#0f5daa] px-6 text-[14px] font-semibold text-white hover:bg-[#0c4d8c]">
              Search
            </button>
          </form>
        </div>
      </div>

      <div className="mx-auto w-full max-w-[1080px] px-4 py-6 sm:px-6 sm:py-8">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {chips.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setFilter(item)}
              className={`shrink-0 rounded-full px-3.5 py-1.5 text-[13px] font-medium ${
                filter === item
                  ? "bg-[#0f5daa] text-white"
                  : "border border-[#e8eef5] bg-white text-[#64748b] hover:border-[#bfdbfe]"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        <p className="mt-5 text-[13px] text-[#64748b]">
          {isLoading ? "Loading jobs…" : `${filtered.length} job${filtered.length === 1 ? "" : "s"} found`}
        </p>

        <div className="mt-3 space-y-3">
          {filtered.map((job) => (
            <JobCard key={job._id || job.slug} job={job} />
          ))}
          {!isLoading && filtered.length === 0 && (
            <p className="rounded-xl border border-[#e8eef5] bg-white px-5 py-10 text-center text-sm text-[#64748b]">
              No jobs match these filters. Try another title or city.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

export default function JobsPage() {
  return (
    <Suspense fallback={<div className="bg-[#f7f9fc] px-6 py-16 text-sm text-[#64748b]">Loading jobs…</div>}>
      <JobsBrowser />
    </Suspense>
  );
}
