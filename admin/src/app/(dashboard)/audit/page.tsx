"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

type AuditLog = {
  _id: string;
  action: string;
  actor?: { name: string; email: string };
  resource?: string;
  createdAt: string;
};

export default function AuditPage() {
  const { data, isLoading } = useQuery<{ items: AuditLog[] }>({
    queryKey: ["admin-audit"],
    queryFn: () => api("/admin/audit"),
  });

  return (
    <div className="p-3 sm:p-6">
      <div className="mb-5">
        <h2 className="text-xl font-bold text-[#111827]">Audit Log</h2>
        <p className="text-sm text-[#6b7280] mt-0.5">All admin actions recorded here</p>
      </div>
      {isLoading ? (
        <div className="space-y-2">
          {[...Array(8)].map((_, i) => <div key={i} className="h-10 rounded-lg bg-[#f3f4f6] animate-pulse" />)}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-[#e5e7eb] bg-white">
          <table className="w-full min-w-[550px] text-sm">
            <thead className="bg-[#f9fafb] border-b border-[#e5e7eb]">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-[#6b7280]">Action</th>
                <th className="px-4 py-3 text-left font-medium text-[#6b7280]">Actor</th>
                <th className="px-4 py-3 text-left font-medium text-[#6b7280]">Target</th>
                <th className="px-4 py-3 text-left font-medium text-[#6b7280]">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f3f4f6]">
              {(data?.items ?? []).map((l) => (
                <tr key={l._id} className="hover:bg-[#f9fafb] transition">
                  <td className="px-4 py-3 font-medium text-[#111827]">{l.action}</td>
                  <td className="px-4 py-3 text-[#6b7280]">{l.actor?.name ?? "System"}</td>
                  <td className="px-4 py-3 text-[#9ca3af] font-mono text-xs">{l.resource ?? "—"}</td>
                  <td className="px-4 py-3 text-[#9ca3af]">{new Date(l.createdAt).toLocaleString("en-IN")}</td>
                </tr>
              ))}
              {!data?.items?.length && (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-[#9ca3af]">No audit logs</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
