"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/store";
import { logout } from "@/store/authSlice";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard, Briefcase, Users, Building2, FileText,
  Tags, BarChart2, AlertCircle, CreditCard,
  ShieldCheck, Settings, LogOut, ChevronDown, ChevronRight, Plus,
} from "lucide-react";
import { useState } from "react";

type NavItem = {
  label: string;
  href?: string;
  icon: React.ElementType;
  children?: { label: string; href: string }[];
};

const nav: NavItem[] = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  {
    label: "Jobs", icon: Briefcase,
    children: [
      { label: "All Jobs", href: "/jobs" },
      { label: "Create Job", href: "/jobs/new" },
      { label: "Drafts", href: "/jobs?status=draft" },
      { label: "Featured", href: "/jobs?featured=true" },
    ],
  },
  {
    label: "People", icon: Users,
    children: [
      { label: "All Users", href: "/users" },
      { label: "Recruiters", href: "/users?role=recruiter" },
      { label: "Candidates", href: "/users?role=candidate" },
    ],
  },
  { label: "Companies", href: "/companies", icon: Building2 },
  {
    label: "Taxonomy", icon: Tags,
    children: [
      { label: "Categories", href: "/categories" },
      { label: "Skills", href: "/taxonomy?type=skill" },
      { label: "Industries", href: "/taxonomy?type=industry" },
      { label: "Locations", href: "/taxonomy?type=location" },
    ],
  },
  {
    label: "Content", icon: FileText,
    children: [
      { label: "Blog Posts", href: "/blogs" },
      { label: "CMS Pages", href: "/cms" },
    ],
  },
  { label: "Analytics", href: "/analytics", icon: BarChart2 },
  { label: "Audit Log", href: "/audit", icon: AlertCircle },
  { label: "Billing", href: "/billing", icon: CreditCard },
  { label: "Roles", href: "/roles", icon: ShieldCheck },
  { label: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((s: RootState) => s.auth.user);
  const [open, setOpen] = useState<string | null>("Jobs");

  function handleLogout() {
    dispatch(logout());
    router.replace("/login");
  }

  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col border-r border-[#e5e7eb] bg-white">
      <div className="flex h-16 items-center border-b border-[#e5e7eb] px-4">
        <Image src="/logo.png" alt="Asian Hawks" width={160} height={44} className="h-9 w-auto" />
      </div>

      <div className="p-3">
        <Link
          href="/jobs/new"
          className="flex items-center justify-center gap-2 rounded-xl bg-[#0f5daa] px-3 py-2.5 text-sm font-semibold text-white hover:bg-[#0c4d8c]"
        >
          <Plus className="h-4 w-4" />
          Create job
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto px-2 pb-3">
        {nav.map((item) => {
          const isActive = item.href === "/" ? pathname === "/" : item.href ? pathname === item.href : false;
          const groupActive = item.children?.some((c) => pathname === c.href.split("?")[0] || pathname.startsWith(c.href.split("?")[0] + "/"));
          const isOpen = open === item.label || groupActive;

          if (!item.children) {
            return (
              <Link
                key={item.href}
                href={item.href!}
                className={cn(
                  "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-[#eaf3fb] text-[#0f5daa]"
                    : "text-[#4b5563] hover:bg-[#f3f4f6] hover:text-[#111827]"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          }

          return (
            <div key={item.label}>
              <button
                onClick={() => setOpen(isOpen ? null : item.label)}
                className={cn(
                  "flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  groupActive
                    ? "bg-[#eaf3fb] text-[#0f5daa]"
                    : "text-[#4b5563] hover:bg-[#f3f4f6] hover:text-[#111827]"
                )}
              >
                <item.icon className="h-4 w-4" />
                <span className="flex-1 text-left">{item.label}</span>
                {isOpen ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
              </button>
              {isOpen && (
                <div className="ml-6 mt-0.5 space-y-0.5 border-l border-[#e5e7eb] pl-3">
                  {item.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className={cn(
                        "block rounded-md px-2 py-1.5 text-sm transition-colors",
                        pathname === child.href.split("?")[0] && !child.href.includes("?")
                          ? "font-medium text-[#0f5daa]"
                          : "text-[#6b7280] hover:text-[#111827]"
                      )}
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      <div className="border-t border-[#e5e7eb] p-3">
        <div className="flex items-center gap-2.5 rounded-lg px-2 py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0f5daa]/10 text-sm font-semibold text-[#0f5daa]">
            {user?.name?.[0]?.toUpperCase() ?? "A"}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-[#111827]">{user?.name ?? "Admin"}</p>
            <p className="truncate text-xs text-[#9ca3af]">{user?.role ?? "super_admin"}</p>
          </div>
          <button onClick={handleLogout} title="Logout" className="text-[#9ca3af] transition-colors hover:text-red-500">
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
