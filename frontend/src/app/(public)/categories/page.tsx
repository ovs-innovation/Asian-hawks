import Link from "next/link";
import { CATEGORIES } from "@/lib/demo-data";

export default function CategoriesPage() {
  return (
    <section className="px-6 py-16">
      <div className="mx-auto max-w-[1320px]">
        <h1 className="text-4xl font-bold">Job categories</h1>
        <p className="mt-3 max-w-xl text-slate-500">Browse by function, workplace, or employment type.</p>
        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {CATEGORIES.map((c) => (
            <Link key={c} href={`/jobs?category=${encodeURIComponent(c)}`} className="rounded-[12px] border border-slate-200 bg-white px-5 py-5 font-medium transition hover:-translate-y-0.5 dark:border-slate-800 dark:bg-slate-950">
              {c}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
