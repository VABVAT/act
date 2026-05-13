import * as React from "react";

import { cn } from "@/lib/utils/cn";

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      "min-h-[140px] w-full rounded-2xl border border-line bg-white/85 px-4 py-3 text-sm text-foreground shadow-sm placeholder:text-muted focus:border-brand/35 focus:ring-2 focus:ring-brand/20",
      className,
    )}
    {...props}
  />
));

Textarea.displayName = "Textarea";
