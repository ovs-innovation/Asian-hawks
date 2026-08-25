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
import { ExclusiveOffer } from "@/components/platform/exclusive-offer";
import { LatestJobsSection } from "@/components/jobs/latest-jobs-section";
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

  const privateJobs = jobs.filter((j) => !j.status || j.status === "published").slice(0, 6);
  const latestJobs = [...jobs]
    .filter((j) => !j.status || j.status === "published")
    .sort((a, b) => {
      const timeA = new Date(a.publishedAt || a.createdAt || 0).getTime();
      const timeB = new Date(b.publishedAt || b.createdAt || 0).getTime();
      return timeB - timeA;
    })
    .slice(0, 6);

  const jobTracks = [
    { id: "gov" as const, label: "Government", href: "/government-jobs" },
    { id: "private" as const, label: "Private", href: "/private-jobs" },
    { id: "latest" as const, label: "Latest", href: "/jobs?sort=latest" },
  ];
  const activeTrack = jobTracks.find((t) => t.id === jobsTrack)!;

  return (
    <div id="top">
      {/* Hero */}
      <section className="relative bg-gradient-to-b from-[#eaf3fb] to-white">
        <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[42%] overflow-hidden lg:block">
          <div className="absolute inset-y-0 right-0 w-[86%] bg-[var(--navy)]" style={{ clipPath: "polygon(28% 0, 100% 0, 100% 100%, 0 100%)" }} />
        </div>
        <div className="relative mx-auto grid w-full max-w-[var(--max-w)] items-center gap-6 px-4 pb-6 pt-8 sm:px-5 sm:pb-8 sm:pt-12 lg:grid-cols-[1fr_0.9fr] lg:pb-10 lg:pt-16">
          <div>
            <p className="text-[12px] font-semibold tracking-wide text-[var(--primary)] sm:text-[13px]">Find jobs faster. Build your career.</p>
            <h1 className="mt-2 max-w-xl text-[28px] font-extrabold leading-[1.18] tracking-tight text-[var(--heading)] sm:mt-3 sm:text-[40px] md:text-[48px]">
              Find Your Next Opportunity
            </h1>
            <p className="mt-3 max-w-md text-[15px] leading-relaxed text-[var(--text-secondary)] sm:mt-4 sm:text-[16px]">
              Government Jobs, Private Jobs & Career Growth — All in One Place.
            </p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/courses/hero.jpg"
              alt=""
              className="mt-5 h-44 w-full rounded-2xl object-cover lg:hidden"
            />
          </div>
          <div className="relative z-10 hidden justify-end lg:flex">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/courses/hero.jpg"
              alt="Asian Hawks careers"
              className="relative h-[340px] w-[420px] max-w-full rounded-2xl object-cover object-center drop-shadow-xl"
            />
          </div>
        </div>
      </section>

      {/* Search card — in flow so fields are not clipped */}
      <div className="relative z-20 px-4 sm:-mt-4 sm:px-5">
        <form
          onSubmit={search}
          className="mx-auto w-full max-w-[var(--max-w)] rounded-2xl border border-[var(--border)] bg-white p-4 shadow-[var(--shadow-md)] sm:p-5"
        >
          <div className="flex gap-1 overflow-x-auto border-b border-[var(--border)] pb-0 text-[13px] font-semibold [-ms-overflow-style:none] [scrollbar-width:none] sm:gap-6 sm:text-[14px] [&::-webkit-scrollbar]:hidden">
            {(
              [
                ["jobs", "Jobs"],
                ["companies", "Companies"],
                ["courses", "Courses"],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => setTab(id)}
                className={
                  tab === id
                    ? "shrink-0 border-b-2 border-[var(--primary)] px-3 pb-2.5 text-[var(--primary)]"
                    : "shrink-0 px-3 pb-2.5 text-[var(--muted)]"
                }
              >
                {label}
              </button>
            ))}
          </div>
          <div className="mt-4 grid grid-cols-1 gap-3 lg:grid-cols-[1.4fr_1fr_1fr_auto]">
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
            <button type="submit" className="h-12 w-full rounded-lg bg-[var(--cta)] px-6 text-[15px] font-bold text-white hover:bg-[var(--cta-hover)] lg:h-[46px] lg:w-auto lg:text-[14px]">
              Search
            </button>
          </div>
          <div className="mt-3 hidden flex-wrap items-center gap-2 sm:flex">
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
        <div className="mx-auto grid w-full max-w-[var(--max-w)] grid-cols-1 gap-3 px-4 sm:grid-cols-2 sm:px-5 lg:grid-cols-5">
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
              className="group flex items-center gap-3 overflow-hidden rounded-2xl border border-[var(--border)] bg-white p-2.5 shadow-[var(--shadow)] sm:flex-col sm:items-stretch sm:gap-0 sm:p-0 sm:hover:shadow-[var(--shadow-md)]"
            >
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl sm:h-28 sm:w-full sm:rounded-none">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={image} alt="" className="h-full w-full object-cover" />
                <div className={`absolute inset-0 hidden bg-gradient-to-t ${accent} via-black/10 to-transparent sm:block`} />
                <span className={`absolute left-3 top-3 hidden rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide sm:inline ${chipClass}`}>
                  {chip}
                </span>
              </div>
              <div className="min-w-0 flex-1 p-1 sm:p-4 sm:pb-3">
                <span className="block text-[15px] font-extrabold leading-tight text-[var(--heading)] sm:text-[14px]">{label}</span>
                <span className="mt-0.5 block text-[12px] leading-snug text-[var(--text-secondary)] sm:mt-1 sm:text-[11px]">{sub}</span>
              </div>
              <span className={`hidden items-center gap-1 px-4 pb-4 text-[12px] font-semibold sm:inline-flex ${actionClass}`}>
                {cta} <ChevronRight size={14} />
              </span>
              <ChevronRight size={18} className="mr-1 shrink-0 text-[#94a3b8] sm:hidden" />
            </Link>
          ))}
        </div>
      </section>

      {/* LATEST JOBS SECTION BELOW CARDS */}
      <LatestJobsSection />

      {/* NEW ₹99 EXCLUSIVE OFFER SECTION */}
      <ExclusiveOffer />

      {/* Jobs for you — Naukri-style wide listings */}
      <section className="bg-[#f8fafc] py-8 sm:py-12">
        <div className="mx-auto w-full max-w-[var(--max-w)] px-4 sm:px-5">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <h2 className="text-[22px] font-extrabold tracking-tight text-[var(--heading)] sm:text-[26px]">Jobs for you</h2>
            <Link href={activeTrack.href} className="shrink-0 text-[14px] font-semibold text-[var(--primary)] hover:underline">
              View all
            </Link>
          </div>

          <div className="mt-4 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mt-5 sm:gap-5 sm:border-b sm:border-[#e5eaf0]">
            {jobTracks.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setJobsTrack(t.id)}
                className={
                  jobsTrack === t.id
                    ? "shrink-0 rounded-full bg-[#0f5daa] px-3.5 py-2 text-[13px] font-semibold text-white sm:rounded-none sm:bg-transparent sm:-mb-px sm:border-b-2 sm:border-[var(--primary)] sm:px-0 sm:pb-3 sm:text-[14px] sm:text-[var(--primary)]"
                    : "shrink-0 rounded-full bg-white px-3.5 py-2 text-[13px] font-medium text-[#64748b] ring-1 ring-[#e8eef5] sm:rounded-none sm:bg-transparent sm:px-0 sm:pb-3 sm:text-[14px] sm:ring-0"
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
                  key={j._id || j.slug}
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
              (latestJobs.length > 0 ? (
                latestJobs.map((j) => {
                  const pubDate = j.publishedAt || j.createdAt;
                  const isNew = isJobNew(pubDate);
                  const postedStr = pubDate ? `Posted ${timeAgo(pubDate)}` : undefined;
                  return (
                    <JobListing
                      key={j._id || j.slug}
                      href={`/jobs/${j.slug}`}
                      title={j.title}
                      company={j.company?.name || "Asian Hawks"}
                      location={j.location}
                      meta={`${j.workplace || "Onsite"} · ${formatSalary(j.minSalary, j.maxSalary, j.currency)}`}
                      initial={(j.company?.name || "AH").slice(0, 2).toUpperCase()}
                      logo={j.company?.logo || "/logo.png"}
                      isNew={isNew}
                      postedDate={postedStr}
                    />
                  );
                })
              ) : (
                <div className="col-span-2 py-8 text-center text-sm text-[#64748b]">
                  No latest jobs available right now. Check back soon for new opportunities.
                </div>
              ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12">
        <div className="mx-auto grid w-full max-w-[var(--max-w)] grid-cols-2 gap-2 px-4 sm:gap-3 sm:px-5 lg:grid-cols-5 lg:gap-0 lg:divide-x lg:divide-[var(--border)]">
          {[
            [Briefcase, `${PLATFORM_STATS.jobs.toLocaleString()}+`, "Jobs Available"],
            [Building2, "850+", "Companies"],
            [Users, `${PLATFORM_STATS.placements.toLocaleString()}+`, "Students placed"],
            [Landmark, `${PLATFORM_STATS.govJobs.toLocaleString()}+`, "Government jobs"],
            [GraduationCap, "120+", "Hiring partners"],
          ].map(([Icon, n, l]) => (
            <div key={l as string} className="flex flex-col gap-1 rounded-xl bg-[#f8fafc] px-3 py-3.5 sm:flex-row sm:items-center sm:gap-3 sm:bg-transparent sm:px-4 sm:py-5">
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-[#eaf3fb] text-[var(--primary)] sm:h-10 sm:w-10">
                <Icon size={16} strokeWidth={1.7} />
              </span>
              <div>
                <p className="text-[18px] font-extrabold text-[var(--heading)] sm:text-[20px]">{n as string}</p>
                <p className="text-[11px] leading-snug text-[var(--muted)] sm:text-[12px]">{l as string}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[#f4f7fb] py-12">
        <div className="mx-auto w-full max-w-[var(--max-w)] px-4 sm:px-5">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-[#0f5daa]">Training</p>
              <h2 className="mt-1 text-[22px] font-extrabold tracking-tight text-[var(--heading)] sm:text-[26px]">Banking courses</h2>
            </div>
            <Link href="/training" className="shrink-0 text-[14px] font-semibold text-[#0f5daa]">
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
        <div className="mx-auto w-full max-w-[var(--max-w)] px-4 sm:px-5">
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
          className="mx-auto flex w-full max-w-[var(--max-w)] flex-col items-stretch justify-between gap-3 px-4 sm:flex-row sm:items-center sm:px-5"
        >
          <div className="flex items-center gap-3">
            <Mail className="text-[var(--primary)]" size={22} />
            <p className="text-[15px] font-semibold text-[var(--heading)]">Get career alerts</p>
          </div>
          <div className="flex w-full min-w-0 max-w-md gap-2">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              className="h-11 min-w-0 flex-1 rounded-lg border border-[var(--border)] bg-white px-3 text-[14px] outline-none"
            />
            <button type="submit" className="h-11 shrink-0 rounded-lg bg-[var(--cta)] px-4 text-[14px] font-bold text-white hover:bg-[var(--cta-hover)] sm:px-5">
              Subscribe
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

function isJobNew(date?: string | Date) {
  if (!date) return false;
  const diff = Date.now() - new Date(date).getTime();
  return diff >= 0 && diff <= 3 * 86400000;
}

function shortPlace(location?: string) {
  if (!location) return "Pan India";
  const first = location.split(",")[0].trim();
  if (location.includes(",") || location.includes("+")) return `${first} + more`;
  return first;
}

function JobListing({
  href,
  title,
  company,
  location,
  meta,
  logo,
  isNew,
  postedDate,
}: {
  href: string;
  title: string;
  company: string;
  location: string;
  meta: string;
  initial: string;
  logo?: string;
  isNew?: boolean;
  postedDate?: string;
}) {
  return (
    <Link href={href} className="group flex items-start gap-3 border-b border-[#e8eef5] py-3.5 sm:gap-4 sm:py-5">
      <CompanyLogo name={company} logo={logo} size={40} className="shrink-0" />
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-2">
          <span className="line-clamp-1 text-[15px] font-semibold text-[#1f2937] group-hover:text-[var(--primary)] sm:text-[16px]">
            {title}
          </span>
          {isNew && (
            <span className="shrink-0 rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-bold text-emerald-800 uppercase tracking-wide">
              NEW
            </span>
          )}
        </span>
        <span className="mt-0.5 block truncate text-[12px] text-[#64748b]">{company}</span>
        <span className="mt-1 flex flex-wrap gap-x-2 text-[12px] text-[#64748b]">
          <span className="truncate">{shortPlace(location)}</span>
          <span className="text-[#cbd5e1]">·</span>
          <span className="truncate">{meta}</span>
          {postedDate && (
            <>
              <span className="text-[#cbd5e1]">·</span>
              <span className="truncate font-medium text-[#0f5daa]">{postedDate}</span>
            </>
          )}
        </span>
      </span>
    </Link>
  );
}
