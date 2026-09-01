"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

export function SafeImage({
  src,
  alt,
  className,
  fallback = "/courses/office.jpg",
}: {
  src?: string;
  alt: string;
  className?: string;
  fallback?: string;
}) {
  const [current, setCurrent] = useState(src || fallback);

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={current}
      alt={alt}
      className={cn("bg-[#eaf3fb]", className)}
      onError={() => {
        if (current !== fallback) setCurrent(fallback);
      }}
    />
  );
}
