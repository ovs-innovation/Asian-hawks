import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function BrandLogo({
  className,
  href = "/",
  height = 54,
}: {
  className?: string;
  href?: string | null;
  height?: number;
}) {
  const img = (
    <Image
      src="/logo.png"
      alt="Asian Hawks Manpower Services Private Limited"
      width={340}
      height={90}
      priority
      className="h-full w-auto max-w-[210px] object-contain object-left sm:max-w-[260px] lg:max-w-[300px]"
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
