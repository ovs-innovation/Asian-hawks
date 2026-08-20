import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function ComingSoon({
  title,
  body,
}: {
  title: string;
  body: string;
}) {
  return (
    <section className="px-5 py-20">
      <div className="mx-auto max-w-[640px] rounded-[20px] border border-[var(--border)] bg-white px-8 py-14 text-center shadow-[var(--shadow)]">
        <p className="text-[12px] font-bold uppercase tracking-[0.16em] text-[var(--cta)]">Coming soon · Phase 2</p>
        <h1 className="mt-4 text-[32px] font-extrabold text-[var(--heading)]">{title}</h1>
        <p className="mt-3 text-[16px] leading-relaxed text-[var(--text-secondary)]">{body}</p>
        <p className="mt-6 text-[14px] text-[var(--muted)]">Jobs stay the focus today. This module will sit next to your applications — no redesign later.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/private-jobs" className="inline-flex h-11 items-center gap-1 rounded-[var(--radius)] bg-[var(--primary)] px-6 text-[14px] font-semibold text-white hover:bg-[var(--primary-hover)]">
            Browse jobs <ArrowRight size={16} />
          </Link>
          <Link href="/contact" className="inline-flex h-11 items-center rounded-[var(--radius)] border border-[var(--border)] px-6 text-[14px] font-semibold text-[var(--heading)]">
            Join waitlist
          </Link>
        </div>
      </div>
    </section>
  );
}
