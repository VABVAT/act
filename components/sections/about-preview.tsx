import Link from "next/link";

import { aboutHighlights } from "@/lib/constants/site";

export function AboutPreview() {
  return (
    <section className="content-wrap py-10 md:py-14">
      <div className="grid gap-6 rounded-[36px] border border-line/70 bg-[#F5E9DA] p-6 shadow-[0_30px_100px_rgba(106,72,56,0.08)] md:p-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-brand">
            About Arteez Collection
          </p>
          <h2 className="mt-4 font-display text-5xl leading-none text-balance text-foreground">
            A boutique storefront built around warmth, polish, and personal care.
          </h2>
          <p className="mt-5 text-sm leading-7 text-muted md:text-base">
            Arteez Collection was created to bring together elegant women&apos;s suit
            sets that feel timeless, wearable, and beautiful for real-life occasions.
          </p>
          <Link
            href="/about"
            className="mt-6 inline-flex rounded-full bg-brand px-5 py-3 text-sm font-semibold text-white hover:bg-brand-strong"
          >
            Read our story
          </Link>
        </div>
        <div className="grid gap-4">
          {aboutHighlights.map((highlight) => (
            <div key={highlight.title} className="rounded-[24px] border border-white/55 bg-white/62 p-5">
              <h3 className="text-lg font-semibold text-foreground">{highlight.title}</h3>
              <p className="mt-2 text-sm leading-7 text-muted">{highlight.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
