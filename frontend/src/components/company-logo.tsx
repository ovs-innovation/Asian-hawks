"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

const DEFAULT_LOGO = "/logo.png";

const NAME_LOGOS: [RegExp, string][] = [
  [/asian hawks/i, DEFAULT_LOGO],
  [/state bank|sbi/i, "/banks/sbi.svg"],
  [/hdfc/i, "/banks/hdfc.svg"],
  [/icici/i, "/banks/icici.svg"],
  [/axis/i, "/banks/axis.svg"],
  [/punjab national|pnb/i, "/banks/pnb.svg"],
  [/kotak/i, "/banks/kotak.svg"],
];

export function resolveCompanyLogo(name?: string, logo?: string) {
  if (logo && logo.trim()) return logo;
  const label = name || "";
  for (const [pattern, src] of NAME_LOGOS) {
    if (pattern.test(label)) return src;
  }
  return DEFAULT_LOGO;
}

export function CompanyLogo({
  name,
  logo,
  className,
  size = 40,
}: {
  name?: string;
  logo?: string;
  className?: string;
  size?: number;
}) {
  const src = resolveCompanyLogo(name, logo);
  const [failed, setFailed] = useState(false);
  const initials = (name || "AH")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();

  if (failed) {
    return (
      <span
        className={cn(
          "grid shrink-0 place-items-center rounded-[10px] border border-[#e5e7eb] bg-[#f8fafc] text-[12px] font-bold text-[#0f5daa]",
          className
        )}
        style={{ width: size, height: size }}
      >
        {initials}
      </span>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={name || "Company"}
      width={size}
      height={size}
      className={cn(
        "shrink-0 rounded-[10px] border border-[#e5e7eb] bg-white object-contain p-1",
        className
      )}
      style={{ width: size, height: size }}
      onError={() => setFailed(true)}
    />
  );
}
