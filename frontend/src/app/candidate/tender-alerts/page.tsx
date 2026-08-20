import Link from "next/link";
import { DEMO_TENDERS } from "@/lib/platform-data";

export default function TenderAlertsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Tender Alerts</h1>
      <p className="text-sm text-[var(--text-secondary)]">Tenders you are tracking</p>
      <div className="overflow-hidden rounded-[var(--radius)] border border-[var(--border)] bg-[var(--card)]">
        {DEMO_TENDERS.slice(0, 2).map((t) => (
          <Link key={t.slug} href={`/tenders/${t.slug}`} className="block border-b border-[var(--border)] px-5 py-4 last:border-0 hover:bg-[var(--bg)]">
            <p className="font-medium">{t.title}</p>
            <p className="text-[13px] text-[var(--text-secondary)]">Closes {t.closingDate}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
