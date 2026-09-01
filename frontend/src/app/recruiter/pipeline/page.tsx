"use client";

import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { PageHeader } from "@/components/layout/dashboard-shell";
import { Badge, Card } from "@/components/ui/primitives";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { User } from "lucide-react";

type AppItem = {
  _id: string;
  status: string;
  candidate?: { name?: string; email?: string; headline?: string };
  job?: { title?: string };
};

export default function PipelinePage() {
  const qc = useQueryClient();

  const { data, isLoading } = useQuery<{ items: AppItem[] }>({
    queryKey: ["pipeline"],
    queryFn: () => api<{ items: AppItem[] }>("/applications/pipeline"),
  });

  const mutate = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      api(`/applications/${id}`, { method: "PATCH", body: JSON.stringify({ status }) }),
    onSuccess: () => {
      toast.success("Candidate status updated");
      qc.invalidateQueries({ queryKey: ["pipeline"] });
      qc.invalidateQueries({ queryKey: ["recruiter-applications"] });
    },
  });

  const items = data?.items ?? [];

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title="Candidate Pipeline"
        body="Shortlist, reject, or move candidates to interview directly."
      />

      {isLoading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-20 animate-pulse rounded-2xl bg-slate-100" />
          ))}
        </div>
      ) : null}

      {!isLoading && items.length > 0 ? (
        <div className="space-y-3">
          {items.map((a) => (
            <Card key={a._id} className="flex flex-wrap items-center justify-between gap-4 p-5 border-slate-200">
              <div>
                <p className="font-bold text-slate-900 text-base">{a.candidate?.name || "Candidate"}</p>
                <p className="text-xs font-medium text-slate-500 mt-0.5">
                  Applied for <span className="font-semibold text-[#0f5daa]">{a.job?.title || "Job Role"}</span>
                  {a.candidate?.headline ? ` • ${a.candidate.headline}` : ""}
                </p>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <Badge tone="blue" className="capitalize">
                  {a.status}
                </Badge>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => mutate.mutate({ id: a._id, status: "shortlisted" })}
                  disabled={mutate.isPending}
                >
                  Shortlist
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => mutate.mutate({ id: a._id, status: "rejected" })}
                  disabled={mutate.isPending}
                  className="text-red-600 hover:bg-red-50"
                >
                  Reject
                </Button>
                <Button
                  size="sm"
                  onClick={() => mutate.mutate({ id: a._id, status: "hired" })}
                  disabled={mutate.isPending}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
                >
                  Hire
                </Button>
              </div>
            </Card>
          ))}
        </div>
      ) : null}

      {!isLoading && items.length === 0 ? (
        <Card className="p-12 text-center border-dashed border-slate-200">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-blue-50 text-[#0f5daa] mb-3">
            <User size={24} />
          </div>
          <h3 className="text-base font-bold text-slate-900">No Candidates in Pipeline</h3>
          <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
            Candidates who apply to your posted jobs will appear here in the hiring pipeline.
          </p>
          <Button asChild className="mt-4 bg-[#0f5daa] text-white rounded-xl px-5 h-9 text-xs font-semibold">
            <Link href="/recruiter/jobs">View Your Job Listings</Link>
          </Button>
        </Card>
      ) : null}
    </div>
  );
}
