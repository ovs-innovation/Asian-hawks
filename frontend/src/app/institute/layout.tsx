"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, LayoutDashboard, Settings, Users, Wallet } from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/institute", label: "Dashboard", icon: LayoutDashboard },
  { href: "/institute/courses", label: "Courses", icon: BookOpen },
  { href: "/institute/students", label: "Students", icon: Users },
  { href: "/institute/revenue", label: "Revenue", icon: Wallet },
  { href: "/institute/settings", label: "Settings", icon: Settings },
];

export default function InstituteLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <aside className="fixed inset-y-0 left-0 hidden w-60 border-r border-[var(--border)] bg-[var(--card)] p-5 md:block">
        <BrandLogo height={40} />
        <p className="mt-2 text-[12px] font-semibold text-[var(--muted)]">Institute Portal</p>
        <nav className="mt-8 space-y-1">
          {nav.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-2 rounded-lg px-3 py-2 text-[13px] font-medium text-[var(--text-secondary)] hover:bg-[var(--bg)]",
                (pathname === href || (href !== "/institute" && pathname.startsWith(href))) && "bg-[#eff6ff] text-[var(--primary)]"
              )}
            >
              <Icon size={16} /> {label}
            </Link>
          ))}
        </nav>
      </aside>
      <div className="md:pl-60">
        <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-[var(--border)] bg-[var(--card)] px-6">
          <p className="text-[13px] text-[var(--text-secondary)]">Institute workspace</p>
          <Link href="/" className="text-[13px] font-medium text-[var(--primary)]">View site</Link>
        </header>
        <div className="p-6 lg:p-8">{children}</div>
      </div>
    </div>
  );
}
