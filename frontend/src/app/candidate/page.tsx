"use client";

import Link from "next/link";
import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  Bookmark,
  Briefcase,
  Building2,
  CheckCircle2,
  FileText,
  MapPin,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { PageHeader } from "@/components/layout/dashboard-shell";
import { Badge, Card } from "@/components/ui/primitives";
import { Button } from "@/components/ui/button";
import type { RootState } from "@/store";
import { useJobs } from "@/hooks/use-jobs";
import { api } from "@/lib/api";
import { timeAgo } from "@/lib/utils";

type AppliedJobItem = {
  _id: string;
  status: string;
  createdAt?: string;
  job?: {
    title: string;
    slug?: string;
    company?: { name: string };
  };
};

export default function CandidateHome() {
  const user = useSelector((s: RootState) => s.auth.user);
  const { data: jobs = [] } = useJobs();
  const pct = user?.profileCompletion || 20;

  const { data: appsData } = useQuery<{ items: AppliedJobItem[] }>({
    queryKey: ["my-apps"],
    queryFn: () => api<{ items: AppliedJobItem[] }>("/applications/me"),
  });

  const myApplications = appsData?.items ?? [];

  return (
    <div className="space-y-8">
      <PageHeader
        title={`Welcome back, ${user?.name?.split(" ")[0] || "Candidate"} 👋`}
        body="Track your application status, saved roles, and discover recommended openings."
        action={
          <Button asChild className="bg-[#0f5daa] hover:bg-[#0c4d8c] text-white shadow-xs rounded-xl px-5 h-11 font-semibold">
            <Link href="/jobs" className="flex items-center gap-2">
              <Briefcase size={16} />
              <span>Browse All Jobs</span>
            </Link>
          </Button>
        }
      />

      {/* Top Stat Cards Grid */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {/* Profile Completion Card */}
        <Card className="relative overflow-hidden p-6 hover:shadow-md transition-all border-slate-200/90">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Profile Completion</p>
              <h3 className="mt-2 text-3xl font-black text-slate-900">{pct}%</h3>
            </div>
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-50 text-[#0f5daa]">
              <Sparkles size={20} />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-xs font-semibold text-slate-500 mb-1.5">
              <span>Progress</span>
              <span>{pct < 100 ? "Action needed" : "Complete"}</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#0f5daa] to-blue-400 transition-all duration-500"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
          <Link
            href="/candidate/profile"
            className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-[#0f5daa] hover:text-[#0c4d8c] transition-colors"
          >
            <span>Complete your profile</span>
            <ArrowRight size={14} />
          </Link>
        </Card>

        {/* Applications Card */}
        <Card className="p-6 hover:shadow-md transition-all border-slate-200/90">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Applications</p>
              <h3 className="mt-2 text-3xl font-black text-slate-900">{myApplications.length}</h3>
            </div>
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-50 text-emerald-600">
              <Briefcase size={20} />
            </div>
          </div>
          <p className="mt-3 text-xs font-medium text-slate-500">
            {myApplications.length === 1 ? "1 active application in process" : `${myApplications.length} active applications in process`}
          </p>
          <Link
            href="/candidate/applied"
            className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-[#0f5daa] hover:text-[#0c4d8c] transition-colors"
          >
            <span>Track application status</span>
            <ArrowRight size={14} />
          </Link>
        </Card>

        {/* Saved Roles Card */}
        <Card className="p-6 hover:shadow-md transition-all border-slate-200/90 sm:col-span-2 lg:col-span-1">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Saved Roles</p>
              <h3 className="mt-2 text-3xl font-black text-slate-900">0</h3>
            </div>
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-amber-50 text-amber-600">
              <Bookmark size={20} />
            </div>
          </div>
          <p className="mt-3 text-xs font-medium text-slate-500">Save roles to review or apply later</p>
          <Link
            href="/candidate/saved"
            className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-[#0f5daa] hover:text-[#0c4d8c] transition-colors"
          >
            <span>View saved openings</span>
            <ArrowRight size={14} />
          </Link>
        </Card>
      </div>

      {/* Recommended Jobs Section */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp size={20} className="text-[#0f5daa]" />
            <h2 className="text-lg font-bold text-slate-900">Recommended for You</h2>
          </div>
          <Link
            href="/jobs"
            className="text-xs font-bold text-[#0f5daa] hover:underline flex items-center gap-1"
          >
            Explore all <ArrowRight size={13} />
          </Link>
        </div>

        <div className="grid gap-3">
          {jobs.slice(0, 4).map((j) => (
            <Card
              key={j.slug}
              className="group p-5 hover:border-blue-200 hover:shadow-md transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-slate-100 text-slate-600 font-bold text-lg group-hover:bg-blue-50 group-hover:text-[#0f5daa] transition-colors">
                    <Building2 size={22} />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-slate-900 group-hover:text-[#0f5daa] transition-colors text-base">
                        {j.title}
                      </h3>
                      {j.category === "Government" && <Badge tone="blue">Government</Badge>}
                      {j.urgent && <Badge tone="amber">Urgent</Badge>}
                    </div>
                    <p className="text-xs font-medium text-slate-500 flex items-center gap-3 flex-wrap">
                      <span>{j.company?.name || "Asian Hawks Manpower"}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <MapPin size={12} className="text-slate-400" />
                        {j.location || "Pan India"}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-start sm:self-center">
                  <Button
                    size="sm"
                    asChild
                    className="bg-[#0f5daa] hover:bg-[#0c4d8c] text-white rounded-xl px-4 h-9 font-semibold text-xs shadow-2xs"
                  >
                    <Link href={`/jobs/${j.slug}`}>View Listing</Link>
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Activity Timeline */}
      <div className="space-y-4 pt-2">
        <h2 className="text-lg font-bold text-slate-900">Recent Activity</h2>
        <Card className="p-6">
          <ol className="relative border-l border-slate-200 ml-3 space-y-6">
            {myApplications.slice(0, 5).map((app) => (
              <li key={app._id} className="ml-6">
                <span className="absolute -left-3 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 ring-4 ring-white">
                  <FileText size={14} />
                </span>
                <p className="text-xs font-bold text-slate-400">
                  {app.createdAt ? timeAgo(app.createdAt) : "Recent"}
                </p>
                <p className="text-sm font-semibold text-slate-800 mt-0.5">
                  Application Submitted — <span className="text-[#0f5daa]">{app.job?.title || "Job Role"}</span>
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  Applied to {app.job?.title || "role"} at {app.job?.company?.name || "Asian Hawks Manpower"}. Status: <span className="font-semibold text-slate-700 capitalize">{app.status || "applied"}</span>
                </p>
              </li>
            ))}

            <li className="ml-6">
              <span className="absolute -left-3 flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-[#0f5daa] ring-4 ring-white">
                <CheckCircle2 size={14} />
              </span>
              <p className="text-xs font-bold text-slate-400">Today</p>
              <p className="text-sm font-semibold text-slate-800 mt-0.5">Workspace session started</p>
              <p className="text-xs text-slate-500 mt-0.5">Logged into Asian Hawks Candidate Portal</p>
            </li>
          </ol>
        </Card>
      </div>
    </div>
  );
}
