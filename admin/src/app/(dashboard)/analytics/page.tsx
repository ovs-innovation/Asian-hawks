"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

type AnalyticsData = {
  dailyJobs?: { date: string; count: number }[];
  dailySignups?: { date: string; count: number }[];
};

export default function AnalyticsPage() {
  const { data, isLoading } = useQuery<AnalyticsData>({
    queryKey: ["admin-analytics"],
    queryFn: () => api("/admin/analytics"),
  });

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-xl font-bold text-[#111827]">Analytics</h2>
        <p className="text-sm text-[#6b7280] mt-0.5">7-day platform activity</p>
      </div>

      {isLoading ? (
        <div className="h-48 rounded-xl bg-[#f3f4f6] animate-pulse" />
      ) : (
        <>
          <div className="rounded-xl border border-[#e5e7eb] bg-white p-5">
            <h3 className="text-sm font-semibold text-[#374151] mb-4">Jobs Posted</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={data?.dailyJobs ?? []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#0f5daa" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="rounded-xl border border-[#e5e7eb] bg-white p-5">
            <h3 className="text-sm font-semibold text-[#374151] mb-4">New Signups</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={data?.dailySignups ?? []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#22c55e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  );
}
