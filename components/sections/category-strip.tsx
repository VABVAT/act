import Link from "next/link";

import type { CategoryRecord } from "@/lib/data/types";

export function CategoryStrip({ categories }: { categories: CategoryRecord[] }) {
  return (
    <section className="content-wrap py-6 md:py-10">
      <div className="grid gap-4 md:grid-cols-3">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/shop?category=${category.slug}`}
            className="rounded-[28px] border border-line/70 bg-white/68 p-6 shadow-[0_24px_80px_rgba(106,72,56,0.08)] transition hover:-translate-y-0.5 hover:border-brand/30"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-brand">
              Curated collection
            </p>
            <h3 className="mt-3 font-display text-4xl leading-none text-foreground">
              {category.name}
            </h3>
            <p className="mt-4 text-sm leading-7 text-muted">
              {category.description}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
