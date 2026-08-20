import Link from "next/link";
import { DEMO_BLOGS } from "@/lib/demo-data";

export default function AdvicePage() {
  return (
    <section className="px-6 py-16">
      <div className="mx-auto max-w-[1320px]">
        <h1 className="text-4xl font-bold">Career advice</h1>
        <p className="mt-3 text-slate-500">Practical writing on interviews, offers, and how teams stay organized.</p>
        <div className="mt-12 space-y-4">
          {DEMO_BLOGS.map((b) => (
            <Link key={b.slug} href={`/advice/${b.slug}`} className="grid gap-6 rounded-[12px] border border-slate-200 p-4 transition hover:-translate-y-1 md:grid-cols-[220px_1fr] dark:border-slate-800">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={b.coverImage} alt="" className="h-36 w-full rounded-[10px] object-cover" />
              <div className="py-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">{b.category}</p>
                <h2 className="mt-2 text-xl font-semibold">{b.title}</h2>
                <p className="mt-2 text-slate-500">{b.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
