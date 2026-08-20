"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, Suspense } from "react";
import { api } from "@/lib/api";
import { timeAgo } from "@/lib/utils";
import { toast } from "sonner";

type Company = {
  _id: string;
  name: string;
  status: string;
  verified: boolean;
  createdAt: string;
  jobCount?: number;
};

function CompaniesContent() {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");

  const { data, isLoading } = useQuery<{ items: Company[]; total: number }>({
    queryKey: ["admin-companies", search],
    queryFn: () => {
      const params = new URLSearchParams();
      if (search) params.set("q", search);
      params.set("limit", "30");
      return api(`/admin/companies?${params}`);
    },
    placeholderData: (prev) => prev,
  });

  const patchMutation = useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: Record<string, unknown> }) =>
      api(`/admin/companies/${id}`, { method: "PATCH", body: JSON.stringify(patch) }),
    onSuccess: () => { toast.success("Company updated"); qc.invalidateQueries({ queryKey: ["admin-companies"] }); },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="p-6">
      <div className="mb-5 flex items-center gap-3">
        <h2 className="text-xl font-bold text-[#111827] flex-1">Companies</h2>
        <input
          type="search"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="rounded-lg border border-[#d1d5db] px-3 py-1.5 text-sm outline-none focus:border-[#0f5daa] w-52"
        />
      </div>
      {isLoading ? (
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => <div key={i} className="h-12 rounded-lg bg-[#f3f4f6] animate-pulse" />)}
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-[#e5e7eb] bg-white">
          <table className="w-full text-sm">
            <thead className="bg-[#f9fafb] border-b border-[#e5e7eb]">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-[#6b7280]">Name</th>
                <th className="px-4 py-3 text-left font-medium text-[#6b7280]">Status</th>
                <th className="px-4 py-3 text-left font-medium text-[#6b7280]">Verified</th>
                <th className="px-4 py-3 text-left font-medium text-[#6b7280]">Jobs</th>
                <th className="px-4 py-3 text-left font-medium text-[#6b7280]">Created</th>
                <th className="px-4 py-3 text-right font-medium text-[#6b7280]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f3f4f6]">
              {(data?.items ?? []).map((c) => (
                <tr key={c._id} className="hover:bg-[#f9fafb] transition">
                  <td className="px-4 py-3 font-medium text-[#111827]">{c.name}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      c.status === "approved" ? "bg-green-100 text-green-700"
                      : c.status === "pending" ? "bg-amber-100 text-amber-700"
                      : "bg-[#f3f4f6] text-[#6b7280]"
                    }`}>{c.status}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${c.verified ? "bg-blue-100 text-blue-700" : "bg-[#f3f4f6] text-[#9ca3af]"}`}>
                      {c.verified ? "Verified" : "Unverified"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[#6b7280]">{c.jobCount ?? 0}</td>
                  <td className="px-4 py-3 text-[#9ca3af]">{timeAgo(c.createdAt)}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="inline-flex gap-1">
                      {c.status !== "approved" && (
                        <button
                          onClick={() => patchMutation.mutate({ id: c._id, patch: { status: "approved" } })}
                          className="rounded px-2 py-1 text-xs bg-green-50 text-green-700 hover:bg-green-100 transition"
                        >
                          Approve
                        </button>
                      )}
                      <button
                        onClick={() => patchMutation.mutate({ id: c._id, patch: { verified: !c.verified } })}
                        className="rounded px-2 py-1 text-xs bg-blue-50 text-blue-700 hover:bg-blue-100 transition"
                      >
                        {c.verified ? "Unverify" : "Verify"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!data?.items?.length && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-[#9ca3af]">No companies found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default function CompaniesPage() {
  return <Suspense><CompaniesContent /></Suspense>;
}
