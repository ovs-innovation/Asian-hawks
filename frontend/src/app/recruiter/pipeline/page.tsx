"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { PageHeader } from "@/components/layout/dashboard-shell";
import { Badge, Card } from "@/components/ui/primitives";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";

type AppItem = {
  _id: string;
  status: string;
  candidate: { name: string; email: string; headline?: string };
  job: { title: string };
};

export default function PipelinePage() {
  const qc = useQueryClient();
  const { data } = useQuery({
    queryKey: ["pipeline"],
    queryFn: async () => {
      try {
        return await api<{ items: AppItem[] }>("/applications/pipeline");
      } catch {
        return {
          items: [
            { _id: "1", status: "applied", candidate: { name: "Maya Chen", email: "maya@example.com", headline: "Product designer" }, job: { title: "Senior Product Designer" } },
          ],
        };
      }
    },
  });
  const mutate = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      api(`/applications/${id}`, { method: "PATCH", body: JSON.stringify({ status }) }),
    onSuccess: () => {
      toast.success("Status updated");
      qc.invalidateQueries({ queryKey: ["pipeline"] });
    },
  });
  return (
    <>
      <PageHeader title="Candidate pipeline" body="Shortlist, reject, or move to interview without leaving this table." />
      <div className="space-y-3">
        {data?.items.map((a) => (
          <Card key={a._id} className="flex flex-wrap items-center justify-between gap-3 p-5">
            <div>
              <p className="font-medium">{a.candidate?.name}</p>
              <p className="text-sm text-slate-500">{a.job?.title} · {a.candidate?.headline}</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge tone="blue">{a.status}</Badge>
              <Button size="sm" variant="secondary" onClick={() => mutate.mutate({ id: a._id, status: "shortlisted" })}>Shortlist</Button>
              <Button size="sm" variant="secondary" onClick={() => mutate.mutate({ id: a._id, status: "rejected" })}>Reject</Button>
              <Button size="sm" onClick={() => mutate.mutate({ id: a._id, status: "hired" })}>Hire</Button>
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}
