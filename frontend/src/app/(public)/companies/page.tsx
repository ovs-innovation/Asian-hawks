"use client";

import Link from "next/link";
import { useJobs } from "@/hooks/use-jobs";
import { CompanyLogo } from "@/components/company-logo";

export default function CompaniesPage() {
  const { data: jobs = [] } = useJobs();
  const companies = Array.from(
    new Map(
      jobs
        .filter((j) => j.company?.slug)
        .map((j) => [j.company!.slug, j.company!])
    ).values()
  );
  return (
    <section className="px-6 py-16">
      <div className="mx-auto max-w-[1320px]">
        <p className="text-[13px] font-semibold uppercase tracking-[0.08em] text-blue-600">Employers</p>
        <h1 className="mt-2 text-4xl font-bold">Companies hiring now</h1>
        <p className="mt-3 text-slate-500">Verified teams with published salary bands and a named hiring contact.</p>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {companies.map((c) => (
            <Link key={c.slug} href={`/companies/${c.slug}`} className="overflow-hidden rounded-[12px] border border-slate-200 bg-white p-5 transition hover:-translate-y-1 hover:shadow-md">
              <div className="flex items-center gap-3">
                <CompanyLogo name={c.name} logo={c.logo} size={48} />
                <div className="min-w-0">
                  <h2 className="truncate font-semibold">{c.name}</h2>
                  <p className="text-sm text-slate-500">{c.industry} · {c.location}</p>
                </div>
              </div>
              <p className="mt-3 text-sm text-slate-500">{(c.employees || 0).toLocaleString()} employees</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
