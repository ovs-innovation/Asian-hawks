"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/layout/dashboard-shell";
import { Card, Badge } from "@/components/ui/primitives";
import { api } from "@/lib/api";
import { timeAgo } from "@/lib/utils";
import { Briefcase } from "lucide-react";

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

const STATUS_TONE: Record<string, "blue" | "green" | "amber" | "red"> = {
  applied: "blue",
  reviewing: "blue",
  shortlisted: "green",
  interview: "amber",
  offered: "green",
  hired: "green",
  rejected: "red",
};

export default function AppliedPage() {
  const { data, isLoading } = useQuery<{ items: AppliedJobItem[] }>({
    queryKey: ["my-apps"],
    queryFn: () => api<{ items: AppliedJobItem[] }>("/applications/me"),
  });

  const items = data?.items ?? [];

  return (
    <>
      <PageHeader title="Applied jobs" body="Track every application from submitted to joined." />
      
      {isLoading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-16 animate-pulse rounded-xl bg-slate-100" />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((a) => (
            <Card key={a._id} className="flex flex-wrap items-center justify-between gap-3 p-5 transition hover:border-[#c7d7ea]">
              <div>
                <p className="font-bold text-slate-900">{a.job?.title || "Job Application"}</p>
                <p className="mt-0.5 text-xs text-slate-500">{a.job?.company?.name || "Asian Hawks"}</p>
                {a.createdAt ? (
                  <p className="mt-1 text-[11px] text-slate-400">Applied {timeAgo(a.createdAt)}</p>
                ) : null}
              </div>
              <Badge tone={STATUS_TONE[a.status] || "blue"} className="capitalize font-semibold">
                {a.status}
              </Badge>
            </Card>
          ))}

          {!items.length ? (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center">
              <Briefcase className="mx-auto text-slate-400" size={32} />
              <p className="mt-3 text-sm font-semibold text-slate-900">No job applications yet</p>
              <p className="mt-1 text-xs text-slate-500">Explore open banking, defence, and corporate roles and apply instantly.</p>
              <Link
                href="/jobs"
                className="mt-4 inline-flex h-9 items-center justify-center rounded-lg bg-[#0f5daa] px-4 text-xs font-semibold text-white hover:bg-[#0c4d8c]"
              >
                Browse Jobs
              </Link>
            </div>
          ) : null}
        </div>
      )}
    </>
  );
}
