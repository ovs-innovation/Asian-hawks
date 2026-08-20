import { SectionHeader } from "@/components/platform/section-header";
import { GOV_JOBS_PREVIEW } from "@/lib/platform-data";

export default function ExamUpdatesPage() {
  return (
    <div className="mx-auto w-full max-w-[var(--max-w)] px-5 py-10">
      <SectionHeader title="Exam Updates" subtitle="Latest notifications, admit cards, and results" />
      <div className="overflow-hidden rounded-[var(--radius)] border border-[var(--border)] bg-[var(--card)]">
        {GOV_JOBS_PREVIEW.map((j) => (
          <div key={j.title} className="border-b border-[var(--border)] px-5 py-4 last:border-b-0">
            <p className="font-semibold text-[var(--text)]">{j.title}</p>
            <p className="mt-1 text-[13px] text-[var(--text-secondary)]">{j.org} · Last date {j.lastDate}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
