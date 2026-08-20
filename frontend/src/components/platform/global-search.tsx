"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Briefcase, BookOpen, FileText, Search } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { id: "all", label: "All", icon: Search, base: "/jobs" },
  { id: "jobs", label: "Jobs", icon: Briefcase, base: "/private-jobs" },
  { id: "tenders", label: "Tenders", icon: FileText, base: "/tenders" },
  { id: "courses", label: "Courses", icon: BookOpen, base: "/courses" },
] as const;

export function GlobalSearch({
  className,
  variant = "default",
}: {
  className?: string;
  variant?: "default" | "hero";
}) {
  const router = useRouter();
  const [tab, setTab] = useState<(typeof tabs)[number]["id"]>("all");
  const [q, setQ] = useState("");

  function submit(e: FormEvent) {
    e.preventDefault();
    const active = tabs.find((t) => t.id === tab)!;
    const p = new URLSearchParams();
    if (q.trim()) p.set("keyword", q.trim());
    router.push(`${active.base}?${p.toString()}`);
  }

  const isHero = variant === "hero";

  return (
    <div
      className={cn(
        "rounded-2xl p-2",
        isHero
          ? "border border-white/20 bg-white shadow-[0_20px_60px_rgba(0,0,0,0.25)]"
          : "border border-[var(--border)] bg-[var(--card)] shadow-[var(--shadow-md)]",
        className
      )}
    >
      <div className={cn("flex flex-wrap gap-1 px-2 pb-2", isHero ? "border-b border-[var(--border)]" : "border-b border-[var(--border)]")}>
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-[13px] font-semibold transition-colors",
              tab === id
                ? "bg-[var(--primary)] text-white"
                : "text-[var(--text-secondary)] hover:bg-[var(--bg)]"
            )}
          >
            <Icon size={15} />
            {label}
          </button>
        ))}
      </div>
      <form onSubmit={submit} className="flex flex-col gap-2 p-2 sm:flex-row sm:items-center">
        <div className="flex min-w-0 flex-1 items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--bg)] px-4 py-3.5">
          <Search size={20} className="shrink-0 text-[var(--primary)]" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search jobs, tenders, courses, exams..."
            className="w-full bg-transparent text-[15px] text-[var(--text)] outline-none placeholder:text-[var(--text-secondary)]"
          />
        </div>
        <button
          type="submit"
          className="h-[52px] shrink-0 rounded-xl bg-[var(--primary)] px-8 text-[15px] font-bold text-white transition-colors hover:bg-[var(--primary-hover)]"
        >
          Search
        </button>
      </form>
    </div>
  );
}
