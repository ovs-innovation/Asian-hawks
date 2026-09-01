"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Search,
  Mail,
  Phone,
  MapPin,
  FileText,
  Briefcase,
  CheckCircle2,
  ExternalLink,
  User,
} from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/layout/dashboard-shell";
import { Card } from "@/components/ui/primitives";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { timeAgo, API_URL } from "@/lib/utils";

type RecruiterAppItem = {
  _id: string;
  status: string;
  createdAt?: string;
  coverLetter?: string;
  resumeUrl?: string;
  candidate?: {
    _id?: string;
    name?: string;
    email?: string;
    phone?: string;
    headline?: string;
    location?: string;
    skills?: string[];
    avatar?: string;
    resumeUrl?: string;
  };
  job?: {
    _id?: string;
    title?: string;
    slug?: string;
    location?: string;
  };
};

const STATUS_COLORS: Record<string, string> = {
  applied: "bg-blue-50 text-[#0f5daa] border-blue-200",
  reviewing: "bg-indigo-50 text-indigo-700 border-indigo-200",
  shortlisted: "bg-amber-50 text-amber-800 border-amber-200",
  interview: "bg-purple-50 text-purple-700 border-purple-200",
  offered: "bg-teal-50 text-teal-800 border-teal-200",
  hired: "bg-emerald-50 text-emerald-800 border-emerald-200",
  rejected: "bg-red-50 text-red-700 border-red-200",
};

