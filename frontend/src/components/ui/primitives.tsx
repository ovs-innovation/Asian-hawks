import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Input({ className, ...props }: ComponentProps<"input">) {
  return (
    <input
      className={cn(
        "flex h-10 w-full rounded-xl border border-[#e2e8f0] bg-white px-3.5 text-sm text-[#0f172a] shadow-xs outline-none transition-all placeholder:text-[#94a3b8] focus:border-[#0f5daa] focus:ring-2 focus:ring-[#0f5daa]/15",
        className
      )}
      {...props}
    />
  );
}

export function Textarea({ className, ...props }: ComponentProps<"textarea">) {
  return (
    <textarea
      className={cn(
        "flex min-h-28 w-full rounded-xl border border-[#e2e8f0] bg-white px-3.5 py-2.5 text-sm text-[#0f172a] shadow-xs outline-none transition-all placeholder:text-[#94a3b8] focus:border-[#0f5daa] focus:ring-2 focus:ring-[#0f5daa]/15",
        className
      )}
      {...props}
    />
  );
}

export function Label({ className, ...props }: ComponentProps<"label">) {
  return <label className={cn("text-sm font-semibold text-[#334155]", className)} {...props} />;
}

export function Card({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-slate-200/80 bg-white shadow-[0_2px_10px_rgba(15,23,42,0.03)] transition-all",
        className
      )}
      {...props}
    />
  );
}

export function Badge({
  className,
  tone = "slate",
  ...props
}: ComponentProps<"span"> & { tone?: "slate" | "blue" | "green" | "amber" | "red" | "purple" }) {
  const tones = {
    slate: "bg-slate-100 text-slate-700 border border-slate-200/60",
    blue: "bg-blue-50 text-blue-700 border border-blue-200/60",
    green: "bg-emerald-50 text-emerald-700 border border-emerald-200/60",
    amber: "bg-amber-50 text-amber-800 border border-amber-200/60",
    red: "bg-rose-50 text-rose-700 border border-rose-200/60",
    purple: "bg-purple-50 text-purple-700 border border-purple-200/60",
  };
  return (
    <span
      className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold tracking-wide", tones[tone], className)}
      {...props}
    />
  );
}

export function Skeleton({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("animate-pulse rounded-xl bg-slate-100", className)} {...props} />;
}

export function Separator({ className }: { className?: string }) {
  return <div className={cn("h-px w-full bg-slate-200/80", className)} />;
}

export function EmptyState({
  title,
  body,
  action,
}: {
  title: string;
  body: string;
  action?: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 p-10 text-center">
      <h3 className="text-base font-bold text-slate-800 tracking-tight">{title}</h3>
      <p className="mx-auto mt-1.5 max-w-md text-sm text-slate-500 leading-relaxed">{body}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
