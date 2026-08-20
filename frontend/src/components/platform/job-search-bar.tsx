"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Briefcase, MapPin, Search } from "lucide-react";
import { CATEGORIES } from "@/lib/demo-data";
import { cn } from "@/lib/utils";

export function JobSearchBar({ className }: { className?: string }) {
  const router = useRouter();
  const [q, setQ] = useState({ keyword: "", location: "", category: "", experience: "" });

  function submit(e: FormEvent) {
    e.preventDefault();
    const p = new URLSearchParams();
    if (q.keyword) p.set("keyword", q.keyword);
    if (q.location) p.set("location", q.location);
    if (q.category) p.set("keyword", q.keyword || q.category);
    if (q.experience) p.set("experience", q.experience);
    router.push(`/private-jobs?${p.toString()}`);
  }

  return (
    <form
      onSubmit={submit}
      className={cn(
        "grid gap-2 rounded-[var(--radius)] border border-[var(--border)] bg-white p-2 shadow-[var(--shadow-md)] md:grid-cols-[1.3fr_1fr_1fr_1fr_auto]",
        className
      )}
    >
      <label className="flex items-center gap-2 rounded-xl px-3 py-2.5">
        <Search size={18} className="shrink-0 text-[var(--primary)]" />
        <input
          value={q.keyword}
          onChange={(e) => setQ({ ...q, keyword: e.target.value })}
          placeholder="Search job title or skill"
          className="w-full bg-transparent text-[14px] text-[var(--heading)] outline-none placeholder:text-[var(--muted)]"
        />
      </label>
      <label className="flex items-center gap-2 rounded-xl border-t border-[var(--border)] px-3 py-2.5 md:border-l md:border-t-0">
        <MapPin size={18} className="shrink-0 text-[var(--muted)]" />
        <input
          value={q.location}
          onChange={(e) => setQ({ ...q, location: e.target.value })}
          placeholder="Location"
          className="w-full bg-transparent text-[14px] text-[var(--heading)] outline-none placeholder:text-[var(--muted)]"
        />
      </label>
      <select
        value={q.category}
        onChange={(e) => setQ({ ...q, category: e.target.value })}
        className="rounded-xl border-t border-[var(--border)] bg-transparent px-3 py-2.5 text-[14px] text-[var(--heading)] outline-none md:border-l md:border-t-0"
      >
        <option value="">Category</option>
        {CATEGORIES.map((category) => (
          <option key={category}>{category}</option>
        ))}
      </select>
      <label className="flex items-center gap-2 rounded-xl border-t border-[var(--border)] px-3 py-2.5 md:border-l md:border-t-0">
        <Briefcase size={18} className="shrink-0 text-[var(--muted)]" />
        <select
          value={q.experience}
          onChange={(e) => setQ({ ...q, experience: e.target.value })}
          className="w-full bg-transparent text-[14px] text-[var(--heading)] outline-none"
        >
          <option value="">Experience</option>
          <option>Fresher</option>
          <option>1-3 years</option>
          <option>3-5 years</option>
          <option>5-8 years</option>
          <option>8+ years</option>
        </select>
      </label>
      <button
        type="submit"
        className="h-[48px] rounded-xl bg-[var(--cta)] px-6 text-[14px] font-bold text-white transition-colors hover:bg-[var(--cta-hover)]"
      >
        Search
      </button>
    </form>
  );
}
