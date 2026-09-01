"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { api } from "@/lib/api";
import { timeAgo } from "@/lib/utils";
import { toast } from "sonner";

type User = {
  _id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
};

function UsersContent() {
  const sp = useSearchParams();
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const role = sp.get("role") ?? "";

  const { data, isLoading } = useQuery<{ items: User[]; total: number }>({
    queryKey: ["admin-users", role, search],
    queryFn: () => {
      const params = new URLSearchParams();
      if (role) params.set("role", role);
      if (search) params.set("q", search);
      params.set("limit", "30");
      return api(`/admin/users?${params}`);
    },
    placeholderData: (prev) => prev,
  });

  const patchMutation = useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: Record<string, unknown> }) =>
      api(`/admin/users/${id}`, { method: "PATCH", body: JSON.stringify(patch) }),
    onSuccess: () => { toast.success("User updated"); qc.invalidateQueries({ queryKey: ["admin-users"] }); },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="p-6">
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <h2 className="text-xl font-bold text-[#111827] flex-1">Users</h2>
        <input
          type="search"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="rounded-lg border border-[#d1d5db] px-3 py-1.5 text-sm outline-none focus:border-[#0f5daa] w-52"
        />
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {[...Array(6)].map((_, i) => <div key={i} className="h-12 rounded-lg bg-[#f3f4f6] animate-pulse" />)}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-[#e5e7eb] bg-white">
          <table className="w-full min-w-[650px] text-sm">
            <thead className="bg-[#f9fafb] border-b border-[#e5e7eb]">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-[#6b7280]">Name</th>
                <th className="px-4 py-3 text-left font-medium text-[#6b7280]">Email</th>
                <th className="px-4 py-3 text-left font-medium text-[#6b7280]">Role</th>
                <th className="px-4 py-3 text-left font-medium text-[#6b7280]">Status</th>
                <th className="px-4 py-3 text-left font-medium text-[#6b7280]">Joined</th>
                <th className="px-4 py-3 text-right font-medium text-[#6b7280]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f3f4f6]">
              {(data?.items ?? []).map((u) => (
                <tr key={u._id} className="hover:bg-[#f9fafb] transition">
                  <td className="px-4 py-3 font-medium text-[#111827]">{u.name}</td>
                  <td className="px-4 py-3 text-[#6b7280]">{u.email}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-[#eaf3fb] px-2 py-0.5 text-xs font-medium text-[#0f5daa]">
                      {u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      u.status === "active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    }`}>
                      {u.status ?? "active"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[#9ca3af]">{timeAgo(u.createdAt)}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() =>
                        patchMutation.mutate({
                          id: u._id,
                          patch: { status: u.status === "suspended" ? "active" : "suspended" },
                        })
                      }
                      className={`rounded px-2 py-1 text-xs font-medium transition ${
                        u.status === "suspended"
                          ? "bg-green-50 text-green-700 hover:bg-green-100"
                          : "bg-red-50 text-red-700 hover:bg-red-100"
                      }`}
                    >
                      {u.status === "suspended" ? "Activate" : "Suspend"}
                    </button>
                  </td>
                </tr>
              ))}
              {!data?.items?.length && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-[#9ca3af]">No users found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default function UsersPage() {
  return (
    <Suspense>
      <UsersContent />
    </Suspense>
  );
}
