"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";

type Taxonomy = { _id: string; name: string; type: string };

const TYPES = [
  { id: "skill", label: "Skills" },
  { id: "industry", label: "Industries" },
  { id: "location", label: "Locations" },
  { id: "city", label: "Cities" },
  { id: "country", label: "Countries" },
  { id: "employment_type", label: "Employment types" },
  { id: "experience_level", label: "Experience levels" },
  { id: "salary_range", label: "Salary ranges" },
];

function TaxonomyContent() {
  const sp = useSearchParams();
  const qc = useQueryClient();
  const type = sp.get("type") || "skill";
  const [name, setName] = useState("");

  const { data, isLoading } = useQuery<{ items: Taxonomy[] }>({
    queryKey: ["taxonomies", type],
    queryFn: () => api(`/taxonomies?type=${type}`),
  });

  const createMutation = useMutation({
    mutationFn: () => api("/admin/taxonomies", { method: "POST", body: JSON.stringify({ type, name }) }),
    onSuccess: () => {
      toast.success("Added");
      setName("");
      qc.invalidateQueries({ queryKey: ["taxonomies", type] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api(`/admin/taxonomies/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      toast.success("Deleted");
      qc.invalidateQueries({ queryKey: ["taxonomies", type] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="p-3 sm:p-6">
      <h2 className="mb-1 text-xl font-bold text-[#111827]">Taxonomy</h2>
      <p className="mb-5 text-sm text-[#6b7280]">Manage skills, industries, and locations used in job postings.</p>

      <div className="mb-5 flex flex-wrap gap-1">
        {TYPES.map((t) => (
          <Link
            key={t.id}
            href={`/taxonomy?type=${t.id}`}
            className={`rounded-full px-3 py-1 text-xs font-medium ${
              type === t.id ? "bg-[#0f5daa] text-white" : "bg-[#f3f4f6] text-[#6b7280]"
            }`}
          >
            {t.label}
          </Link>
        ))}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (name.trim()) createMutation.mutate();
        }}
        className="mb-5 flex gap-2"
      >
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={`New ${type.replace("_", " ")}...`}
          className="max-w-xs flex-1 rounded-lg border border-[#d1d5db] px-3 py-2 text-sm outline-none focus:border-[#0f5daa]"
        />
        <button
          type="submit"
          disabled={!name.trim() || createMutation.isPending}
          className="inline-flex items-center gap-1.5 rounded-lg bg-[#0f5daa] px-4 py-2 text-sm font-medium text-white hover:bg-[#0c4d8c] disabled:opacity-50"
        >
          <Plus className="h-4 w-4" />
          Add
        </button>
      </form>

      {isLoading ? (
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => <div key={i} className="h-10 animate-pulse rounded-lg bg-[#f3f4f6]" />)}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-[#e5e7eb] bg-white">
          <table className="w-full text-sm">
            <thead className="border-b border-[#e5e7eb] bg-[#f9fafb]">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-[#6b7280]">Name</th>
                <th className="px-4 py-3 text-right font-medium text-[#6b7280]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f3f4f6]">
              {(data?.items ?? []).map((item) => (
                <tr key={item._id}>
                  <td className="px-4 py-3 font-medium text-[#111827]">{item.name}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => { if (confirm("Delete this item?")) deleteMutation.mutate(item._id); }}
                      className="rounded p-1.5 text-[#9ca3af] hover:bg-red-50 hover:text-red-500"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
              {!data?.items?.length && (
                <tr>
                  <td colSpan={2} className="px-4 py-8 text-center text-[#9ca3af]">No items yet</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default function TaxonomyPage() {
  return (
    <Suspense>
      <TaxonomyContent />
    </Suspense>
  );
}
