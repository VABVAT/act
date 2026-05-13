import * as React from "react";

import { cn } from "@/lib/utils/cn";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
};

const variantClassMap = {
  primary:
    "bg-brand text-white shadow-[0_20px_60px_rgba(154,79,56,0.28)] hover:bg-brand-strong",
  secondary:
    "bg-white text-foreground border border-line hover:border-brand/30 hover:bg-brand-soft/35",
  ghost: "bg-transparent text-foreground hover:bg-brand-soft/35",
  danger: "bg-danger text-white hover:bg-danger/90",
} as const;

const sizeClassMap = {
  sm: "h-10 px-4 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-6 text-base",
} as const;

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, size = "md", type = "button", variant = "primary", ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/30 disabled:pointer-events-none disabled:opacity-60",
        variantClassMap[variant],
        sizeClassMap[size],
        className,
      )}
      {...props}
    />
  ),
);

Button.displayName = "Button";
