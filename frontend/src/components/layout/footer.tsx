import Link from "next/link";
import { ArrowUp, Globe, Mail, MapPin, Phone, Share2 } from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";

const cols = [
  {
    title: "For Candidates",
    links: [
      ["Jobs", "/jobs"],
      ["Government Jobs", "/government-jobs"],
      ["Private Jobs", "/private-jobs"],
      ["Resume Builder", "/resume-builder"],
    ],
  },
  {
    title: "For Recruiters",
    links: [
      ["Post a Job", "/recruiter/jobs/new"],
      ["Register", "/signup"],
      ["Login", "/login"],
    ],
  },
  {
    title: "Company",
    links: [
      ["About", "/about"],
      ["Training", "/training"],
      ["Contact", "/contact"],
    ],
  },
  {
    title: "Support",
    links: [
      ["FAQ", "/faq"],
      ["Terms", "/terms"],
      ["Privacy", "/privacy"],
    ],
  },
];

export function Footer() {
  return (
    <footer className="bg-[var(--navy)] text-white">
      <div className="mx-auto grid w-full max-w-[var(--max-w)] gap-8 px-4 py-10 sm:gap-10 sm:px-5 sm:py-14 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr_1fr]">
        <div className="min-w-0">
          <span className="inline-flex rounded-lg bg-white px-2 py-1">
            <BrandLogo height={44} />
          </span>
          <p className="mt-4 max-w-[280px] text-[13px] leading-relaxed text-white/70">
            Asian Hawks — your career growth platform. Find jobs. Learn skills. Build your future.
          </p>
          <div className="mt-4 space-y-2 text-[13px] text-white/70">
            <a href="tel:6280698650" className="flex items-center gap-2 hover:text-white">
              <Phone size={13} className="shrink-0" /> 6280698650
            </a>
            <a href="mailto:asianhawksmanpower@gmail.com" className="flex items-start gap-2 break-all hover:text-white">
              <Mail size={13} className="mt-0.5 shrink-0" /> asianhawksmanpower@gmail.com
            </a>
            <a href="mailto:Hr@asianhawksmanpower.com" className="flex items-start gap-2 break-all hover:text-white">
              <Mail size={13} className="mt-0.5 shrink-0" /> Hr@asianhawksmanpower.com
            </a>
            <p className="flex items-start gap-2"><MapPin size={13} className="mt-0.5 shrink-0" /> India</p>
          </div>
          <div className="mt-5 flex gap-2">
            {[Share2, Globe, Mail].map((Icon, i) => (
              <span key={i} className="grid h-8 w-8 place-items-center rounded-full border border-white/25 text-white/80">
                <Icon size={14} />
              </span>
            ))}
          </div>
        </div>
        {cols.map((col) => (
          <div key={col.title}>
            <p className="text-[13px] font-semibold">{col.title}</p>
            <div className="mt-4 space-y-2">
              {col.links.map(([label, href]) => (
                <Link key={label} href={href} className="block text-[13px] text-white/70 hover:text-white">
                  {label}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex w-full max-w-[var(--max-w)] flex-col gap-3 px-5 py-5 text-[12px] text-white/55 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Asian Hawks Manpower Services Pvt. Ltd.</p>
          <Link href="#top" className="grid h-8 w-8 place-items-center rounded-full bg-white/10 text-white" aria-label="Back to top">
            <ArrowUp size={14} />
          </Link>
        </div>
      </div>
    </footer>
  );
}
