"use client";

import Link from "next/link";
import { CourseForm } from "@/components/course-form";

export default function NewCoursePage() {
  return (
    <div className="p-6">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#0f5daa]">Training</p>
          <h2 className="mt-1 text-xl font-bold text-[#111827]">Create course</h2>
          <p className="mt-1 text-sm text-[#6b7280]">Add a live online or recorded class for the public training page.</p>
        </div>
        <Link href="/training" className="rounded-xl border border-[#e5e7eb] bg-white px-4 py-2 text-sm font-medium text-[#374151] hover:bg-[#f9fafb]">
          Back to courses
        </Link>
      </div>
      <CourseForm />
    </div>
  );
}
