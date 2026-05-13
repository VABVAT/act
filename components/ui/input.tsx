import * as React from "react";

import { cn } from "@/lib/utils/cn";

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      "h-12 w-full rounded-2xl border border-line bg-white/85 px-4 text-sm text-foreground shadow-sm placeholder:text-muted focus:border-brand/35 focus:ring-2 focus:ring-brand/20",
      className,
    )}
    {...props}
  />
));

Input.displayName = "Input";
