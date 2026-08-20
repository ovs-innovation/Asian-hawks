"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Bell,
  Briefcase,
  Building2,
  FileText,
  Inbox,
  LayoutDashboard,
  LogOut,
  Settings,
  Users,
} from "lucide-react";
import { logout } from "@/store/authSlice";
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
  const pathname = usePathname();
  const user = useSelector((s: RootState) => s.auth.user);
  const hydrated = useSelector((s: RootState) => s.auth.hydrated);
  const dispatch = useDispatch();
  const router = useRouter();
  const items = menus[area];
  const isAdmin = area === "admin";

  useEffect(() => {
    if (!hydrated) return;
    if (!user) router.replace("/login");
  }, [hydrated, user, router]);

  if (!hydrated || !user) {
    return <div className="grid min-h-screen place-items-center text-sm text-slate-500">Loading workspace…</div>;
  }

  return (
    <div className="min-h-screen bg-[#f7f9fc]">
      <aside
        className={cn(
          "fixed inset-y-0 left-0 hidden w-64 flex-col p-5 md:flex",
          isAdmin ? "bg-[#03224c] text-white" : "border-r border-[var(--border)] bg-white"
        )}
      >
        <Link href="/" className={cn("block rounded-lg", isAdmin && "bg-white px-2 py-2")}>
          <BrandLogo href={undefined} height={40} />
        </Link>
        <p className={cn("mt-6 px-3 text-[11px] font-semibold uppercase tracking-[0.16em]", isAdmin ? "text-white/45" : "text-slate-400")}>
          {isAdmin ? "Admin" : area}
        </p>
        <nav className="mt-3 flex-1 space-y-1 overflow-y-auto">
          {items.map(([label, href, Icon]) => {
            const active = pathname === href || (href !== `/${area}` && pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-[14px] font-medium",
                  isAdmin
                    ? active
                      ? "bg-white/15 text-white"
                      : "text-white/75 hover:bg-white/10 hover:text-white"
                    : active
                      ? "bg-[#eff6ff] text-[var(--primary)]"
                      : "text-[var(--text-secondary)] hover:bg-[#f7f9fc]"
                )}
              >
                <Icon size={16} /> {label}
              </Link>
            );
          })}
        </nav>
        <Button
          variant="ghost"
          className={cn("mt-4 w-full justify-start", isAdmin && "text-white/80 hover:bg-white/10 hover:text-white")}
          onClick={() => {
            dispatch(logout());
            router.push("/");
          }}
        >
          <LogOut size={16} /> Sign out
        </Button>
      </aside>
      <div className="md:pl-64">
        <header className="sticky top-0 z-20 border-b border-[#e5e7eb] bg-white/95 backdrop-blur">
          <div className="flex h-14 items-center justify-between gap-3 px-4 sm:h-16 sm:px-6">
            <p className="truncate text-sm text-[#64748b]">
              {user.name} · {user.role.replace("_", " ")}
            </p>
            <Link href="/" className="shrink-0 text-sm font-medium text-[#0f5daa] hover:underline">
              View website
            </Link>
          </div>
          <nav className="flex gap-1 overflow-x-auto border-t border-[#eef2f6] px-3 py-2 md:hidden [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {items.map(([label, href]) => {
              const active = pathname === href || (href !== `/${area}` && pathname.startsWith(href));
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "shrink-0 rounded-full px-3 py-1.5 text-[12px] font-semibold",
                    active ? "bg-[#0f5daa] text-white" : "bg-[#f1f5f9] text-[#475569]"
                  )}
                >
                  {label}
                </Link>
              );
            })}
          </nav>
        </header>
        <div className="p-4 sm:p-6 lg:p-10">{children}</div>
      </div>
    </div>
  );
}

export function PageHeader({ title, body, action }: { title: string; body?: string; action?: ReactNode }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[#111827] sm:text-3xl">{title}</h1>
        {body && <p className="mt-1 text-sm text-[#64748b]">{body}</p>}
      </div>
      {action}
    </div>
  );
}
