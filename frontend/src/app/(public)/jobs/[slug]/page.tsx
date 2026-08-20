"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { BadgeCheck, Briefcase, Clock, MapPin, Phone, Mail, Wallet } from "lucide-react";
import { ApplyForm } from "@/components/apply-form";
import { CompanyLogo } from "@/components/company-logo";
import { useJob } from "@/hooks/use-jobs";
import { formatSalary, timeAgo } from "@/lib/utils";

export default function JobDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: job, isLoading } = useJob(slug);

  if (isLoading) {
    return (
      <section className="bg-[#f7f9fc] px-4 py-16 text-center text-sm text-[#64748b]">
        Loading job…
      </section>
    );
  }

  if (!job) {
    return (
      <section className="bg-[#f7f9fc] px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-[#111827]">Job not available</h1>
        <p className="mt-2 text-sm text-[#64748b]">This posting may have been removed or is not published yet.</p>
        <Link href="/jobs" className="mt-5 inline-flex rounded-lg bg-[#0f5daa] px-4 py-2 text-sm font-semibold text-white">
          Browse jobs
        </Link>
      </section>
    );
  }

  const companyName = job.company?.name || "Asian Hawks Manpower Services Pvt. Ltd.";
  const skills = job.skills?.length ? job.skills : [];

  return (
    <section className="bg-[#f7f9fc] px-4 py-8">
      <div className="mx-auto grid max-w-[1180px] gap-5 lg:grid-cols-[1fr_360px]">
        <article className="rounded-xl border border-[#e5e7eb] bg-white p-6 shadow-[0_1px_2px_rgba(17,24,39,0.05)] md:p-8">
          <p className="text-xs text-[#64748b]">
            <Link href="/jobs" className="hover:text-[#0f5daa]">Jobs</Link> / {companyName}
          </p>
          <div className="mt-3 flex flex-wrap items-start gap-3">
            <CompanyLogo name={companyName} logo={job.company?.logo} size={56} className="rounded-xl p-1.5" />
            <div>
              <h1 className="text-[26px] font-bold leading-tight text-[#111827]">{job.title}</h1>
              <p className="mt-1 flex items-center gap-1.5 text-[15px] font-medium text-[#334155]">
                {companyName}
                <span className="inline-flex items-center gap-1 rounded-full bg-[#eff6ff] px-2 py-0.5 text-[11px] font-semibold text-[#0f5daa]">
                  <BadgeCheck size={12} /> Verified employer
                </span>
              </p>
            </div>
          </div>
          <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm text-[#64748b]">
            <span className="inline-flex items-center gap-1.5"><Briefcase size={15} /> {job.experience || "Not specified"}</span>
            <span className="inline-flex items-center gap-1.5"><Wallet size={15} /> {formatSalary(job.minSalary, job.maxSalary, job.currency)}</span>
            <span className="inline-flex items-center gap-1.5"><MapPin size={15} /> {job.location || "Pan India"}</span>
            <span className="inline-flex items-center gap-1.5"><Clock size={15} /> Posted {timeAgo(job.createdAt)}</span>
          </div>
          <hr className="my-6 border-[#e5e7eb]" />
          <h2 className="text-base font-bold text-[#111827]">Job description</h2>
          <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-[#445578]">{job.responsibilities || "Details will be shared by HR after you apply."}</p>
          <h2 className="mt-6 text-base font-bold text-[#111827]">Requirements</h2>
          <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-[#445578]">{job.requirements || "—"}</p>
          {job.benefits && (
            <>
              <h2 className="mt-6 text-base font-bold text-[#111827]">Benefits</h2>
              <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-[#445578]">{job.benefits}</p>
            </>
          )}
          {skills.length > 0 && (
            <>
              <h2 className="mt-6 text-base font-bold text-[#111827]">Key skills</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {skills.map((s) => (
                  <span key={s} className="rounded-full bg-[#eff6ff] px-3 py-1 text-xs font-medium text-[#0f5daa]">{s}</span>
                ))}
              </div>
            </>
          )}
          <div className="mt-8 rounded-xl border border-[#e5e7eb] bg-[#f8fafc] p-4 text-sm text-[#445578]">
            <p className="font-semibold text-[#111827]">Hiring contact</p>
            <p className="mt-2 flex items-center gap-2"><Phone size={14} /> <a href="tel:6280698650" className="hover:text-[#0f5daa]">6280698650</a></p>
            <p className="mt-1 flex items-center gap-2"><Mail size={14} /> <a href="mailto:asianhawksmanpower@gmail.com" className="hover:text-[#0f5daa]">asianhawksmanpower@gmail.com</a></p>
            <p className="mt-1 flex items-center gap-2"><Mail size={14} /> <a href="mailto:Hr@asianhawksmanpower.com" className="hover:text-[#0f5daa]">Hr@asianhawksmanpower.com</a></p>
          </div>
        </article>
        <aside className="h-fit rounded-xl border border-[#e5e7eb] bg-white p-5 shadow-[0_1px_2px_rgba(17,24,39,0.05)] lg:sticky lg:top-24">
          <h2 className="text-base font-bold text-[#111827]">Apply with resume</h2>
          <p className="mb-4 mt-1 text-xs text-[#64748b]">No login needed. Attach your CV and we will call you.</p>
          <ApplyForm jobTitle={job.title} jobSlug={job.slug} />
        </aside>
      </div>
    </section>
  );
}
