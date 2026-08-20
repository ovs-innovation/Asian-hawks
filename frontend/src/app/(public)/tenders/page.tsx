"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { SectionHeader } from "@/components/platform/section-header";
import { DEMO_TENDERS } from "@/lib/platform-data";

function TendersContent() {
  const params = useSearchParams();
  const keyword = params.get("keyword")?.toLowerCase() || "";
  const filtered = DEMO_TENDERS.filter(
    (t) => !keyword || t.title.toLowerCase().includes(keyword) || t.category.toLowerCase().includes(keyword)
  );

  return (
    <div className="mx-auto w-full max-w-[var(--max-w)] px-5 py-10">
      <SectionHeader title="Government Tenders" subtitle="Browse and bookmark active tenders across India" />
      <div className="overflow-hidden rounded-[var(--radius)] border border-[var(--border)] bg-[var(--card)]">
        {filtered.map((t) => (
          <Link key={t.slug} href={`/tenders/${t.slug}`} className="flex flex-col gap-2 border-b border-[var(--border)] px-5 py-5 last:border-b-0 hover:bg-[var(--bg)] lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-[16px] font-semibold text-[var(--text)]">{t.title}</p>
              <p className="text-[13px] text-[var(--text-secondary)]">{t.refNo} · {t.department}</p>
            </div>
            <div className="flex flex-wrap gap-4 text-[13px] text-[var(--text-secondary)]">
              <span>{t.state}, {t.city}</span>
              <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[12px] font-medium text-[var(--primary)]">{t.category}</span>
              <span className="font-semibold text-[var(--text)]">{t.value}</span>
              <span className="text-red-600">Closes {t.closingDate}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function TendersPage() {
  return (
    <Suspense>
      <TendersContent />
    </Suspense>
  );
}
