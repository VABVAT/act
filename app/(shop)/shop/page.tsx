import Link from "next/link";

import { EmptyState } from "@/components/ui/empty-state";
import { ProductFilters } from "@/components/product/product-filters";
import { ProductGrid } from "@/components/product/product-grid";
import { SectionHeading } from "@/components/ui/section-heading";
import { getCurrentUser } from "@/lib/auth/session";
import { getCatalogProducts, getWishlistProductIds } from "@/lib/data/products";

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolvedSearchParams = await searchParams;
  const [catalog, user] = await Promise.all([
    getCatalogProducts(resolvedSearchParams),
    getCurrentUser(),
  ]);
  const wishlistIds = user ? await getWishlistProductIds(user.id) : [];

  return (
    <div className="content-wrap py-8 md:py-12">
      <SectionHeading
        description="Browse the complete Arteez Collection catalogue with search, category, size, stock, and sorting controls."
        eyebrow="Shop"
        title="All suits"
      />
      <div className="mt-8">
        <ProductFilters categories={catalog.categories} filters={catalog.filters} />
      </div>
      <div className="mt-6 flex items-center justify-between text-sm text-muted">
        <p>{catalog.total} products found</p>
      </div>
      <div className="mt-6">
        {catalog.products.length > 0 ? (
          <ProductGrid
            isAuthenticated={Boolean(user)}
            path={`/shop${catalog.filters.q ? `?q=${encodeURIComponent(catalog.filters.q)}` : ""}`}
            products={catalog.products}
            wishlistIds={wishlistIds}
          />
        ) : (
          <EmptyState
            title="No products match your filters"
            description="Try clearing a few filters or adjusting the search term to see more options."
            action={
              <Link
                href="/shop"
                className="inline-flex rounded-full bg-brand px-5 py-3 text-sm font-semibold text-white hover:bg-brand-strong"
              >
                Reset filters
              </Link>
            }
          />
        )}
      </div>
    </div>
  );
}
