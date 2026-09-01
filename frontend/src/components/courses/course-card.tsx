"use client";

import Link from "next/link";
import { SafeImage } from "@/components/ui/safe-image";
import { courseModeLabel } from "@/lib/courses";

type CourseCardCourse = {
  slug: string;
  title: string;
  category?: string;
  price?: number;
  duration?: string;
  mode?: string;
  classFormat?: "recorded" | "live_online" | "classroom" | "hybrid";
  placement?: string;
  image?: string;
};

export function CourseCard({ course }: { course: CourseCardCourse }) {
  const price = course.price ?? 0;
  const mode = courseModeLabel(course);
  return (
    <Link
      href={`/courses/${course.slug}`}
      className="flex h-full flex-col overflow-hidden rounded-2xl border border-[#e6edf5] bg-white shadow-[0_1px_2px_rgba(3,34,76,0.04)] sm:hover:shadow-[0_12px_32px_rgba(3,34,76,0.1)]"
    >
      <div className="relative h-[148px] overflow-hidden">
        <SafeImage src={course.image} alt={course.title} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#03224c]/80 via-transparent to-transparent" />
        <p className="absolute bottom-2 left-3 max-w-[55%] truncate text-[10px] font-semibold uppercase tracking-[0.1em] text-white/90 sm:bottom-3 sm:left-4 sm:max-w-none sm:text-[11px]">
          {course.category}
        </p>
        <p className="absolute bottom-2 right-3 text-[16px] font-extrabold text-white sm:bottom-3 sm:right-4 sm:text-[18px]">
          ₹{price.toLocaleString("en-IN")}
        </p>
      </div>
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <h3 className="text-[16px] font-bold leading-snug text-[#111827]">{course.title}</h3>
        <p className="mt-2 text-[13px] text-[#64748b]">
          {course.duration} · {mode}
        </p>
        {course.placement ? <p className="mt-1 text-[13px] text-[#64748b]">For {course.placement}</p> : null}
        <span className="mt-5 inline-flex h-10 w-full items-center justify-center rounded-lg bg-[#0f5daa] text-[13px] font-semibold text-white">
          View course
        </span>
      </div>
    </Link>
  );
}
