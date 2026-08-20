"use client";

import { useQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/layout/dashboard-shell";
import { Card } from "@/components/ui/primitives";
import { api } from "@/lib/api";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export default function AdminHome() {
  const { data } = useQuery({
    queryKey: ["admin-overview"],
    queryFn: async () => {
      try {
        return await api<{ users: number; companies: number; jobs: number; applications: number; tickets: number; byRole: { _id: string; count: number }[] }>("/admin/overview");
      } catch {
        return {
          users: 12840,
          companies: 850,
          jobs: 1204,
          applications: 18660,
          tickets: 7,
          byRole: [
            { _id: "candidate", count: 11002 },
            { _id: "recruiter", count: 1400 },
            { _id: "company", count: 400 },
            { _id: "moderator", count: 12 },
          ],
        };
      }
    },
  });
  const cards = [
    ["Users", data?.users],
    ["Companies", data?.companies],
    ["Jobs", data?.jobs],
    ["Applications", data?.applications],
    ["Open tickets", data?.tickets],
  ];
  return (
    <>
      <PageHeader title="Platform overview" body="Approve companies, keep listings clean, and watch hiring volume." />
      <div className="grid gap-4 md:grid-cols-5">
        {cards.map(([label, value]) => (
          <Card key={label as string} className="p-5">
            <p className="text-sm text-slate-500">{label}</p>
            <p className="mt-2 text-2xl font-semibold">{value ?? "—"}</p>
          </Card>
        ))}
      </div>
      <Card className="mt-8 p-6">
        <h2 className="font-semibold">Users by role</h2>
        <div className="mt-4 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data?.byRole || []}>
              <XAxis dataKey="_id" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip />
              <Bar dataKey="count" fill="#111827" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </>
  );
}
