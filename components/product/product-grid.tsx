import type { ProductRecord } from "@/lib/data/types";

import { ProductCard } from "@/components/product/product-card";

export function ProductGrid({
  isAuthenticated,
  path,
  products,
  wishlistIds = [],
}: {
  isAuthenticated: boolean;
  path: string;
  products: ProductRecord[];
  wishlistIds?: string[];
}) {
  const wishlistSet = new Set(wishlistIds);

  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          isAuthenticated={isAuthenticated}
          isWishlisted={wishlistSet.has(product.id)}
          path={path}
          product={product}
        />
      ))}
    </div>
  );
}
