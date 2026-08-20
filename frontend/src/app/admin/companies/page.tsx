"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PageHeader } from "@/components/layout/dashboard-shell";
import { Badge, Card, Input } from "@/components/ui/primitives";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { toast } from "sonner";

type Company = { _id: string; name: string; industry: string; status: string; verified: boolean };

export default function AdminCompaniesPage() {
  const qc = useQueryClient();
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const { data } = useQuery({
    queryKey: ["admin-companies", q, status],
    queryFn: async () => {
      try {
        const params = new URLSearchParams();
        if (q) params.set("q", q);
        if (status) params.set("status", status);
        return await api<{ items: Company[] }>(`/admin/companies?${params.toString()}`);
      } catch {
        return { items: [] as Company[] };
      }
    },
  });
  const patch = useMutation({
    mutationFn: (payload: { id: string; status: string; verified: boolean }) =>
      api(`/admin/companies/${payload.id}`, { method: "PATCH", body: JSON.stringify({ status: payload.status, verified: payload.verified }) }),
    onSuccess: () => {
      toast.success("Company updated");
      qc.invalidateQueries({ queryKey: ["admin-companies"] });
    },
  });
  return (
    <>
      <PageHeader title="Companies" body="Verify employers before they publish." />
      <Card className="mb-6 p-4">
        <div className="grid gap-3 md:grid-cols-[1.5fr_1fr]">
          <Input placeholder="Search company or industry" value={q} onChange={(e) => setQ(e.target.value)} />
          <select className="h-10 rounded-md border border-[#e7e7f1] px-3 text-sm" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">All statuses</option>
            {["pending", "approved", "rejected"].map((item) => <option key={item}>{item}</option>)}
          </select>
        </div>
      </Card>
      <div className="space-y-3">
        {data?.items?.map((c) => (
          <Card key={c._id} className="flex flex-wrap items-center justify-between gap-3 p-5">
            <div>
              <p className="font-medium">{c.name}</p>
              <p className="text-sm text-slate-500">{c.industry}</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge tone={c.status === "approved" ? "green" : "amber"}>{c.status}</Badge>
              {c.status !== "approved" && (
                <Button size="sm" onClick={() => patch.mutate({ id: c._id, status: "approved", verified: true })}>Approve</Button>
              )}
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}
