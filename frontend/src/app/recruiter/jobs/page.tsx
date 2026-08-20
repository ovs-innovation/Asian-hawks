"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PageHeader } from "@/components/layout/dashboard-shell";
import { Badge, Card } from "@/components/ui/primitives";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import Link from "next/link";
import { toast } from "sonner";

type Job = { _id: string; title: string; status: string; applicationsCount: number; location: string };

export default function RecruiterJobsPage() {
  const qc = useQueryClient();
  const { data } = useQuery({
    queryKey: ["rec-jobs"],
    queryFn: async () => {
      try {
        return await api<{ items: Job[] }>("/recruiter/jobs");
      } catch {
        return { items: [] as Job[] };
      }
    },
  });
  const patch = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      api(`/jobs/${id}`, { method: "PATCH", body: JSON.stringify({ status }) }),
    onSuccess: () => {
      toast.success("Job updated");
      qc.invalidateQueries({ queryKey: ["rec-jobs"] });
    },
  });
  return (
    <>
      <PageHeader title="Manage jobs" body="Draft, publish, pause, or duplicate a requisition." action={<Button asChild><Link href="/recruiter/jobs/new">Post job</Link></Button>} />
      <div className="space-y-3">
        {data?.items?.length ? data.items.map((j) => (
          <Card key={j._id} className="flex flex-wrap items-center justify-between gap-3 p-5">
            <div>
              <p className="font-medium">{j.title}</p>
              <p className="text-sm text-slate-500">{j.location} · {j.applicationsCount} applications</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge>{j.status}</Badge>
              {j.status === "published" ? (
                <Button size="sm" variant="secondary" onClick={() => patch.mutate({ id: j._id, status: "paused" })}>Pause</Button>
              ) : (
                <Button size="sm" onClick={() => patch.mutate({ id: j._id, status: "published" })}>Publish</Button>
              )}
            </div>
          </Card>
        )) : <p className="text-sm text-slate-500">No jobs yet. Post your first role.</p>}
      </div>
    </>
  );
}
