import Link from "next/link";
import { SectionHeader } from "@/components/platform/section-header";

export default function CareerGuidePage() {
  return (
    <div className="mx-auto w-full max-w-[var(--max-w)] px-5 py-10">
      <SectionHeader title="Career Guide" subtitle="Guides for freshers, government exams, and private sector" />
      <div className="space-y-3">
        {[
          ["How to prepare for SSC CGL", "/government-jobs"],
          ["Resume tips for freshers", "/candidate/resume"],
          ["Switching from IT to product", "/private-jobs"],
          ["MSME guide to government tenders", "/tenders"],
        ].map(([title, href]) => (
          <Link key={title} href={href} className="block rounded-[var(--radius)] border border-[var(--border)] bg-[var(--card)] px-5 py-4 text-[15px] font-medium hover:border-[var(--primary)]">
            {title}
          </Link>
        ))}
      </div>
    </div>
  );
}
