"use client";

import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Bookmark,
  BookmarkCheck,
  Briefcase,
  Building2,
  MapPin,
  Trash2,
  ArrowRight,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/layout/dashboard-shell";
import { Badge, Card } from "@/components/ui/primitives";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { timeAgo } from "@/lib/utils";

type SavedJob = {
  _id: string;
  title: string;
  slug: string;
  category?: string;
  employmentType?: string;
  location?: string;
  salaryText?: string;
  urgent?: boolean;
  featured?: boolean;
  company?: {
    name?: string;
    logo?: string;
    location?: string;
  };
  createdAt?: string;
};

export default function CandidateSavedJobsPage() {
  const qc = useQueryClient();

  const { data, isLoading, isError, error, refetch } = useQuery<{ items: SavedJob[] }>({
    queryKey: ["saved-jobs"],
    queryFn: () => api<{ items: SavedJob[] }>("/jobs/saved"),
  });

  const toggleSaveMutation = useMutation({
    mutationFn: (jobId: string) => api(`/jobs/${jobId}/save`, { method: "POST" }),
    onSuccess: (res: any) => {
      toast.success("Saved jobs updated");
      qc.invalidateQueries({ queryKey: ["saved-jobs"] });
      qc.invalidateQueries({ queryKey: ["my-apps"] });
    },
    onError: (err: Error) => {
      toast.error(err.message || "Could not update saved job");
    },
  });

  const savedJobs = data?.items ?? [];

  return (
    <div className="space-y-8 pb-12">
      <PageHeader
        title="Saved Jobs"
        body="Keep track of job openings you're interested in and apply when you're ready."
        action={
          <Button asChild className="bg-[#0f5daa] hover:bg-[#0c4d8c] text-white shadow-xs rounded-xl px-5 h-11 font-semibold">
            <Link href="/jobs" className="flex items-center gap-2">
              <Briefcase size={16} />
              <span>Browse All Openings</span>
            </Link>
          </Button>
        }
      />

      {/* Stats Summary Bar */}
      <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-amber-50 text-amber-600 font-bold">
            <Bookmark size={20} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Bookmarked Roles</h3>
            <p className="text-xs text-slate-500">
              {savedJobs.length === 1 ? "1 saved job in your list" : `${savedJobs.length} saved jobs in your list`}
            </p>
          </div>
        </div>

        <Link
          href="/jobs"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0f5daa] hover:underline"
        >
          <span>Explore More Jobs</span>
          <ArrowRight size={14} />
        </Link>
      </div>

      {/* Error state */}
      {isError ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-xs font-medium text-red-800 flex items-center justify-between">
          <span>{error instanceof Error ? error.message : "Failed to load saved jobs"}</span>
          <button type="button" onClick={() => refetch()} className="font-bold underline">
            Retry
          </button>
        </div>
      ) : null}

      {/* Loading state */}
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-28 animate-pulse rounded-2xl bg-slate-100" />
          ))}
        </div>
      ) : null}

      {/* Saved Jobs List */}
      {!isLoading && savedJobs.length > 0 ? (
        <div className="grid gap-4">
          {savedJobs.map((j) => (
            <Card
              key={j._id}
              className="group relative p-6 hover:border-blue-200 hover:shadow-md transition-all border-slate-200"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                <div className="flex items-start gap-4">
                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-slate-100 text-slate-700 font-bold text-lg group-hover:bg-blue-50 group-hover:text-[#0f5daa] transition-colors border border-slate-200/60">
                    <Building2 size={22} />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Link
                        href={`/jobs/${j.slug}`}
                        className="font-bold text-slate-900 text-base hover:text-[#0f5daa] transition-colors"
                      >
                        {j.title}
                      </Link>
                      {j.category === "Government" && <Badge tone="blue">Government</Badge>}
                      {j.urgent && <Badge tone="amber">Urgent</Badge>}
                    </div>

                    <p className="text-xs font-medium text-slate-500 flex items-center gap-3 flex-wrap">
                      <span className="font-semibold text-slate-700">{j.company?.name || "Asian Hawks Manpower"}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <MapPin size={12} className="text-slate-400" />
                        {j.location || "Pan India"}
                      </span>
                      {j.salaryText ? (
                        <>
                          <span>•</span>
                          <span className="font-semibold text-slate-700">{j.salaryText}</span>
                        </>
                      ) : null}
                    </p>

                    <p className="text-[11px] text-slate-400">
                      Saved {j.createdAt ? timeAgo(j.createdAt) : "Recently"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-start sm:self-center">
                  <Button
                    size="sm"
                    asChild
                    className="bg-[#0f5daa] hover:bg-[#0c4d8c] text-white rounded-xl px-4 h-9 font-semibold text-xs shadow-2xs"
                  >
                    <Link href={`/jobs/${j.slug}`}>View & Apply</Link>
                  </Button>

                  <button
                    type="button"
                    onClick={() => toggleSaveMutation.mutate(j._id)}
                    disabled={toggleSaveMutation.isPending}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-500 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition"
                    title="Remove from Saved Jobs"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : null}

      {/* Empty State */}
      {!isLoading && savedJobs.length === 0 ? (
        <Card className="p-12 text-center border-dashed border-slate-200">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-amber-50 text-amber-600 mb-4">
            <Bookmark size={28} />
          </div>
          <h3 className="text-base font-bold text-slate-900">No Saved Jobs Yet</h3>
          <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
            When you find a job role you like, click the bookmark icon on any job card to save it here for quick access.
          </p>
          <Button asChild className="mt-5 bg-[#0f5daa] hover:bg-[#0c4d8c] text-white rounded-xl px-6 h-10 font-semibold text-xs shadow-2xs">
            <Link href="/jobs">Explore All Jobs</Link>
          </Button>
        </Card>
      ) : null}
    </div>
  );
}
