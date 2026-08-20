"use client";

import Link from "next/link";
import type { DemoCourse } from "@/lib/platform-data";
import { SafeImage } from "@/components/ui/safe-image";

export function CourseCard({ course }: { course: DemoCourse }) {
  return (
    <Link
      href={`/courses/${course.slug}`}
      className="flex h-full flex-col overflow-hidden rounded-2xl border border-[#e6edf5] bg-white shadow-[0_1px_2px_rgba(3,34,76,0.04)] transition hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(3,34,76,0.1)]"
    >
      <div className="relative h-[148px] overflow-hidden">
        <SafeImage src={course.image} alt={course.title} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#03224c]/80 via-transparent to-transparent" />
        <p className="absolute bottom-3 left-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-white/90">
          {course.category}
        </p>
        <p className="absolute bottom-3 right-4 text-[18px] font-extrabold text-white">₹{course.price.toLocaleString()}</p>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-[16px] font-bold leading-snug text-[#111827]">{course.title}</h3>
        <p className="mt-2 text-[13px] text-[#64748b]">
          {course.duration} · {course.mode}
        </p>
        <p className="mt-1 text-[13px] text-[#64748b]">For {course.placement}</p>
        <span className="mt-5 inline-flex h-10 w-full items-center justify-center rounded-lg bg-[#0f5daa] text-[13px] font-semibold text-white">
          View course
        </span>
      </div>
    </Link>
  );
}
