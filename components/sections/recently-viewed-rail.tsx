"use client";

import Link from "next/link";

import type { ProductRecord } from "@/lib/data/types";
import { formatCurrency } from "@/lib/utils/currency";
import { useRecentProductsStore } from "@/stores/recent-products-store";

export function RecentlyViewedRail({
  fallbackProducts = [],
}: {
  fallbackProducts?: ProductRecord[];
}) {
  const items = useRecentProductsStore((state) => state.items);
  const visibleItems =
    items.length > 0
      ? items
      : fallbackProducts.map((product) => ({
          productId: product.id,
          slug: product.slug,
          name: product.name,
          imageUrl: product.images[0]?.imageUrl ?? "/catalog/noor-teal-main.svg",
          price: product.effectivePrice,
          originalPrice: product.discountedPrice ? product.price : null,
        }));

  if (visibleItems.length === 0) {
    return null;
  }

  return (
    <section className="content-wrap py-10 md:py-14">
      <div className="rounded-[32px] border border-line/70 bg-white/70 p-6 shadow-[0_24px_80px_rgba(106,72,56,0.08)]">
        <p className="text-xs font-semibold uppercase tracking-[0.32em] text-brand">
          Recently viewed
        </p>
        <h2 className="mt-3 font-display text-4xl leading-none text-foreground">
          Pick up where you left off
        </h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3 lg:grid-cols-4">
          {visibleItems.map((item) => (
            <Link
              key={item.productId}
              href={`/shop/${item.slug}`}
              className="rounded-[24px] border border-line/70 bg-background-soft px-4 py-4 hover:border-brand/30"
            >
              <div className="relative aspect-[4/5] overflow-hidden rounded-[18px] bg-white/70">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img alt={item.name} className="h-full w-full object-cover" src={item.imageUrl} />
              </div>
              <h3 className="mt-4 text-sm font-semibold text-foreground">{item.name}</h3>
              <div className="mt-2 flex items-center gap-2 text-sm">
                <span className="font-semibold text-foreground">{formatCurrency(item.price)}</span>
                {item.originalPrice ? (
                  <span className="text-muted line-through">
                    {formatCurrency(item.originalPrice)}
                  </span>
                ) : null}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
