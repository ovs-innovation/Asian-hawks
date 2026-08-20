"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
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

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-white">
      <div className="mx-auto flex h-14 w-full max-w-[var(--max-w)] items-center justify-between gap-2 px-3 sm:h-[72px] sm:gap-3 sm:px-5">
        <BrandLogo className="min-w-0" height={36} />

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

        <div className="hidden items-center gap-2.5 lg:flex">
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

        <button
          type="button"
          className="grid h-11 w-11 place-items-center rounded-lg lg:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="fixed inset-x-0 top-14 bottom-0 z-40 overflow-y-auto bg-white px-5 py-4 sm:top-[72px] lg:hidden">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "block border-b border-[#eef2f6] py-3.5 text-[16px] font-medium text-[#111827]",
                l.match(pathname) && "text-[var(--primary)]"
              )}
            >
              {l.label}
            </Link>
          ))}
          <div className="mt-5 flex flex-col gap-2 sm:flex-row">
            <Link
              href="/login"
              className="flex-1 rounded-lg border border-[var(--primary)] py-3 text-center text-[15px] font-semibold text-[var(--primary)]"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="flex-1 rounded-lg bg-[var(--cta)] py-3 text-center text-[15px] font-semibold text-white"
            >
              Register
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
