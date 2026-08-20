"use client";

import { useQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/layout/dashboard-shell";
import { Card } from "@/components/ui/primitives";
import { api } from "@/lib/api";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export default function RecruiterHome() {
  const { data } = useQuery({
    queryKey: ["rec-analytics"],
    queryFn: async () => {
      try {
        return await api<{ jobs: number; applications: number; hired: number; pipeline: { _id: string; count: number }[] }>("/recruiter/analytics");
      } catch {
        return {
          jobs: 6,
          applications: 48,
          hired: 3,
          pipeline: [
            { _id: "applied", count: 18 },
            { _id: "reviewing", count: 12 },
            { _id: "shortlisted", count: 8 },
            { _id: "interview", count: 6 },
            { _id: "hired", count: 3 },
          ],
        };
      }
    },
  });
  return (
    <>
      <PageHeader title="Hiring overview" body="What moved this week, without opening a spreadsheet." />
      <div className="grid gap-5 md:grid-cols-3">
        <Card className="p-6"><p className="text-sm text-slate-500">Open jobs</p><p className="mt-2 text-3xl font-semibold">{data?.jobs ?? "—"}</p></Card>
        <Card className="p-6"><p className="text-sm text-slate-500">Applications</p><p className="mt-2 text-3xl font-semibold">{data?.applications ?? "—"}</p></Card>
        <Card className="p-6"><p className="text-sm text-slate-500">Hired</p><p className="mt-2 text-3xl font-semibold">{data?.hired ?? "—"}</p></Card>
      </div>
      <Card className="mt-8 p-6">
        <h2 className="font-semibold">Pipeline</h2>
        <div className="mt-4 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data?.pipeline || []}>
              <XAxis dataKey="_id" fontSize={12} />
              <YAxis fontSize={12} allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#2563EB" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </>
  );
}
