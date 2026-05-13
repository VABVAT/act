import { cn } from "@/lib/utils/cn";

type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  tone?: "default" | "success" | "danger" | "accent";
};

const toneClassMap = {
  default: "bg-brand-soft/45 text-brand-strong",
  success: "bg-success/10 text-success",
  danger: "bg-danger/10 text-danger",
  accent: "bg-accent/15 text-[#8D6514]",
} as const;

export function Badge({ className, tone = "default", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold tracking-wide",
        toneClassMap[tone],
        className,
      )}
      {...props}
    />
  );
}
