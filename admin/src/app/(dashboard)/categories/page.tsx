"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { Pencil, Trash2, Plus, Check, X } from "lucide-react";
import Link from "next/link";

type Category = { _id: string; name: string; slug: string; jobCount?: number };

export default function CategoriesPage() {
  const qc = useQueryClient();
  const [newName, setNewName] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  const { data, isLoading } = useQuery<{ items: Category[] }>({
    queryKey: ["admin-categories"],
    queryFn: () => api("/admin/categories"),
  });

  const createMutation = useMutation({
    mutationFn: (name: string) => api("/admin/categories", { method: "POST", body: JSON.stringify({ name }) }),
    onSuccess: () => { toast.success("Category created"); setNewName(""); qc.invalidateQueries({ queryKey: ["admin-categories"] }); },
    onError: (e: Error) => toast.error(e.message),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) =>
      api(`/admin/categories/${id}`, { method: "PATCH", body: JSON.stringify({ name }) }),
    onSuccess: () => { toast.success("Updated"); setEditId(null); qc.invalidateQueries({ queryKey: ["admin-categories"] }); },
    onError: (e: Error) => toast.error(e.message),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api(`/admin/categories/${id}`, { method: "DELETE" }),
    onSuccess: () => { toast.success("Deleted"); qc.invalidateQueries({ queryKey: ["admin-categories"] }); },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="p-6">
      <div className="mb-5 flex items-center gap-3">
        <h2 className="flex-1 text-xl font-bold text-[#111827]">Categories</h2>
        <Link
          href="/jobs/new"
          className="rounded-lg bg-[#0f5daa] px-4 py-2 text-sm font-semibold text-white hover:bg-[#0c4d8c]"
        >
          Post a job
        </Link>
      </div>

      {/* Add new */}
      <form
        onSubmit={(e) => { e.preventDefault(); if (newName.trim()) createMutation.mutate(newName.trim()); }}
        className="mb-5 flex gap-2"
      >
        <input
          type="text"
          placeholder="New category name..."
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          className="rounded-lg border border-[#d1d5db] px-3 py-2 text-sm outline-none focus:border-[#0f5daa] flex-1 max-w-xs"
        />
        <button
          type="submit"
          disabled={createMutation.isPending || !newName.trim()}
          className="inline-flex items-center gap-1.5 rounded-lg bg-[#0f5daa] px-4 py-2 text-sm font-medium text-white hover:bg-[#0c4d8c] disabled:opacity-50 transition"
        >
          <Plus className="h-4 w-4" />
          Add
        </button>
      </form>

      {isLoading ? (
        <div className="space-y-2">
          {[...Array(6)].map((_, i) => <div key={i} className="h-10 rounded-lg bg-[#f3f4f6] animate-pulse" />)}
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-[#e5e7eb] bg-white">
          <table className="w-full text-sm">
            <thead className="bg-[#f9fafb] border-b border-[#e5e7eb]">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-[#6b7280]">Name</th>
                <th className="px-4 py-3 text-left font-medium text-[#6b7280]">Slug</th>
                <th className="px-4 py-3 text-left font-medium text-[#6b7280]">Jobs</th>
                <th className="px-4 py-3 text-right font-medium text-[#6b7280]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f3f4f6]">
              {(data?.items ?? []).map((cat) => (
                <tr key={cat._id} className="hover:bg-[#f9fafb] transition">
                  <td className="px-4 py-3">
                    {editId === cat._id ? (
                      <input
                        autoFocus
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="rounded border border-[#d1d5db] px-2 py-1 text-sm outline-none focus:border-[#0f5daa]"
                      />
                    ) : (
                      <Link href={`/jobs?category=${encodeURIComponent(cat.name)}`} className="font-medium text-[#111827] hover:text-[#0f5daa]">
                        {cat.name}
                      </Link>
                    )}
                  </td>
                  <td className="px-4 py-3 text-[#9ca3af] font-mono text-xs">{cat.slug}</td>
                  <td className="px-4 py-3 text-[#6b7280]">{cat.jobCount ?? 0}</td>
                  <td className="px-4 py-3 text-right">
                    {editId === cat._id ? (
                      <div className="inline-flex gap-1">
                        <button
                          onClick={() => updateMutation.mutate({ id: cat._id, name: editName })}
                          className="rounded p-1.5 text-green-600 hover:bg-green-50 transition"
                        ><Check className="h-3.5 w-3.5" /></button>
                        <button
                          onClick={() => setEditId(null)}
                          className="rounded p-1.5 text-[#9ca3af] hover:bg-[#f3f4f6] transition"
                        ><X className="h-3.5 w-3.5" /></button>
                      </div>
                    ) : (
                      <div className="inline-flex gap-1">
                        <Link
                          href={`/jobs/new?category=${encodeURIComponent(cat.name)}`}
                          className="rounded px-2 py-1 text-xs text-[#0f5daa] hover:bg-blue-50"
                        >
                          Post job
                        </Link>
                        <button
                          onClick={() => { setEditId(cat._id); setEditName(cat.name); }}
                          className="rounded p-1.5 text-[#9ca3af] transition hover:bg-blue-50 hover:text-[#0f5daa]"
                        ><Pencil className="h-3.5 w-3.5" /></button>
                        <button
                          onClick={() => { if (confirm("Delete category?")) deleteMutation.mutate(cat._id); }}
                          className="rounded p-1.5 text-[#9ca3af] transition hover:bg-red-50 hover:text-red-500"
                        ><Trash2 className="h-3.5 w-3.5" /></button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
