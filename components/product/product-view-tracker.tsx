"use client";

import { useEffect } from "react";

import { trackRecentlyViewedAction } from "@/app/actions/cart";
import type { ProductRecord } from "@/lib/data/types";
import { useRecentProductsStore } from "@/stores/recent-products-store";

export function ProductViewTracker({ product }: { product: ProductRecord }) {
  const add = useRecentProductsStore((state) => state.add);

  useEffect(() => {
    add({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      imageUrl: product.images[0]?.imageUrl ?? "/catalog/noor-teal-main.svg",
      price: product.effectivePrice,
      originalPrice: product.discountedPrice ? product.price : null,
    });
    void trackRecentlyViewedAction(product.id);
  }, [add, product]);

  return null;
}
