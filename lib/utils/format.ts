import { format } from "date-fns";

export function formatDate(date: Date | string | null | undefined, pattern = "dd MMM yyyy") {
  if (!date) {
    return "";
  }

  const resolvedDate = typeof date === "string" ? new Date(date) : date;

  if (Number.isNaN(resolvedDate.getTime())) {
    return "";
  }

  return format(resolvedDate, pattern);
}

export function compactNumber(value: number) {
  return new Intl.NumberFormat("en-IN", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}
