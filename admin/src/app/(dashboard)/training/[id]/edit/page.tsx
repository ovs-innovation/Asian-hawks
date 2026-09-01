"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { CourseForm, type CourseRecord } from "@/components/course-form";

export default function EditCoursePage() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, isError, error } = useQuery<{ item: CourseRecord }>({
    queryKey: ["admin-course", id],
    queryFn: () => api(`/admin/courses/${id}`),
    enabled: Boolean(id),
  });

  return (
    <div className="p-6">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#0f5daa]">Training</p>
          <h2 className="mt-1 text-xl font-bold text-[#111827]">Edit course</h2>
        </div>
        <Link href="/training" className="rounded-xl border border-[#e5e7eb] bg-white px-4 py-2 text-sm font-medium text-[#374151] hover:bg-[#f9fafb]">
          Back to courses
        </Link>
      </div>
      {isLoading ? <div className="h-48 animate-pulse rounded-2xl bg-[#f3f4f6]" /> : null}
      {isError ? (
        <p className="text-sm text-red-700">{error instanceof Error ? error.message : "Could not load course"}</p>
      ) : null}
      {data?.item ? <CourseForm course={data.item} /> : null}
    </div>
  );
}
