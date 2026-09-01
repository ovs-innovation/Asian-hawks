"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { cn, timeAgo } from "@/lib/utils";
import { Briefcase, Users, Building2, TrendingUp, Plus } from "lucide-react";

type Overview = {
  jobs: number;
  users: number;
  companies: number;
  applications: number;
  tickets: number;
};

type Job = {
  _id: string;
  title: string;
  category?: string;
  status: string;
  createdAt: string;
  company?: { name: string };
};

export default function DashboardPage() {
  const { data, isLoading, isError, error, refetch } = useQuery<Overview>({
    queryKey: ["admin-overview"],
    queryFn: () => api("/admin/overview"),
  });
  const { data: jobsData, isError: jobsError, refetch: refetchJobs } = useQuery<{ items: Job[] }>({
    queryKey: ["admin-jobs-recent"],
    queryFn: () => api("/admin/jobs?limit=6"),
  });

  const stats = [
    { label: "Total Jobs", value: data?.jobs ?? "—", href: "/jobs", icon: Briefcase, color: "bg-blue-50 text-blue-600" },
    { label: "Applications", value: data?.applications ?? "—", href: "/jobs", icon: TrendingUp, color: "bg-green-50 text-green-600" },
    { label: "Users", value: data?.users ?? "—", href: "/users", icon: Users, color: "bg-purple-50 text-purple-600" },
    { label: "Companies", value: data?.companies ?? "—", href: "/companies", icon: Building2, color: "bg-orange-50 text-orange-600" },
  ];

  return (
    <div className="p-6">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-[#111827]">Overview</h2>
          <p className="mt-0.5 text-sm text-[#6b7280]">Manage jobs, people, and platform activity</p>
        </div>
        <Link
          href="/jobs/new"
          className="inline-flex items-center gap-1.5 rounded-xl bg-[#0f5daa] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#0c4d8c]"
        >
          <Plus className="h-4 w-4" />
          Create job
        </Link>
      </div>

      {isError ? (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          Could not load dashboard: {error instanceof Error ? error.message : "Request failed"}.
          <button type="button" className="ml-2 font-semibold underline" onClick={() => { refetch(); refetchJobs(); }}>
            Retry
          </button>
        </div>
      ) : null}

      {isLoading ? (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-xl bg-[#f3f4f6]" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {stats.map((s) => (
            <Link key={s.label} href={s.href} className="rounded-xl border border-[#e5e7eb] bg-white p-5 transition hover:border-[#c7d7ea]">
              <div className={cn("mb-3 inline-flex h-9 w-9 items-center justify-center rounded-lg", s.color)}>
                <s.icon className="h-4 w-4" />
              </div>
              <p className="text-2xl font-bold text-[#111827]">{String(s.value)}</p>
              <p className="mt-0.5 text-sm text-[#6b7280]">{s.label}</p>
            </Link>
          ))}
        </div>
      )}

      {data?.tickets ? (
        <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          <strong>{data.tickets}</strong> open support ticket(s) need attention.
        </div>
      ) : null}

      <div className="mt-8 overflow-hidden rounded-xl border border-[#e5e7eb] bg-white">
        <div className="flex items-center justify-between border-b border-[#e5e7eb] px-5 py-3">
          <h3 className="text-sm font-semibold text-[#111827]">Recent jobs</h3>
          <Link href="/jobs" className="text-sm font-medium text-[#0f5daa]">View all</Link>
        </div>
        <div className="divide-y divide-[#f3f4f6]">
          {(jobsData?.items ?? []).map((job) => (
            <div key={job._id} className="flex items-center gap-3 px-5 py-3">
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-[#111827]">{job.title}</p>
                <p className="text-xs text-[#9ca3af]">{job.category ?? "Uncategorized"} · {job.company?.name ?? "—"}</p>
              </div>
              <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                job.status === "published" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
              }`}>
                {job.status}
              </span>
              <span className="hidden text-xs text-[#9ca3af] sm:block">{timeAgo(job.createdAt)}</span>
              <Link href={`/jobs/${job._id}/edit`} className="text-xs font-medium text-[#0f5daa]">Edit</Link>
            </div>
          ))}
          {jobsError ? (
            <p className="px-5 py-8 text-center text-sm text-red-600">Could not load jobs.</p>
          ) : !jobsData?.items?.length ? (
            <p className="px-5 py-8 text-center text-sm text-[#9ca3af]">No jobs yet.</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
