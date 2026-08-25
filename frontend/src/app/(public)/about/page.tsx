import Link from "next/link";
import { Briefcase, GraduationCap, Handshake, Mail, ShieldCheck, Users } from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";

const work = [
  {
    icon: Briefcase,
    title: "Jobs",
    text: "Banking, field, and customer openings with salary, location, and a simple apply flow — resume upload, no login.",
  },
  {
    icon: GraduationCap,
    title: "Training",
    text: "Banking courses for branch operations, ATM Mitra, bank exams, and KYC — built for the same roles we staff.",
  },
  {
    icon: Handshake,
    title: "Placement",
    text: "We place people on bank and BFSI projects across India, with dedicated HR email support.",
  },
];

export default function AboutPage() {
  return (
    <section className="bg-[#f4f7fb]">
      <div className="bg-[linear-gradient(135deg,#03224c_0%,#0f5daa_100%)]">
        <div className="mx-auto grid w-full max-w-[var(--max-w)] items-center gap-10 px-5 py-12 lg:grid-cols-[1.15fr_0.85fr] lg:py-16">
          <div>
            <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-white/80">About us</p>
            <h1 className="mt-2 max-w-xl text-[26px] font-extrabold leading-tight tracking-tight !text-white sm:text-[40px]">
              Asian Hawks Manpower Services
            </h1>
            <p className="mt-4 max-w-lg text-[16px] leading-relaxed text-white/90">
              We help people find work and get ready for it — government and private jobs, banking training, and placement on real bank projects.
            </p>
            <p className="mt-4 text-[16px] font-semibold text-white">Find Jobs. Learn Skills. Build Your Future.</p>
            <div className="mt-7 flex w-full flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link
                href="/jobs"
                className="inline-flex h-12 w-full items-center justify-center rounded-lg bg-white px-5 text-[14px] font-semibold text-[#03224c] sm:h-11 sm:w-auto"
              >
                Browse jobs
              </Link>
              <Link
                href="/contact"
                className="inline-flex h-12 w-full items-center justify-center rounded-lg border border-white/40 bg-white/10 px-5 text-[14px] font-semibold !text-white sm:h-11 sm:w-auto"
              >
                Talk to HR
              </Link>
            </div>
          </div>
          <div className="hidden justify-end lg:flex">
            <div className="rounded-2xl bg-white p-6 shadow-[0_16px_40px_rgba(0,0,0,0.18)]">
              <BrandLogo href="" height={64} />
              <p className="mt-4 text-[14px] leading-6 text-[#475569]">
                Pan India manpower for banking, ATM, and customer roles.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-[var(--max-w)] px-5 py-12">
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            ["Pan India", "Roles across cities and field sites"],
            ["Banking focus", "Branch, ATM Mitra, KYC, CSA"],
            ["Direct HR", "Email support · same-day reply"],
          ].map(([n, l]) => (
            <div key={n} className="rounded-2xl border border-[#e6edf5] bg-white px-5 py-6">
              <p className="text-[18px] font-extrabold text-[#03224c]">{n}</p>
              <p className="mt-1 text-[14px] text-[#64748b]">{l}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-start">
          <div>
            <h2 className="text-[24px] font-extrabold text-[#111827]">Who we are</h2>
            <p className="mt-4 text-[15px] leading-7 text-[#475569]">
              Asian Hawks Manpower Services Pvt. Ltd. is a staffing and training partner for banks and BFSI work. Candidates search openings, apply with a resume, and join training batches that match the jobs we fill.
            </p>
            <p className="mt-4 text-[15px] leading-7 text-[#475569]">
              HR stays reachable via email — so salary, location, and interview dates stay clear before you join.
            </p>
          </div>
          <div className="space-y-3">
            {work.map((item) => (
              <div key={item.title} className="flex gap-4 rounded-2xl border border-[#e6edf5] bg-white p-5">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#eaf3fb] text-[#0f5daa]">
                  <item.icon size={20} />
                </span>
                <div>
                  <h3 className="text-[16px] font-bold text-[#111827]">{item.title}</h3>
                  <p className="mt-1 text-[14px] leading-6 text-[#64748b]">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            [Users, "Candidates", "Apply without creating five accounts. Resume goes to HR with the role."],
            [ShieldCheck, "Verified listings", "Salary, type, and location on every job card before you apply."],
            [Mail, "Direct support", "Write to Hr@asianhawksmanpower.com for quick response."],
          ].map(([Icon, title, text]) => (
            <div key={String(title)} className="rounded-2xl border border-[#e6edf5] bg-white p-6">
              <span className="grid h-10 w-10 place-items-center rounded-lg bg-[#eaf3fb] text-[#0f5daa]">
                <Icon size={18} />
              </span>
              <h3 className="mt-4 text-[16px] font-bold text-[#111827]">{title as string}</h3>
              <p className="mt-2 text-[14px] leading-6 text-[#64748b]">{text as string}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-5 rounded-2xl bg-[#03224c] px-6 py-8 sm:flex-row sm:items-center sm:px-8">
          <div>
            <p className="text-[20px] font-extrabold text-white">Ready to apply or join a batch?</p>
            <p className="mt-1 text-[14px] text-white/80">Open jobs, or message HR if you need the right role first.</p>
          </div>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Link href="/jobs" className="inline-flex h-11 w-full items-center justify-center rounded-lg bg-white px-5 text-[14px] font-semibold text-[#03224c] sm:w-auto">
              View jobs
            </Link>
            <Link href="/training" className="inline-flex h-11 w-full items-center justify-center rounded-lg bg-[#b31b43] px-5 text-[14px] font-semibold text-white sm:w-auto">
              View courses
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
