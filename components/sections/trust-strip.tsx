import { trustPoints } from "@/lib/constants/site";

export function TrustStrip() {
  return (
    <section className="content-wrap py-8 md:py-10">
      <div className="grid gap-4 rounded-[28px] border border-line/70 bg-white/68 p-6 shadow-[0_24px_80px_rgba(106,72,56,0.08)] md:grid-cols-4">
        {trustPoints.map((point) => (
          <div key={point} className="rounded-[22px] bg-background-soft px-4 py-5 text-sm leading-7 text-foreground">
            {point}
          </div>
        ))}
      </div>
    </section>
  );
}