export default function RecruiterApplicationsPage() {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<string>("all");

  const { data, isLoading, isError, error, refetch } = useQuery<{ items: RecruiterAppItem[] }>({
    queryKey: ["recruiter-applications"],
    queryFn: () => api<{ items: RecruiterAppItem[] }>("/applications/pipeline"),
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      api(`/applications/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      }),
    onSuccess: () => {
      toast.success("Application status updated");
      qc.invalidateQueries({ queryKey: ["recruiter-applications"] });
      qc.invalidateQueries({ queryKey: ["pipeline"] });
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to update status");
    },
  });

  const rawItems = data?.items ?? [];

  const filteredItems = rawItems.filter((item) => {
    const candidateName = item.candidate?.name || "";
    const candidateEmail = item.candidate?.email || "";
    const candidatePhone = item.candidate?.phone || "";
    const jobTitle = item.job?.title || "";

    const textMatch =
      candidateName.toLowerCase().includes(search.toLowerCase()) ||
      candidateEmail.toLowerCase().includes(search.toLowerCase()) ||
      candidatePhone.includes(search) ||
      jobTitle.toLowerCase().includes(search.toLowerCase());

    if (activeTab !== "all" && item.status !== activeTab) {
      return false;
    }
    return textMatch;
  });

  const statusCounts = {
    all: rawItems.length,
    applied: rawItems.filter((i) => i.status === "applied").length,
    shortlisted: rawItems.filter((i) => i.status === "shortlisted").length,
    interview: rawItems.filter((i) => i.status === "interview").length,
    hired: rawItems.filter((i) => i.status === "hired").length,
    rejected: rawItems.filter((i) => i.status === "rejected").length,
  };

  return (
    <div className="space-y-8 pb-12">
      <PageHeader
        title="Job Applications"
        body="Review, filter, and manage candidates who have applied to your active job listings."
        action={
          <Button asChild className="bg-[#0f5daa] hover:bg-[#0c4d8c] text-white shadow-xs rounded-xl px-5 h-11 font-semibold">
            <Link href="/recruiter/jobs/new" className="flex items-center gap-2">
              <Briefcase size={16} />
              <span>Post New Opening</span>
            </Link>
          </Button>
        }
      />

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Status Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-xs">
          {[
            { id: "all", label: "All", count: statusCounts.all },
            { id: "applied", label: "Applied", count: statusCounts.applied },
            { id: "shortlisted", label: "Shortlisted", count: statusCounts.shortlisted },
            { id: "interview", label: "Interview", count: statusCounts.interview },
            { id: "hired", label: "Hired", count: statusCounts.hired },
            { id: "rejected", label: "Rejected", count: statusCounts.rejected },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all ${
                activeTab === tab.id
                  ? "bg-[#0f5daa] text-white shadow-xs"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search size={15} className="absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search candidate name, job..."
            className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:border-[#0f5daa] focus:outline-none"
          />
        </div>
      </div>

      {/* Error State */}
      {isError ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-xs font-medium text-red-800 flex items-center justify-between">
          <span>{error instanceof Error ? error.message : "Failed to load candidate applications."}</span>
          <button type="button" onClick={() => refetch()} className="font-bold underline">
            Retry
          </button>
        </div>
      ) : null}

      {/* Loading Skeleton */}
      {isLoading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-2xl bg-slate-100" />
          ))}
        </div>
      ) : null}

      {/* Applications List */}
      {!isLoading && filteredItems.length > 0 ? (
        <div className="space-y-4">
          {filteredItems.map((item) => {
            const activeResume = item.resumeUrl || item.candidate?.resumeUrl;
            const resumeHref = activeResume
              ? activeResume.startsWith("http")
                ? activeResume
                : `${API_URL.replace("/api", "")}${activeResume}`
              : null;

            return (
              <Card
                key={item._id}
                className="group relative p-6 hover:border-blue-200 hover:shadow-md transition-all border-slate-200/90"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                  <div className="flex items-start gap-4">
                    {/* Candidate Avatar */}
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-[#0f5daa] to-[#03224c] text-lg font-bold text-white shadow-sm border border-slate-200">
                      {item.candidate?.avatar ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={item.candidate.avatar} alt={item.candidate.name} className="h-full w-full object-cover" />
                      ) : (
                        <span>{item.candidate?.name?.[0]?.toUpperCase() || "C"}</span>
                      )}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-bold text-slate-900 text-base">
                          {item.candidate?.name || "Candidate"}
                        </h3>
                        <span className="text-xs font-semibold text-slate-400">for</span>
                        <span className="font-bold text-[#0f5daa] text-sm">
                          {item.job?.title || "Job Opening"}
                        </span>
                      </div>

                      {item.candidate?.headline ? (
                        <p className="text-xs font-medium text-slate-600">{item.candidate.headline}</p>
                      ) : null}

                      <div className="flex items-center gap-4 text-xs text-slate-500 flex-wrap pt-0.5">
                        {item.candidate?.email ? (
                          <span className="flex items-center gap-1">
                            <Mail size={13} className="text-slate-400" /> {item.candidate.email}
                          </span>
                        ) : null}

                        {item.candidate?.phone ? (
                          <span className="flex items-center gap-1">
                            <Phone size={13} className="text-slate-400" /> {item.candidate.phone}
                          </span>
                        ) : null}

                        {item.candidate?.location ? (
                          <span className="flex items-center gap-1">
                            <MapPin size={13} className="text-slate-400" /> {item.candidate.location}
                          </span>
                        ) : null}

                        <span className="text-slate-400">• Applied {timeAgo(item.createdAt || new Date())}</span>
                      </div>

                      {/* Skills tags */}
                      {item.candidate?.skills?.length ? (
                        <div className="flex flex-wrap gap-1.5 pt-2">
                          {item.candidate.skills.slice(0, 4).map((skill) => (
                            <span
                              key={skill}
                              className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  </div>

                  {/* Actions & Status Dropdown */}
                  <div className="flex items-center gap-3 self-start lg:self-center flex-wrap pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100 w-full lg:w-auto justify-between lg:justify-end">
                    {resumeHref ? (
                      <a
                        href={resumeHref}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-bold text-[#0f5daa] hover:bg-blue-100 transition"
                      >
                        <FileText size={14} />
                        <span>View Resume</span>
                        <ExternalLink size={12} />
                      </a>
                    ) : null}

                    {/* Status Dropdown */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-slate-400">Status:</span>
                      <select
                        value={item.status}
                        disabled={updateStatusMutation.isPending}
                        onChange={(e) =>
                          updateStatusMutation.mutate({ id: item._id, status: e.target.value })
                        }
                        className={`h-9 rounded-xl border px-3 text-xs font-bold transition focus:outline-none ${
                          STATUS_COLORS[item.status] || "bg-slate-50 text-slate-700 border-slate-200"
                        }`}
                      >
                        <option value="applied">Applied</option>
                        <option value="reviewing">Reviewing</option>
                        <option value="shortlisted">Shortlisted</option>
                        <option value="interview">Interview Scheduled</option>
                        <option value="offered">Offer Letter Sent</option>
                        <option value="hired">Hired 🎉</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      ) : null}

      {/* Empty State */}
      {!isLoading && filteredItems.length === 0 ? (
        <Card className="p-12 text-center border-dashed border-slate-200">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-blue-50 text-[#0f5daa] mb-4">
            <User size={28} />
          </div>
          <h3 className="text-base font-bold text-slate-900">No Candidate Applications Found</h3>
          <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
            {search || activeTab !== "all"
              ? "No candidate applications match your search filters."
              : "As soon as candidates apply to your job postings, their profiles and resumes will appear here."}
          </p>
          <Button asChild className="mt-5 bg-[#0f5daa] hover:bg-[#0c4d8c] text-white rounded-xl px-6 h-10 font-semibold text-xs shadow-2xs">
            <Link href="/recruiter/jobs">View Active Job Listings</Link>
          </Button>
        </Card>
      ) : null}
    </div>
  );
}
