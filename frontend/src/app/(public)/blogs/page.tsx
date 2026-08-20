import Link from "next/link";
import { SectionHeader } from "@/components/platform/section-header";
import { DEMO_BLOGS } from "@/lib/demo-data";

export default function BlogsPage() {
  return (
    <div className="mx-auto w-full max-w-[var(--max-w)] px-5 py-10">
      <SectionHeader title="Blogs" subtitle="Career advice, hiring tips, and exam preparation" />
      <div className="grid gap-5 md:grid-cols-3">
        {DEMO_BLOGS.map((b) => (
          <Link key={b.slug} href={`/advice/${b.slug}`} className="group overflow-hidden rounded-[var(--radius)] border border-[var(--border)] bg-[var(--card)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={b.coverImage} alt="" className="h-40 w-full object-cover" />
            <div className="p-5">
              <p className="text-[12px] font-medium text-[var(--primary)]">{b.category}</p>
              <p className="mt-1 text-[16px] font-semibold group-hover:text-[var(--primary)]">{b.title}</p>
              <p className="mt-2 text-[13px] text-[var(--text-secondary)]">{b.excerpt}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
