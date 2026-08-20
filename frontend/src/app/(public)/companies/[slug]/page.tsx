"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { useJobs } from "@/hooks/use-jobs";
import { JobCard } from "@/components/jobs/job-card";
import { CompanyLogo } from "@/components/company-logo";
import { PHOTOS, type DemoJob } from "@/lib/demo-data";
import { api } from "@/lib/api";

type Company = NonNullable<DemoJob["company"]>;

export default function CompanyProfilePage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: jobs = [], isLoading: loadingJobs } = useJobs();
  const { data: remote, isLoading: loadingCompany, isError } = useQuery<{ company: Company; jobs: DemoJob[] }>({
    queryKey: ["company", slug],
    queryFn: () => api(`/companies/${slug}`),
    enabled: Boolean(slug),
    retry: false,
  });

  const companyJobs = remote?.jobs?.length
    ? remote.jobs
    : jobs.filter((j) => j.company?.slug === slug);
  const company = remote?.company || companyJobs[0]?.company;

  if ((loadingCompany && !isError) || loadingJobs) {
    return (
      <section className="px-6 py-24 text-center text-sm text-slate-500">
        Loading company…
      </section>
    );
  }

  if (!company) {
    return (
      <section className="px-6 py-24 text-center">
        <h1 className="text-2xl font-bold">Company not found</h1>
        <p className="mt-2 text-sm text-slate-500">This employer may not have open roles right now.</p>
        <Link href="/companies" className="mt-4 inline-block text-sm font-semibold text-blue-600">All companies</Link>
      </section>
    );
  }

  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={company.coverImage || PHOTOS.office1} alt="" className="h-72 w-full object-cover" />
      <section className="px-6 py-12">
        <div className="mx-auto flex max-w-[1320px] items-start gap-4">
          <CompanyLogo name={company.name} logo={company.logo} size={64} className="rounded-xl p-2" />
          <div>
            <h1 className="text-4xl font-bold">{company.name}</h1>
            <p className="mt-2 text-slate-500">{company.industry} · {company.location} · {(company.employees || 0).toLocaleString()} employees</p>
            <p className="mt-6 max-w-2xl text-slate-600 dark:text-slate-300">{company.about}</p>
            <h2 className="mt-12 text-2xl font-semibold">Open roles</h2>
            <div className="mt-6 grid gap-5 md:grid-cols-2">
              {companyJobs.map((job) => <JobCard key={job.slug} job={job} />)}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
