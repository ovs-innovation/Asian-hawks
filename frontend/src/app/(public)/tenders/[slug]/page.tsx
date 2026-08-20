import Link from "next/link";
import { notFound } from "next/navigation";
import { DEMO_TENDERS } from "@/lib/platform-data";

export default async function TenderDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tender = DEMO_TENDERS.find((t) => t.slug === slug);
  if (!tender) notFound();

  return (
    <div className="mx-auto w-full max-w-[var(--max-w)] px-5 py-10">
      <div className="rounded-[var(--radius)] border border-[var(--border)] bg-[var(--card)] p-6 md:p-8">
        <p className="text-[13px] font-medium text-[var(--primary)]">{tender.category} · {tender.refNo}</p>
        <h1 className="mt-2 text-[28px] font-semibold text-[var(--text)]">{tender.title}</h1>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Department", tender.department],
            ["Location", `${tender.city}, ${tender.state}`],
            ["Tender value", tender.value],
            ["Closing date", tender.closingDate],
          ].map(([l, v]) => (
            <div key={l} className="rounded-lg bg-[var(--bg)] p-4">
              <p className="text-[12px] text-[var(--text-secondary)]">{l}</p>
              <p className="mt-1 text-[14px] font-semibold text-[var(--text)]">{v}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/contact" className="rounded-lg bg-[var(--primary)] px-5 py-2.5 text-[14px] font-semibold text-white hover:bg-[var(--primary-hover)]">
            Send enquiry
          </Link>
          <button type="button" className="rounded-lg border border-[var(--border)] px-5 py-2.5 text-[14px] font-semibold text-[var(--text)] hover:bg-[var(--bg)]">
            Bookmark
          </button>
        </div>
      </div>
    </div>
  );
}
