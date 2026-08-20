import Link from "next/link";
import { SectionHeader } from "@/components/platform/section-header";

export default function CertificationsPage() {
  return (
    <div className="mx-auto w-full max-w-[var(--max-w)] px-5 py-10">
      <SectionHeader title="Certifications" subtitle="Industry-recognised certificates after course completion" />
      <div className="grid gap-4 md:grid-cols-3">
        {["Retail Banking Operations", "ATM Mitra Field Training", "Bank PO / Clerk", "KYC & AML"].map((c) => (
          <Link key={c} href="/courses" className="rounded-[var(--radius)] border border-[var(--border)] bg-[var(--card)] p-6 hover:border-[var(--primary)]">
            <p className="font-semibold text-[var(--text)]">{c}</p>
            <p className="mt-2 text-[13px] text-[var(--text-secondary)]">Complete course + assessment to earn certificate</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
