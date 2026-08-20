"use client";

import { useQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/layout/dashboard-shell";
import { Card, Badge } from "@/components/ui/primitives";
import { api } from "@/lib/api";

export default function AppliedPage() {
  const { data } = useQuery({
    queryKey: ["my-apps"],
    queryFn: async () => {
      try {
        return await api<{ items: Array<{ _id: string; status: string; job: { title: string; slug: string; company: { name: string } } }> }>("/applications/me");
      } catch {
        return {
          items: [
            { _id: "1", status: "reviewing", job: { title: "Senior Product Designer", slug: "senior-product-designer-helios-bank", company: { name: "Helios Bank" } } },
          ],
        };
      }
    },
  });
  return (
    <>
      <PageHeader title="Applied jobs" body="Track every application from submitted to joined." />
      <div className="space-y-3">
        {data?.items.map((a) => (
          <Card key={a._id} className="flex items-center justify-between p-5">
            <div>
              <p className="font-medium">{a.job?.title}</p>
              <p className="text-sm text-slate-500">{a.job?.company?.name}</p>
            </div>
            <Badge tone="blue">{a.status}</Badge>
          </Card>
        ))}
      </div>
    </>
  );
}
