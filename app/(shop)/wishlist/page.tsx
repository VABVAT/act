import Link from "next/link";

import { requireAuthenticatedUser } from "@/lib/auth/guards";
import { getWishlistProductIds, getWishlistProducts } from "@/lib/data/products";

import { EmptyState } from "@/components/ui/empty-state";
import { ProductGrid } from "@/components/product/product-grid";
import { SectionHeading } from "@/components/ui/section-heading";

export default async function WishlistPage() {
  const user = await requireAuthenticatedUser("/wishlist");
  const [products, wishlistIds] = await Promise.all([
    getWishlistProducts(user.id),
    getWishlistProductIds(user.id),
  ]);

  return (
    <div className="content-wrap py-8 md:py-12">
      <SectionHeading
        description="Save your favourite styles here and come back whenever you're ready to order."
        eyebrow="Wishlist"
        title="Your saved picks"
      />
      <div className="mt-8">
        {products.length > 0 ? (
          <ProductGrid
            isAuthenticated
            path="/wishlist"
            products={products}
            wishlistIds={wishlistIds}
          />
        ) : (
          <EmptyState
            title="Your wishlist is empty"
            description="Tap the heart on any product to save it here for later."
            action={
              <Link
                href="/shop"
                className="inline-flex rounded-full bg-brand px-5 py-3 text-sm font-semibold text-white hover:bg-brand-strong"
              >
                Explore products
              </Link>
            }
          />
        )}
      </div>
    </div>
  );
}
