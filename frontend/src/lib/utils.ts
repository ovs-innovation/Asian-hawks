import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatSalary(min?: number, max?: number, currency = "USD") {
  if (!min && !max) return "Competitive";
  const fmt = (n: number) =>
    currency.includes("/")
      ? `${currency.split("/")[0]} ${n}`
      : new Intl.NumberFormat("en-US", {
          style: "currency",
          currency,
          maximumFractionDigits: 0,
        }).format(n);
  if (min && max) return `${fmt(min)}–${fmt(max)}`;
  return fmt(min || max || 0);
}

export function timeAgo(date: string | Date) {
  if (!date) return "Recently";
  const jobTime = new Date(date).getTime();
  if (isNaN(jobTime)) return "Recently";
  const diff = Date.now() - jobTime;
  if (diff < 0) return "Just now";

  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  const jobDate = new Date(date);
  const today = new Date();

  const isSameDay =
    jobDate.getDate() === today.getDate() &&
    jobDate.getMonth() === today.getMonth() &&
    jobDate.getFullYear() === today.getFullYear();

  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const isYesterday =
    jobDate.getDate() === yesterday.getDate() &&
    jobDate.getMonth() === yesterday.getMonth() &&
    jobDate.getFullYear() === yesterday.getFullYear();

  if (isSameDay) {
    if (minutes < 5) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    return `${hours}h ago`;
  }

  if (isYesterday || (hours >= 24 && hours < 48)) {
    return "1d ago";
  }

  if (days < 14) {
    return `${days}d ago`;
  }

  const weeks = Math.floor(days / 7);
  return `${weeks}w ago`;
}

export const API_URL = (process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000/api").replace(
  "://localhost",
  "://127.0.0.1"
);
