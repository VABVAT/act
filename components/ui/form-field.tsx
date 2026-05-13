import { cn } from "@/lib/utils/cn";

export function FormField({
  children,
  error,
  label,
}: {
  children: React.ReactNode;
  error?: string;
  label: string;
}) {
  return (
    <label className="grid gap-2 text-sm">
      <span className="font-semibold text-foreground">{label}</span>
      {children}
      {error ? <span className="text-xs text-danger">{error}</span> : null}
    </label>
  );
}

export function FormNote({
  children,
  tone = "muted",
}: {
  children: React.ReactNode;
  tone?: "muted" | "success" | "danger";
}) {
  return (
    <p
      className={cn("text-sm leading-6", {
        "text-muted": tone === "muted",
        "text-success": tone === "success",
        "text-danger": tone === "danger",
      })}
    >
      {children}
    </p>
  );
}
