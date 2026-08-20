import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatSalary(min?: number, max?: number, currency = "INR") {
  if (!min && !max) return "Competitive";
  const fmt = (n: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(n);
  if (min && max) return `${fmt(min)}\u2013${fmt(max)}`;
  return fmt(min || max || 0);
}

export function timeAgo(date: string | Date) {
  const d = new Date(date).getTime();
  const diff = Date.now() - d;
  const days = Math.floor(diff / 86400000);
  if (days <= 0) return "Today";
  if (days === 1) return "1d ago";
  if (days < 14) return `${days}d ago`;
  return `${Math.floor(days / 7)}w ago`;
}

// Backend API URL — can be overridden via .env.local
export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
