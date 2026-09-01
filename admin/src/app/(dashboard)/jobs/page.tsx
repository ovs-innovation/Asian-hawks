"use client";

import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { timeAgo } from "@/lib/utils";
import { toast } from "sonner";
import { Trash2, Eye, Star, Zap, Pencil, Plus } from "lucide-react";

type Job = {
  _id: string;
  title: string;
  slug: string;
  status: string;
  featured: boolean;
  urgent: boolean;
  category?: string;
  createdAt: string;
  company?: { name: string };
};

type Category = { _id: string; name: string };

function JobsContent() {
  const sp = useSearchParams();
  const router = useRouter();
  const qc = useQueryClient();

  const [search, setSearch] = useState("");
  const status = sp.get("status") ?? "";
  const featured = sp.get("featured") ?? "";
  const category = sp.get("category") ?? "";
  const page = Number(sp.get("page") ?? 1);

  const { data: categoryData } = useQuery<{ items: Category[] }>({
    queryKey: ["admin-categories"],
    queryFn: () => api("/admin/categories"),
  });

  const { data, isLoading } = useQuery<{ items: Job[]; total: number; pages?: number }>({
    queryKey: ["admin-jobs", status, featured, category, page, search],
    queryFn: () => {
      const params = new URLSearchParams();
      if (status) params.set("status", status);
      if (featured) params.set("featured", featured);
      if (category) params.set("category", category);
      if (search) params.set("q", search);
      params.set("page", String(page));
      params.set("limit", "20");
      return api(`/admin/jobs?${params}`);
    },
    placeholderData: (prev) => prev,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api(`/admin/jobs/${id}`, { method: "DELETE" }),
    onSuccess: () => { toast.success("Job deleted"); qc.invalidateQueries({ queryKey: ["admin-jobs"] }); },
    onError: (e: Error) => toast.error(e.message),
  });

  const patchMutation = useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: Record<string, unknown> }) =>
      api(`/admin/jobs/${id}`, { method: "PATCH", body: JSON.stringify(patch) }),
    onSuccess: () => { toast.success("Updated"); qc.invalidateQueries({ queryKey: ["admin-jobs"] }); },
    onError: (e: Error) => toast.error(e.message),
  });

  const statuses = ["", "published", "paused", "expired", "draft"];

  function pushFilters(next: { status?: string; featured?: string; category?: string }) {
    const params = new URLSearchParams();
    const nextStatus = next.status ?? status;
    const nextFeatured = next.featured ?? featured;
    const nextCategory = next.category ?? category;
    if (nextStatus) params.set("status", nextStatus);
    if (nextFeatured) params.set("featured", nextFeatured);
    if (nextCategory) params.set("category", nextCategory);
    const qs = params.toString();
    router.push(qs ? `/jobs?${qs}` : "/jobs");
  }

  return (
    <div className="p-6">
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <div className="flex-1">
          <h2 className="text-xl font-bold text-[#111827]">Jobs</h2>
          <p className="text-sm text-[#6b7280]">{data?.total ?? 0} postings</p>
        </div>
        <input
          type="search"
          placeholder="Search jobs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-52 rounded-lg border border-[#d1d5db] px-3 py-1.5 text-sm outline-none focus:border-[#0f5daa]"
        />
        <select
          value={category}
          onChange={(e) => pushFilters({ category: e.target.value })}
          className="rounded-lg border border-[#d1d5db] px-3 py-1.5 text-sm outline-none focus:border-[#0f5daa]"
        >
          <option value="">All categories</option>
          {(categoryData?.items ?? []).map((c) => (
            <option key={c._id} value={c.name}>{c.name}</option>
          ))}
        </select>
        <Link
          href="/jobs/new"
          className="inline-flex items-center gap-1.5 rounded-lg bg-[#0f5daa] px-4 py-2 text-sm font-semibold text-white hover:bg-[#0c4d8c]"
        >
          <Plus className="h-4 w-4" />
          Create job
        </Link>
      </div>

      <div className="mb-4 flex flex-wrap gap-1">
        {statuses.map((s) => (
          <button
            key={s || "all"}
            onClick={() => pushFilters({ status: s })}
            className={`rounded-full px-3 py-1 text-xs font-medium transition ${
              status === s ? "bg-[#0f5daa] text-white" : "bg-[#f3f4f6] text-[#6b7280] hover:bg-[#e5e7eb]"
            }`}
          >
            {s || "All"}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-12 animate-pulse rounded-lg bg-[#f3f4f6]" />
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-[#e5e7eb] bg-white">
          <table className="w-full min-w-[700px] text-sm">
            <thead className="border-b border-[#e5e7eb] bg-[#f9fafb]">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-[#6b7280]">Title</th>
                <th className="px-4 py-3 text-left font-medium text-[#6b7280]">Category</th>
                <th className="px-4 py-3 text-left font-medium text-[#6b7280]">Company</th>
                <th className="px-4 py-3 text-left font-medium text-[#6b7280]">Status</th>
                <th className="px-4 py-3 text-left font-medium text-[#6b7280]">Posted</th>
                <th className="px-4 py-3 text-right font-medium text-[#6b7280]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f3f4f6]">
              {(data?.items ?? []).map((job) => (
                <tr key={job._id} className="transition hover:bg-[#f9fafb]">
                  <td className="px-4 py-3 font-medium text-[#111827]">
                    <Link href={`/jobs/${job._id}/edit`} className="hover:text-[#0f5daa]">
                      {job.title}
                    </Link>
                    {job.featured && <Star className="ml-1 inline h-3 w-3 text-amber-500" />}
                    {job.urgent && <Zap className="ml-1 inline h-3 w-3 text-red-500" />}
                  </td>
                  <td className="px-4 py-3 text-[#6b7280]">{job.category ?? "—"}</td>
                  <td className="px-4 py-3 text-[#6b7280]">{job.company?.name ?? "—"}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                      job.status === "published" ? "bg-green-100 text-green-700"
                      : job.status === "draft" ? "bg-amber-100 text-amber-700"
                      : "bg-[#f3f4f6] text-[#6b7280]"
                    }`}>
                      {job.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[#9ca3af]">{timeAgo(job.createdAt)}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="inline-flex gap-1">
                      {job.status === "draft" && (
                        <button
                          onClick={() => patchMutation.mutate({ id: job._id, patch: { status: "published" } })}
                          className="rounded px-2 py-1 text-xs bg-green-50 text-green-700 transition hover:bg-green-100"
                        >
                          Publish
                        </button>
                      )}
                      <Link
                        href={`/jobs/${job._id}/edit`}
                        className="rounded p-1.5 text-[#9ca3af] transition hover:bg-blue-50 hover:text-[#0f5daa]"
                        title="Edit"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Link>
                      <button
                        onClick={() => patchMutation.mutate({ id: job._id, patch: { featured: !job.featured } })}
                        title={job.featured ? "Unfeature" : "Feature"}
                        className="rounded p-1.5 text-[#9ca3af] transition hover:bg-amber-50 hover:text-amber-500"
                      >
                        <Star className="h-3.5 w-3.5" />
                      </button>
                      {job.slug ? (
                        <a
                          href={`http://localhost:3000/jobs/${job.slug}`}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded p-1.5 text-[#9ca3af] transition hover:bg-blue-50 hover:text-[#0f5daa]"
                          title="Preview"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </a>
                      ) : null}
                      <button
                        onClick={() => { if (confirm("Delete this job?")) deleteMutation.mutate(job._id); }}
                        className="rounded p-1.5 text-[#9ca3af] transition hover:bg-red-50 hover:text-red-500"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!data?.items?.length && (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-[#9ca3af]">
                    No jobs found.{" "}
                    <Link href="/jobs/new" className="font-medium text-[#0f5daa] underline">Create one</Link>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default function JobsPage() {
  return (
    <Suspense>
      <JobsContent />
    </Suspense>
  );
}
