import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { WishlistToggleButton } from "@/components/wishlist/wishlist-toggle-button";
import type { ProductRecord } from "@/lib/data/types";
import { formatCurrency } from "@/lib/utils/currency";

export function ProductCard({
  isAuthenticated,
  isWishlisted = false,
  path,
  product,
}: {
  isAuthenticated: boolean;
  isWishlisted?: boolean;
  path: string;
  product: ProductRecord;
}) {
  const primaryImage = product.images[0]?.imageUrl ?? "/catalog/ivory-meher-main.svg";

  return (
    <article className="group relative overflow-hidden rounded-[28px] border border-line/70 bg-white/70 shadow-[0_24px_80px_rgba(106,72,56,0.08)]">
      <div className="absolute right-4 top-4 z-10">
        <WishlistToggleButton
          initialValue={isWishlisted}
          isAuthenticated={isAuthenticated}
          path={path}
          productId={product.id}
        />
      </div>
      <Link href={`/shop/${product.slug}`} className="block">
        <div className="relative aspect-[3/4] overflow-hidden bg-brand-soft/25">
          <Image
            alt={product.images[0]?.altText || product.name}
            className="object-cover transition duration-500 group-hover:scale-[1.03]"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            src={primaryImage}
          />
        </div>
      </Link>
      <div className="grid gap-3 p-5">
        <div className="flex flex-wrap items-center gap-2">
          {product.featured ? <Badge>Featured</Badge> : null}
          {product.discountedPrice ? <Badge tone="accent">On offer</Badge> : null}
          {product.stock <= 0 ? <Badge tone="danger">Out of stock</Badge> : null}
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand">
            {product.category?.name || "Suit set"}
          </p>
          <Link href={`/shop/${product.slug}`}>
            <h3 className="mt-2 text-lg font-semibold text-foreground transition group-hover:text-brand-strong">
              {product.name}
            </h3>
          </Link>
          <p className="mt-2 text-sm leading-6 text-muted">
            {product.fabric} • {product.color}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-lg font-semibold text-foreground">
            {formatCurrency(product.effectivePrice)}
          </span>
          {product.discountedPrice ? (
            <span className="text-sm text-muted line-through">
              {formatCurrency(product.price)}
            </span>
          ) : null}
        </div>
      </div>
    </article>
  );
}
