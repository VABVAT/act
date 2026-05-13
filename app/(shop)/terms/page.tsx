import { buildMetadata } from "@/lib/utils/metadata";

export const metadata = buildMetadata({
  title: "Terms & Conditions",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <div className="content-wrap py-10 md:py-14">
      <div className="rounded-[32px] border border-line/70 bg-white/72 p-6 shadow-[0_24px_80px_rgba(106,72,56,0.08)] md:p-10">
        <h1 className="font-display text-5xl leading-none text-foreground">
          Terms & Conditions
        </h1>
        <div className="mt-6 grid gap-6 text-sm leading-8 text-muted md:text-base">
          <p>
            Orders are confirmed after successful payment verification and are subject to size-wise stock availability.
          </p>
          <p>
            Estimated delivery timelines are shared on product pages and may vary based on destination and dispatch load.
          </p>
          <p>
            Customers should review size selection carefully before placing an order. Return and exchange eligibility depends on product condition and the published return window.
          </p>
          <p>
            Arteez Collection reserves the right to cancel or refund orders affected by pricing issues, payment failures, or inventory discrepancies.
          </p>
        </div>
      </div>
    </div>
  );
}
