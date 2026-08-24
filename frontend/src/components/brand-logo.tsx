import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function BrandLogo({
  className,
  href = "/",
  height = 44,
}: {
  className?: string;
  href?: string | null;
  height?: number;
}) {
  const img = (
    <Image
      src="/logo.png"
      alt="Asian Hawks Manpower Services Private Limited"
      width={280}
      height={72}
      priority
      className="h-full w-auto max-w-[170px] object-contain object-left sm:max-w-[210px] lg:max-w-[240px]"
      unoptimized
    />
  );

  if (href === null || href === "") {
    return <span className={cn("inline-flex shrink-0 items-center", className)} style={{ height }}>{img}</span>;
  }

  return (
    <Link href={href} className={cn("inline-flex shrink-0 items-center", className)} style={{ height }} aria-label="Asian Hawks home">
      {img}
    </Link>
  );
}
