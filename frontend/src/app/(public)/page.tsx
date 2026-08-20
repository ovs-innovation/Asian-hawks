"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Briefcase,
  Building2,
  ChevronRight,
  GraduationCap,
  Landmark,
  Mail,
  MapPin,
  Quote,
  Search,
  Star,
  Users,
} from "lucide-react";
import { useJobs } from "@/hooks/use-jobs";
import { formatSalary, timeAgo } from "@/lib/utils";
import { PHOTOS } from "@/lib/demo-data";
import { CompanyLogo } from "@/components/company-logo";
import { CourseCard } from "@/components/courses/course-card";
import {
  DEMO_COURSES,
  GOV_JOBS_PREVIEW,
  PLATFORM_STATS,
  QUICK_CATEGORIES,
} from "@/lib/platform-data";

export default function HomePage() {
  const router = useRouter();
  const { data: jobs = [] } = useJobs();
  const [tab, setTab] = useState<"jobs" | "companies" | "courses">("jobs");
  const [jobsTrack, setJobsTrack] = useState<"gov" | "private" | "latest">("private");
  const [q, setQ] = useState({ keyword: "", location: "", category: "" });
  const [email, setEmail] = useState("");

  function search(e: FormEvent) {
    e.preventDefault();
    const p = new URLSearchParams();
    if (q.keyword) p.set("keyword", q.keyword);
    if (q.location) p.set("location", q.location);
    if (q.category) p.set("keyword", q.keyword || q.category);
    if (tab === "companies") router.push(`/companies?${p.toString()}`);
    else if (tab === "courses") router.push(`/training`);
    else router.push(`/jobs?${p.toString()}`);
  }

  const privateJobs = jobs.slice(0, 6);
  const openings = jobs.slice(0, 6);
  const jobTracks = [
    { id: "gov" as const, label: "Government jobs", href: "/government-jobs" },
    { id: "private" as const, label: "Private jobs", href: "/private-jobs" },
    { id: "latest" as const, label: "Latest openings", href: "/jobs" },
  ];
  const activeTrack = jobTracks.find((t) => t.id === jobsTrack)!;

  return (
    <div id="top">
      {/* Hero */}
      <section className="relative bg-gradient-to-b from-[#eaf3fb] to-white">
        <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[42%] overflow-hidden lg:block">
          <div className="absolute inset-y-0 right-0 w-[86%] bg-[var(--navy)]" style={{ clipPath: "polygon(28% 0, 100% 0, 100% 100%, 0 100%)" }} />
        </div>
        <div className="relative mx-auto grid w-full max-w-[var(--max-w)] items-center gap-8 px-5 pb-8 pt-12 lg:grid-cols-[1fr_0.9fr] lg:pb-10 lg:pt-16">
          <div>
            <p className="text-[13px] font-semibold tracking-wide text-[var(--primary)]">Find jobs faster. Build your career.</p>
            <h1 className="mt-3 max-w-xl text-[28px] font-extrabold leading-[1.12] tracking-tight text-[var(--heading)] sm:text-[40px] md:text-[48px]">
              Find Your Next Opportunity
            </h1>
            <p className="mt-4 max-w-md text-[16px] leading-relaxed text-[var(--text-secondary)]">
              Government Jobs, Private Jobs & Career Growth — All in One Place.
            </p>
          </div>
          <div className="relative z-10 hidden justify-end lg:flex">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/courses/hero.jpg"
              alt="Asian Hawks careers"
              className="relative h-[340px] w-[420px] rounded-2xl object-cover object-center drop-shadow-xl"
            />
          </div>
        </div>
      </section>

      {/* Search card — in flow so fields are not clipped */}
      <div className="relative z-20 -mt-4 px-5">
        <form
          onSubmit={search}
          className="mx-auto w-full max-w-[var(--max-w)] rounded-2xl border border-[var(--border)] bg-white p-5 shadow-[var(--shadow-md)]"
        >
          <div className="flex flex-wrap gap-4 border-b border-[var(--border)] pb-3 text-[13px] font-semibold sm:gap-6 sm:text-[14px]">
            {(
              [
                ["jobs", "Search Jobs"],
                ["companies", "Search Companies"],
                ["courses", "Search Courses"],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => setTab(id)}
                className={tab === id ? "text-[var(--primary)]" : "text-[var(--muted)]"}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-[1.4fr_1fr_1fr_auto]">
            <label className="flex items-center gap-2 rounded-lg border border-[var(--border)] px-3 py-2.5">
              <Search size={16} className="text-[var(--muted)]" />
              <input
                value={q.keyword}
                onChange={(e) => setQ({ ...q, keyword: e.target.value })}
                placeholder="Job title, keyword or company"
                className="w-full text-[14px] outline-none placeholder:text-[var(--muted)]"
              />
            </label>
            <label className="flex items-center gap-2 rounded-lg border border-[var(--border)] px-3 py-2.5">
              <MapPin size={16} className="text-[var(--muted)]" />
              <input
                value={q.location}
                onChange={(e) => setQ({ ...q, location: e.target.value })}
                placeholder="Location"
                className="w-full text-[14px] outline-none placeholder:text-[var(--muted)]"
              />
            </label>
            <select
              value={q.category}
              onChange={(e) => setQ({ ...q, category: e.target.value })}
              className="rounded-lg border border-[var(--border)] bg-white px-3 py-2.5 text-[14px] text-[var(--heading)]"
            >
              <option value="">Category</option>
              <option>IT</option>
              <option>Banking</option>
              <option>Healthcare</option>
              <option>Government</option>
              <option>Sales</option>
            </select>
            <button type="submit" className="h-[46px] rounded-lg bg-[var(--cta)] px-6 text-[14px] font-bold text-white hover:bg-[var(--cta-hover)]">
              Search Jobs
            </button>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="text-[12px] text-[var(--muted)]">Popular Searches:</span>
            {QUICK_CATEGORIES.map((c) => (
              <Link
                key={c.label}
                href={c.href}
                className="rounded-full bg-[#f1f5f9] px-3 py-1 text-[12px] font-medium text-[var(--text-secondary)] hover:bg-[#e2e8f0]"
              >
                {c.label}
              </Link>
            ))}
          </div>
        </form>
      </div>

      {/* Category icons */}
      <section className="bg-white pt-8 pb-6">
        <div className="mx-auto grid w-full max-w-[var(--max-w)] grid-cols-2 gap-3 px-5 sm:grid-cols-3 lg:grid-cols-5">
          {[
            {
              href: "/government-jobs",
              label: "Government Jobs",
              sub: "SSC, Railway, Banking",
              cta: "View jobs",
              accent: "from-[#03224c]/80",
              chip: "Hiring",
              chipClass: "bg-white/90 text-[#03224c]",
              actionClass: "text-[#0f5daa]",
              image: "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=640&q=80",
            },
            {
              href: "/private-jobs",
              label: "Private Jobs",
              sub: "Salary listed upfront",
              cta: "Browse openings",
              accent: "from-[#0f5daa]/80",
              chip: "Live",
              chipClass: "bg-[#0f5daa] text-white",
              actionClass: "text-[#0f5daa]",
              image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=640&q=80",
            },
            {
              href: "/training",
              label: "Training",
              sub: "Banking batches open",
              cta: "View courses",
              accent: "from-[#0b6b5c]/80",
              chip: "Courses",
              chipClass: "bg-[#0b6b5c] text-white",
              actionClass: "text-[#0b6b5c]",
              image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=640&q=80",
            },
            {
              href: "/resume-builder",
              label: "Resume Builder",
              sub: "Make a bank-ready CV",
              cta: "Build resume",
              accent: "from-[#b31b43]/75",
              chip: "Tool",
              chipClass: "bg-[#b31b43] text-white",
              actionClass: "text-[#b31b43]",
              image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=640&q=80",
            },
            {
              href: "/contact",
              label: "Career Guidance",
              sub: "Talk to our HR team",
              cta: "Contact HR",
              accent: "from-[#5b21b6]/75",
              chip: "Support",
              chipClass: "bg-[#5b21b6] text-white",
              actionClass: "text-[#5b21b6]",
              image: "https://images.unsplash.com/photo-1573497620053-ea5300f94f21?auto=format&fit=crop&w=640&q=80",
            },
          ].map(({ href, label, sub, image, cta, accent, chip, chipClass, actionClass }) => (
            <Link
              key={label}
              href={href}
              className="group relative overflow-hidden rounded-2xl border border-[var(--border)] bg-white shadow-[var(--shadow)] transition duration-200 hover:-translate-y-1 hover:shadow-[var(--shadow-md)]"
            >
              <div className="relative h-28 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={image}
                  alt={label}
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${accent} via-black/10 to-transparent`} />
                <span className={`absolute left-3 top-3 rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${chipClass}`}>
                  {chip}
                </span>
              </div>
              <div className="p-4 pb-3">
                <span className="block text-[14px] font-extrabold leading-tight text-[var(--heading)]">{label}</span>
                <span className="mt-1 block text-[11px] leading-relaxed text-[var(--text-secondary)]">{sub}</span>
              </div>
              <span className={`inline-flex items-center gap-1 px-4 pb-4 text-[12px] font-semibold ${actionClass}`}>
                {cta} <ChevronRight size={14} className="transition group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Jobs for you — Naukri-style wide listings */}
      <section className="bg-[#f8fafc] py-12">
        <div className="mx-auto w-full max-w-[var(--max-w)] px-5">
          <div className="flex items-end justify-between gap-4">
            <h2 className="text-[26px] font-extrabold tracking-tight text-[var(--heading)]">Jobs for you</h2>
            <Link href={activeTrack.href} className="text-[14px] font-semibold text-[var(--primary)]">
              View all
            </Link>
          </div>

          <div className="mt-5 flex gap-8 border-b border-[#e5eaf0]">
            {jobTracks.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setJobsTrack(t.id)}
                className={
                  jobsTrack === t.id
                    ? "-mb-px border-b-2 border-[var(--primary)] pb-3 text-[14px] font-semibold text-[var(--primary)]"
                    : "pb-3 text-[14px] font-medium text-[#64748b] hover:text-[var(--heading)]"
                }
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="mt-2 grid md:grid-cols-2 md:gap-x-10">
            {jobsTrack === "gov" &&
              GOV_JOBS_PREVIEW.map((j) => (
                <JobListing
                  key={j.title}
                  href="/government-jobs"
                  title={j.title}
                  company={j.org}
                  location={j.location}
                  meta={`${j.vacancies.toLocaleString()} vacancies · Last date ${j.lastDate}`}
                  initial={j.org.slice(0, 2).toUpperCase()}
                  logo={j.org.toLowerCase().includes("sbi") ? "/banks/sbi.svg" : "/logo.png"}
                />
              ))}
            {jobsTrack === "private" &&
              privateJobs.map((j) => (
                <JobListing
                  key={j.slug}
                  href={`/jobs/${j.slug}`}
                  title={j.title}
                  company={j.company?.name || "Asian Hawks"}
                  location={j.location}
                  meta={`${j.experience} · ${formatSalary(j.minSalary, j.maxSalary, j.currency)}`}
                  initial={(j.company?.name || "AH").slice(0, 2).toUpperCase()}
                  logo={j.company?.logo || "/logo.png"}
                />
              ))}
            {jobsTrack === "latest" &&
              openings.map((j) => (
                <JobListing
                  key={j.slug}
                  href={`/jobs/${j.slug}`}
                  title={j.title}
                  company={j.company?.name || "Asian Hawks"}
                  location={j.location}
                  meta={`${j.workplace} · ${timeAgo(j.createdAt)}`}
                  initial={(j.company?.name || "AH").slice(0, 2).toUpperCase()}
                  logo={j.company?.logo || "/logo.png"}
                />
              ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12">
        <div className="mx-auto grid w-full max-w-[var(--max-w)] grid-cols-2 divide-y divide-[var(--border)] px-5 sm:grid-cols-3 lg:grid-cols-5 lg:divide-x lg:divide-y-0">
          {[
            [Briefcase, `${PLATFORM_STATS.jobs.toLocaleString()}+`, "Jobs Available"],
            [Building2, "850+", "Companies"],
            [Users, `${PLATFORM_STATS.placements.toLocaleString()}+`, "Students placed"],
            [Landmark, `${PLATFORM_STATS.govJobs.toLocaleString()}+`, "Government jobs"],
            [GraduationCap, "120+", "Hiring partners"],
          ].map(([Icon, n, l]) => (
            <div key={l as string} className="flex items-center gap-3 px-4 py-5">
              <span className="grid h-10 w-10 place-items-center rounded-lg bg-[#eaf3fb] text-[var(--primary)]">
                <Icon size={18} strokeWidth={1.7} />
              </span>
              <div>
                <p className="text-[20px] font-extrabold text-[var(--heading)]">{n as string}</p>
                <p className="text-[12px] text-[var(--muted)]">{l as string}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[#f4f7fb] py-12">
        <div className="mx-auto w-full max-w-[var(--max-w)] px-5">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-[#0f5daa]">Training</p>
              <h2 className="mt-1 text-[26px] font-extrabold tracking-tight text-[var(--heading)]">Banking courses</h2>
            </div>
            <Link href="/training" className="text-[14px] font-semibold text-[#0f5daa]">
              View all
            </Link>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {DEMO_COURSES.slice(0, 4).map((c) => (
              <CourseCard key={c.slug} course={c} />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-12">
        <div className="mx-auto w-full max-w-[var(--max-w)] px-5">
          <h2 className="mb-6 text-[22px] font-extrabold text-[var(--heading)]">What people say</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              [PHOTOS.maya, "Priya Shah", "Selected · Bank PO", "Salary and last date were clear. I applied the same afternoon."],
              [PHOTOS.james, "Rahul Sharma", "Software Engineer", "The listing felt honest. Recruiter called within a day."],
              [PHOTOS.priya, "Neha Kapoor", "Fresher · B.Com", "Simple apply flow. I did not have to create five accounts."],
            ].map(([img, name, role, quote]) => (
              <figure key={name} className="rounded-xl border border-[var(--border)] bg-white p-6 shadow-[var(--shadow)]">
                <Quote size={22} className="text-[var(--primary)]" />
                <blockquote className="mt-3 text-[14px] leading-relaxed text-[var(--text-secondary)]">“{quote}”</blockquote>
                <figcaption className="mt-5 flex items-center justify-between gap-3">
                  <span className="flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img} alt={name} className="h-10 w-10 rounded-full object-cover" />
                    <span>
                      <span className="block text-[14px] font-semibold text-[var(--heading)]">{name}</span>
                      <span className="block text-[12px] text-[var(--muted)]">{role}</span>
                    </span>
                  </span>
                  <span className="flex text-amber-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={12} fill="currentColor" />
                    ))}
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-[#eaf3fb] py-6">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setEmail("");
          }}
          className="mx-auto flex w-full max-w-[var(--max-w)] flex-col items-center justify-between gap-4 px-5 sm:flex-row"
        >
          <div className="flex items-center gap-3">
            <Mail className="text-[var(--primary)]" size={22} />
            <p className="text-[15px] font-semibold text-[var(--heading)]">Get career alerts</p>
          </div>
          <div className="flex w-full max-w-md gap-2">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              className="h-11 flex-1 rounded-lg border border-[var(--border)] bg-white px-3 text-[14px] outline-none"
            />
            <button type="submit" className="h-11 rounded-lg bg-[var(--cta)] px-5 text-[14px] font-bold text-white hover:bg-[var(--cta-hover)]">
              Subscribe
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

function JobListing({
  href,
  title,
  company,
  location,
  meta,
  logo,
}: {
  href: string;
  title: string;
  company: string;
  location: string;
  meta: string;
  initial: string;
  logo?: string;
}) {
  return (
    <Link href={href} className="group flex gap-4 border-b border-[#e8eef5] py-5">
      <CompanyLogo name={company} logo={logo} size={48} className="h-12 w-12" />
      <span className="min-w-0">
        <span className="block truncate text-[16px] font-semibold text-[#1f2937] group-hover:text-[var(--primary)]">{title}</span>
        <span className="mt-0.5 block truncate text-[13px] text-[#64748b]">{company}</span>
        <span className="mt-2 flex items-center gap-2 text-[13px] text-[#64748b]">
          <MapPin size={13} className="shrink-0" />
          <span className="truncate">
            {location}
            <span className="mx-2 text-[#cbd5e1]">|</span>
            {meta}
          </span>
        </span>
      </span>
    </Link>
  );
}
