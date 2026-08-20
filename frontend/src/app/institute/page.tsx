import Link from "next/link";
import { DEMO_COURSES } from "@/lib/platform-data";

export default function InstituteDashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-[24px] font-semibold text-[var(--text)]">Institute Dashboard</h1>
        <p className="mt-1 text-[14px] text-[var(--text-secondary)]">Overview of your courses and students</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          ["Active courses", DEMO_COURSES.length],
          ["Total students", "1,240"],
          ["Revenue (MTD)", "₹4.2L"],
          ["Avg. rating", "4.7"],
        ].map(([l, v]) => (
          <div key={l} className="rounded-[var(--radius)] border border-[var(--border)] bg-[var(--card)] p-5">
            <p className="text-[13px] text-[var(--text-secondary)]">{l}</p>
            <p className="mt-1 text-[24px] font-bold text-[var(--primary)]">{v}</p>
          </div>
        ))}
      </div>
      <div className="rounded-[var(--radius)] border border-[var(--border)] bg-[var(--card)] p-5">
        <div className="flex items-center justify-between">
          <h2 className="text-[16px] font-semibold">Your courses</h2>
          <Link href="/institute/courses" className="text-[13px] font-semibold text-[var(--primary)]">Manage</Link>
        </div>
        <div className="mt-4 space-y-3">
          {DEMO_COURSES.slice(0, 3).map((c) => (
            <div key={c.slug} className="flex items-center justify-between border-b border-[var(--border)] pb-3 last:border-0">
              <span className="text-[14px] font-medium">{c.title}</span>
              <span className="text-[13px] text-[var(--text-secondary)]">{c.students} students</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
