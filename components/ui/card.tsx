import { cn } from "@/lib/utils/cn";

export function Card({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "surface-card rounded-[28px] border border-line/70 p-5 md:p-6",
        className,
      )}
      {...props}
    />
  );
}
