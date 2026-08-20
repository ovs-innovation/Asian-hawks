"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Home", match: (path: string) => path === "/" },
  {
    href: "/jobs",
    label: "Jobs",
    match: (path: string) =>
      path.startsWith("/jobs") || path.startsWith("/government-jobs") || path.startsWith("/private-jobs"),
  },
  { href: "/training", label: "Training", match: (path: string) => path.startsWith("/training") },
  { href: "/resume-builder", label: "Resume Builder", match: (path: string) => path.startsWith("/resume-builder") },
  { href: "/contact", label: "Contact", match: (path: string) => path.startsWith("/contact") },
];

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-white">
      <div className="mx-auto flex h-[64px] w-full max-w-[var(--max-w)] items-center justify-between gap-3 px-4 sm:h-[76px] sm:px-5">
        <BrandLogo className="min-w-0" height={40} />

        <nav className="hidden items-center lg:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "px-3.5 py-2 text-[14px] font-medium text-[#334155] transition-colors hover:text-[var(--primary)]",
                l.match(pathname) && "text-[var(--primary)]"
              )}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2.5 md:flex">
          <Link
            href="/login"
            className="inline-flex h-10 items-center rounded-lg border border-[var(--primary)] px-5 text-[13px] font-semibold text-[var(--primary)] hover:bg-[#eff6ff]"
          >
            Login
          </Link>
          <Link
            href="/signup"
            className="inline-flex h-10 items-center rounded-lg bg-[var(--cta)] px-5 text-[13px] font-semibold text-white hover:bg-[var(--cta-hover)]"
          >
            Register
          </Link>
        </div>

        <button type="button" className="rounded-lg p-2 lg:hidden" aria-label="Menu" onClick={() => setOpen((v) => !v)}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-[var(--border)] bg-white px-5 py-4 lg:hidden">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="block py-2.5 text-[14px] font-medium" onClick={() => setOpen(false)}>
              {l.label}
            </Link>
          ))}
          <div className="mt-3 flex gap-2">
            <Link href="/login" className="flex-1 rounded-lg border border-[var(--primary)] py-2.5 text-center text-[14px] font-semibold text-[var(--primary)]" onClick={() => setOpen(false)}>
              Login
            </Link>
            <Link href="/signup" className="flex-1 rounded-lg bg-[var(--cta)] py-2.5 text-center text-[14px] font-semibold text-white" onClick={() => setOpen(false)}>
              Register
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
