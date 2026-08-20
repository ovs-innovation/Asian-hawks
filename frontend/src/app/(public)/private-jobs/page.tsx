"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { SectionHeader } from "@/components/platform/section-header";
import { JobCard } from "@/components/jobs/job-card";
import { useJobs } from "@/hooks/use-jobs";

function PrivateJobsContent() {
  const params = useSearchParams();
  const keyword = params.get("keyword")?.toLowerCase() || "";
  const location = params.get("location")?.toLowerCase() || "";
  const { data: jobs = [] } = useJobs();

  const filtered = jobs.filter((j) => {
    return (
      (!keyword || j.title.toLowerCase().includes(keyword) || j.category.toLowerCase().includes(keyword)) &&
      (!location || j.location.toLowerCase().includes(location))
    );
  });

  return (
    <div className="mx-auto w-full max-w-[var(--max-w)] px-5 py-10">
      <SectionHeader title="Private Jobs" subtitle="Verified private sector openings with salary upfront" />
      <div className="grid gap-4 md:grid-cols-2">
        {filtered.map((job) => (
          <JobCard key={job.slug} job={job} variant="grid" />
        ))}
      </div>
    </div>
  );
}

export default function PrivateJobsPage() {
  return (
    <Suspense>
      <PrivateJobsContent />
    </Suspense>
  );
}
