"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PageHeader } from "@/components/layout/dashboard-shell";
import { Badge, Card, Input } from "@/components/ui/primitives";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { toast } from "sonner";

type User = { _id: string; name: string; email: string; role: string; status: string };

export default function AdminUsersPage() {
  const qc = useQueryClient();
  const [q, setQ] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("");
  const { data } = useQuery({
    queryKey: ["admin-users", q, role, status],
    queryFn: async () => {
      try {
        const params = new URLSearchParams();
        if (q) params.set("q", q);
        if (role) params.set("role", role);
        if (status) params.set("status", status);
        return await api<{ items: User[] }>(`/admin/users?${params.toString()}`);
      } catch {
        return { items: [] as User[] };
      }
    },
  });
  const patch = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      api(`/admin/users/${id}`, { method: "PATCH", body: JSON.stringify({ status }) }),
    onSuccess: () => {
      toast.success("User updated");
      qc.invalidateQueries({ queryKey: ["admin-users"] });
    },
  });
  return (
    <>
      <PageHeader title="Users" body="Every account on the platform." />
      <Card className="mb-6 p-4">
        <div className="grid gap-3 md:grid-cols-[1.5fr_1fr_1fr]">
          <Input placeholder="Search name or email" value={q} onChange={(e) => setQ(e.target.value)} />
          <select className="h-10 rounded-md border border-[#e7e7f1] px-3 text-sm" value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="">All roles</option>
            {["super_admin", "moderator", "recruiter", "hr_manager", "company", "candidate"].map((item) => <option key={item}>{item}</option>)}
          </select>
          <select className="h-10 rounded-md border border-[#e7e7f1] px-3 text-sm" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">All statuses</option>
            {["active", "pending", "suspended"].map((item) => <option key={item}>{item}</option>)}
          </select>
        </div>
      </Card>
      <div className="space-y-3">
        {data?.items?.map((u) => (
          <Card key={u._id} className="flex flex-wrap items-center justify-between gap-3 p-5">
            <div>
              <p className="font-medium">{u.name}</p>
              <p className="text-sm text-slate-500">{u.email} · {u.role}</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge tone={u.status === "active" ? "green" : "amber"}>{u.status}</Badge>
              {u.status !== "suspended" ? (
                <Button size="sm" variant="secondary" onClick={() => patch.mutate({ id: u._id, status: "suspended" })}>Suspend</Button>
              ) : (
                <Button size="sm" onClick={() => patch.mutate({ id: u._id, status: "active" })}>Activate</Button>
              )}
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}
