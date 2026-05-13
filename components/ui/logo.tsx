import Link from "next/link";

import { cn } from "@/lib/utils/cn";

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("inline-flex flex-col leading-none", className)}>
      <span className="text-xs font-semibold uppercase tracking-[0.34em] text-brand">
        Arteez
      </span>
      <span className="mt-1 font-display text-[1.95rem] text-foreground">
        Collection
      </span>
    </Link>
  );
}
