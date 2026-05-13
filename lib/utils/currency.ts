import { site } from "@/lib/constants/site";

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: site.currency,
  maximumFractionDigits: 0,
});

export function formatCurrency(value: number | string | null | undefined) {
  const numericValue =
    typeof value === "string"
      ? Number.parseFloat(value)
      : typeof value === "number"
        ? value
        : 0;

  return currencyFormatter.format(Number.isFinite(numericValue) ? numericValue : 0);
}
