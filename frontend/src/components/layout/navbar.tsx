"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X, LayoutDashboard, LogOut } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/store";
import { logout } from "@/store/authSlice";
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

function getDashboardUrl(role?: string) {
  if (role === "super_admin" || role === "moderator") return "/admin";
  if (role === "candidate") return "/candidate";
  return "/recruiter";
}

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const user = useSelector((s: RootState) => s.auth.user);
  const hydrated = useSelector((s: RootState) => s.auth.hydrated);
  const dispatch = useDispatch();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const dashboardUrl = getDashboardUrl(user?.role);

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-white">
      <div className="mx-auto flex h-16 w-full max-w-[var(--max-w)] items-center justify-between gap-3 px-4 sm:h-[72px] sm:px-5">
        <BrandLogo className="shrink-0" height={50} />

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

        <div className="hidden items-center gap-3 lg:flex">
          {mounted && hydrated && user ? (
            <>
              <Link
                href={dashboardUrl}
                className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#0f5daa] px-4 text-[13px] font-semibold text-white shadow-xs transition-all hover:bg-[#0c4d8c]"
              >
                <LayoutDashboard size={15} />
                <span>Dashboard</span>
              </Link>
              <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                <Link
                  href={dashboardUrl}
                  className="flex items-center gap-2 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  <div className="grid h-7 w-7 place-items-center rounded-full bg-gradient-to-br from-[#0f5daa] to-[#03224c] text-[11px] font-bold text-white shadow-2xs">
                    {(user.name || "U")[0].toUpperCase()}
                  </div>
                  <span className="max-w-[110px] truncate">{user.name?.split(" ")[0] || "Account"}</span>
                </Link>
                <button
                  type="button"
                  onClick={() => dispatch(logout())}
                  title="Sign out"
                  className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-colors cursor-pointer"
                >
                  <LogOut size={15} />
                </button>
              </div>
            </>
          ) : (
            <>
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
            </>
          )}
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
        <div className="fixed inset-x-0 top-16 bottom-0 z-40 overflow-y-auto bg-white px-5 py-4 sm:top-[72px] lg:hidden">
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

          {mounted && hydrated && user ? (
            <div className="mt-5 space-y-3 border-t border-slate-100 pt-4">
              <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3 border border-slate-200/80">
                <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-[#0f5daa] to-[#03224c] text-xs font-bold text-white shadow-2xs">
                  {(user.name || "U")[0].toUpperCase()}
                </div>
                <div className="leading-tight">
                  <p className="text-sm font-bold text-slate-900">{user.name}</p>
                  <p className="text-xs font-medium text-slate-500 capitalize">{user.role.replace("_", " ")}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Link
                  href={dashboardUrl}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-[#0f5daa] py-2.5 text-center text-sm font-semibold text-white shadow-xs"
                >
                  <LayoutDashboard size={16} />
                  <span>Dashboard</span>
                </Link>
                <button
                  type="button"
                  onClick={() => dispatch(logout())}
                  className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-1.5 cursor-pointer"
                >
                  <LogOut size={16} />
                  <span>Sign out</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-5 flex flex-col gap-2 sm:flex-row border-t border-slate-100 pt-4">
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
          )}
        </div>
      )}
    </header>
  );
}
