"use client";

import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { Plus, Pencil, Trash2 } from "lucide-react";

type Course = {
  _id: string;
  title: string;
  slug: string;
  category?: string;
  classFormat?: string;
  mode?: string;
  status: string;
  price?: number;
  featured?: boolean;
};

const FORMAT_LABEL: Record<string, string> = {
  recorded: "Recorded",
  live_online: "Live online",
  classroom: "Classroom",
  hybrid: "Hybrid",
};

export default function TrainingCoursesPage() {
  const qc = useQueryClient();
  const { data, isLoading, isError, error } = useQuery<{ items: Course[] }>({
    queryKey: ["admin-courses"],
    queryFn: () => api("/admin/courses"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api(`/admin/courses/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      toast.success("Course deleted");
      qc.invalidateQueries({ queryKey: ["admin-courses"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="p-6">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#0f5daa]">Training</p>
          <h2 className="mt-1 text-xl font-bold text-[#111827]">Courses</h2>
          <p className="mt-1 text-sm text-[#6b7280]">Publish live online or recorded classes for the public training page.</p>
        </div>
        <Link
          href="/training/new"
          className="inline-flex items-center gap-1.5 rounded-xl bg-[#0f5daa] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#0c4d8c]"
        >
          <Plus className="h-4 w-4" />
          Create course
        </Link>
      </div>

      {isError ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error instanceof Error ? error.message : "Could not load courses"}
        </p>
      ) : null}

      {isLoading ? (
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-14 animate-pulse rounded-xl bg-[#f3f4f6]" />
          ))}
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-[#e5e7eb] bg-white">
          <table className="w-full text-sm">
            <thead className="border-b border-[#e5e7eb] bg-[#f9fafb]">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-[#6b7280]">Course</th>
                <th className="px-4 py-3 text-left font-medium text-[#6b7280]">Class type</th>
                <th className="px-4 py-3 text-left font-medium text-[#6b7280]">Fee</th>
                <th className="px-4 py-3 text-left font-medium text-[#6b7280]">Status</th>
                <th className="px-4 py-3 text-right font-medium text-[#6b7280]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f3f4f6]">
              {(data?.items ?? []).map((course) => (
                <tr key={course._id} className="hover:bg-[#f9fafb]">
                  <td className="px-4 py-3">
                    <p className="font-medium text-[#111827]">{course.title}</p>
                    <p className="text-xs text-[#9ca3af]">{course.category}</p>
                  </td>
                  <td className="px-4 py-3 text-[#374151]">
                    {FORMAT_LABEL[course.classFormat || ""] || course.mode || "—"}
                  </td>
                  <td className="px-4 py-3 text-[#374151]">₹{(course.price || 0).toLocaleString("en-IN")}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      course.status === "published" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                    }`}>
                      {course.status}
                    </span>
                    {course.featured ? <span className="ml-2 text-xs text-[#0f5daa]">Featured</span> : null}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link href={`/training/${course._id}/edit`} className="mr-1 inline-flex rounded p-1.5 text-[#9ca3af] hover:bg-blue-50 hover:text-[#0f5daa]">
                      <Pencil className="h-3.5 w-3.5" />
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm("Delete this course?")) deleteMutation.mutate(course._id);
                      }}
                      className="inline-flex rounded p-1.5 text-[#9ca3af] hover:bg-red-50 hover:text-red-500"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!data?.items?.length ? (
            <p className="px-5 py-10 text-center text-sm text-[#9ca3af]">No courses yet. Create one to show it on Training.</p>
          ) : null}
        </div>
      )}
    </div>
  );
}
