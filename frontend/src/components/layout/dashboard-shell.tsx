"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Menu,
  X,
  Bell,
  Briefcase,
  Building2,
  ExternalLink,
  FileText,
  Inbox,
  LayoutDashboard,
  LogOut,
  Settings,
  Users,
} from "lucide-react";
import { logout, hydrate } from "@/store/authSlice";
import type { RootState } from "@/store";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { BrandLogo } from "@/components/brand-logo";

const menus = {
  candidate: [
    ["Dashboard", "/candidate", LayoutDashboard],
    ["Applied Jobs", "/candidate/applied", Briefcase],
    ["Saved Jobs", "/candidate/saved", Briefcase],
    ["Resume", "/candidate/resume", FileText],
    ["Profile", "/candidate/profile", Users],
    ["Notifications", "/candidate/notifications", Bell],
    ["Settings", "/candidate/settings", Settings],
  ],
  recruiter: [
    ["Dashboard", "/recruiter", LayoutDashboard],
    ["Post Job", "/recruiter/jobs/new", FileText],
    ["Applications", "/recruiter/applications", Users],
    ["Candidates", "/recruiter/pipeline", Users],
    ["Company Profile", "/recruiter/company", Building2],
    ["Jobs", "/recruiter/jobs", Briefcase],
    ["Subscription", "/recruiter/billing", FileText],
  ],
  admin: [
    ["Dashboard", "/admin", LayoutDashboard],
    ["Jobs", "/admin/jobs", Briefcase],
    ["Applications", "/admin/applications", Inbox],
    ["Companies", "/admin/companies", Building2],
    ["Users", "/admin/users", Users],
    ["Settings", "/admin/settings", Settings],
  ],
} as const;

export function DashboardShell({
  area,
  children,
}: {
  area: "candidate" | "recruiter" | "admin";
  children: ReactNode;
}) {
  const [mounted, setMounted] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const pathname = usePathname();
  const user = useSelector((s: RootState) => s.auth.user);
  const hydrated = useSelector((s: RootState) => s.auth.hydrated);
  const dispatch = useDispatch();
  const router = useRouter();
  const items = menus[area];
  const isAdmin = area === "admin";

  useEffect(() => {
    setMounted(true);
    if (!hydrated) {
      dispatch(hydrate());
    }
  }, [hydrated, dispatch]);

  useEffect(() => {
    if (!mounted || !hydrated) return;
    if (!user) router.replace("/login");
  }, [mounted, hydrated, user, router]);

  useEffect(() => {
    // Auto-close overlay on mobile route changes
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  }, [pathname]);

  if (!mounted || !hydrated || !user) {
    return (
      <div className="grid min-h-screen place-items-center bg-[#f8fafc] text-sm font-medium text-slate-500">
        <div className="flex items-center gap-3 rounded-full bg-white px-5 py-2.5 shadow-xs border border-slate-200">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#0f5daa] border-t-transparent" />
          <span>Loading workspace…</span>
        </div>
      </div>
    );
  }

  const userInitial = (user.name || "U")[0].toUpperCase();

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Mobile Backdrop Overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs md:hidden"
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col p-5 transition-transform duration-300 ease-in-out",
          isAdmin ? "bg-[#03224c] text-white" : "border-r border-slate-200/80 bg-white",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between gap-2">
          <BrandLogo
            href="/"
            height={48}
            className={cn("transition-opacity hover:opacity-90", isAdmin && "bg-white px-3.5 py-2 rounded-xl shadow-xs")}
          />
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-lg border transition-colors md:hidden",
              isAdmin
                ? "border-white/20 text-white/80 hover:bg-white/10 hover:text-white"
                : "border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
            )}
            title="Close sidebar"
          >
            <X size={16} />
          </button>
        </div>

        <p className={cn("mt-7 px-3 text-[11px] font-bold uppercase tracking-[0.18em]", isAdmin ? "text-white/45" : "text-slate-400")}>
          {isAdmin ? "Admin Portal" : `${area} Workspace`}
        </p>

        <nav className="mt-3 flex-1 space-y-1 overflow-y-auto pr-1">
          {items.map(([label, href, Icon]) => {
            const active = pathname === href || (href !== `/${area}` && pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-[14px] font-semibold transition-all",
                  isAdmin
                    ? active
                      ? "bg-white/15 text-white shadow-xs"
                      : "text-white/75 hover:bg-white/10 hover:text-white"
                    : active
                      ? "bg-[#edf5ff] text-[#0f5daa] shadow-xs"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                <Icon size={17} className={cn("shrink-0", active ? (isAdmin ? "text-white" : "text-[#0f5daa]") : "text-slate-400")} />
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto border-t border-slate-100 pt-4">
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start gap-2.5 rounded-xl text-slate-600 hover:bg-rose-50 hover:text-rose-600 font-semibold",
              isAdmin && "text-white/80 hover:bg-white/10 hover:text-white"
            )}
            onClick={() => {
              dispatch(logout());
              router.push("/");
            }}
          >
            <LogOut size={16} /> Sign out
          </Button>
        </div>
      </aside>

      <div className={cn("flex flex-col min-h-screen transition-all duration-300", sidebarOpen ? "md:pl-64" : "md:pl-0")}>
        <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
          <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-8">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setSidebarOpen((prev) => !prev)}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 hover:text-[#0f5daa] transition-all shadow-2xs"
                title={sidebarOpen ? "Close sidebar" : "Open sidebar"}
                aria-label="Toggle Sidebar"
              >
                <Menu size={18} />
              </button>
              <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-[#0f5daa] to-[#03224c] text-xs font-bold text-white shadow-xs border border-slate-200/60">
                {user.avatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
                ) : (
                  <span>{userInitial}</span>
                )}
              </div>
              <div className="leading-tight">
                <p className="text-sm font-bold text-slate-900">{user.name}</p>
                <p className="text-xs font-medium text-slate-500 capitalize">{user.role.replace("_", " ")}</p>
              </div>
            </div>

            <Link
              href="/"
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200/80 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-[#0f5daa] transition-all hover:bg-blue-50 hover:border-blue-200"
            >
              <span>View website</span>
              <ExternalLink size={13} />
            </Link>
          </div>

          <nav className="flex gap-1 overflow-x-auto border-t border-slate-100 px-3 py-2 md:hidden [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {items.map(([label, href]) => {
              const active = pathname === href || (href !== `/${area}` && pathname.startsWith(href));
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "shrink-0 rounded-full px-3.5 py-1.5 text-[12px] font-semibold transition-all",
                    active ? "bg-[#0f5daa] text-white shadow-xs" : "bg-slate-100 text-slate-600 hover:bg-slate-200/70"
                  )}
                >
                  {label}
                </Link>
              );
            })}
          </nav>
        </header>

        <main className="flex-1 p-5 sm:p-8 lg:p-10 max-w-7xl w-full mx-auto">{children}</main>
      </div>
    </div>
  );
}

export function PageHeader({ title, body, action }: { title: string; body?: string; action?: ReactNode }) {
  return (
    <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/70 pb-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-[#0f294a] sm:text-3xl leading-snug">{title}</h1>
        {body && <p className="mt-1 text-sm font-medium text-slate-500">{body}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
