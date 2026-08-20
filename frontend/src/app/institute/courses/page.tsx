import { DEMO_COURSES } from "@/lib/platform-data";

export default function InstituteCoursesPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-[24px] font-semibold">Courses</h1>
      <div className="overflow-hidden rounded-[var(--radius)] border border-[var(--border)] bg-[var(--card)]">
        {DEMO_COURSES.map((c) => (
          <div key={c.slug} className="flex items-center justify-between border-b border-[var(--border)] px-5 py-4 last:border-0">
            <div>
              <p className="font-medium">{c.title}</p>
              <p className="text-[13px] text-[var(--text-secondary)]">{c.category} · {c.duration}</p>
            </div>
            <span className="rounded-md bg-emerald-50 px-3 py-1 text-[12px] font-semibold text-[var(--primary)]">Published</span>
          </div>
        ))}
      </div>
    </div>
  );
}
