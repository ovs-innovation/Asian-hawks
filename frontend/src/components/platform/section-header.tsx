import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function SectionHeader({
  title,
  subtitle,
  href,
  linkLabel = "View all",
}: {
  title: string;
  subtitle?: string;
  href?: string;
  linkLabel?: string;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h2 className="text-[22px] font-extrabold tracking-tight text-[var(--heading)] md:text-[24px]">{title}</h2>
        {subtitle && <p className="mt-1 text-[14px] text-[var(--text-secondary)]">{subtitle}</p>}
      </div>
      {href && (
        <Link
          href={href}
          className="inline-flex items-center gap-1 text-[14px] font-semibold text-[var(--primary)] hover:underline"
        >
          {linkLabel} <ArrowRight size={15} />
        </Link>
      )}
    </div>
  );
}
