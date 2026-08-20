"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { JobForm, type JobRecord } from "@/components/job-form";

export default function EditJobPage() {
  const params = useParams<{ id: string }>();
  const { data, isLoading, error } = useQuery<{ job: JobRecord }>({
    queryKey: ["admin-job", params.id],
    queryFn: () => api(`/admin/jobs/${params.id}`),
    enabled: Boolean(params.id),
  });

  return (
    <div className="p-6">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#0f5daa]">Jobs</p>
          <h2 className="mt-1 text-xl font-bold text-[#111827]">Edit job posting</h2>
        </div>
        <Link href="/jobs" className="rounded-xl border border-[#e5e7eb] bg-white px-4 py-2 text-sm font-medium text-[#374151] hover:bg-[#f9fafb]">
          Back to jobs
        </Link>
      </div>
      {isLoading && <div className="h-64 animate-pulse rounded-2xl bg-[#f3f4f6]" />}
      {error && <p className="text-sm text-red-600">{error instanceof Error ? error.message : "Could not load job"}</p>}
      {data?.job && <JobForm job={data.job} />}
    </div>
  );
}
