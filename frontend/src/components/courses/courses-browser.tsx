"use client";

import { FormEvent, useMemo, useState } from "react";
import { CourseCard } from "@/components/courses/course-card";
import { DEMO_COURSES } from "@/lib/platform-data";

const FILTERS = ["All", "Banking Operations", "Field Banking", "Bank Exams", "Compliance"];

export function CoursesBrowser() {
  const [title, setTitle] = useState("");
  const [filter, setFilter] = useState("All");
  const [q, setQ] = useState("");

  function onSearch(e: FormEvent) {
    e.preventDefault();
    setQ(title);
  }

  const filtered = useMemo(() => {
    return DEMO_COURSES.filter((c) => {
      const hay = `${c.title} ${c.category} ${c.mode} ${c.placement}`.toLowerCase();
      if (q && !hay.includes(q.toLowerCase())) return false;
      if (filter !== "All" && c.category !== filter) return false;
      return true;
    });
  }, [q, filter]);

  return (
    <section className="min-h-[70vh] bg-[#f4f7fb]">
      <div className="bg-[linear-gradient(135deg,#03224c_0%,#0f5daa_100%)] text-white">
        <div className="mx-auto w-full max-w-[var(--max-w)] px-5 py-12">
          <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-white/70">Training</p>
          <h1 className="mt-2 text-[32px] font-extrabold tracking-tight">Banking courses</h1>
          <p className="mt-2 max-w-lg text-[15px] text-white/75">
            Classroom, field, and exam batches — separate from job openings.
          </p>
          <form onSubmit={onSearch} className="mt-6 flex max-w-lg gap-2">
            <input
              className="h-11 flex-1 rounded-lg bg-white px-4 text-[14px] text-[#111827] outline-none"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Search a course"
            />
            <button type="submit" className="h-11 rounded-lg bg-[#b31b43] px-5 text-[14px] font-semibold text-white">
              Search
            </button>
          </form>
        </div>
      </div>

      <div className="mx-auto w-full max-w-[var(--max-w)] px-5 py-8">
        <div className="flex gap-2 overflow-x-auto pb-4">
          {FILTERS.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setFilter(item)}
              className={`shrink-0 rounded-full px-3.5 py-1.5 text-[13px] font-medium ${
                filter === item ? "bg-[#03224c] text-white" : "bg-white text-[#64748b] ring-1 ring-[#e6edf5]"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {filtered.map((course) => (
            <CourseCard key={course.slug} course={course} />
          ))}
        </div>
        {filtered.length === 0 && (
          <p className="rounded-xl bg-white px-5 py-10 text-center text-sm text-[#64748b]">No courses found.</p>
        )}
      </div>
    </section>
  );
}
