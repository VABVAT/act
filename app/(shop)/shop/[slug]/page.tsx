import { notFound } from "next/navigation";

import { AddToBagPanel } from "@/components/cart/add-to-bag-panel";
import { ProductGallery } from "@/components/product/product-gallery";
import { ProductGrid } from "@/components/product/product-grid";
import { ProductViewTracker } from "@/components/product/product-view-tracker";
import { SectionHeading } from "@/components/ui/section-heading";
import { getCurrentUser } from "@/lib/auth/session";
import {
  getProductBySlug,
  getRelatedProducts,
  getWishlistProductIds,
} from "@/lib/data/products";
import { buildMetadata } from "@/lib/utils/metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return buildMetadata({
      title: "Product not found",
      path: `/shop/${slug}`,
    });
  }

  return buildMetadata({
    title: product.name,
    description: product.description,
    path: `/shop/${product.slug}`,
    image: product.images[0]?.imageUrl,
  });
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const [user, relatedProducts] = await Promise.all([
    getCurrentUser(),
    getRelatedProducts(product),
  ]);
  const wishlistIds = user ? await getWishlistProductIds(user.id) : [];
  const isWishlisted = wishlistIds.includes(product.id);

  return (
    <div className="content-wrap py-8 md:py-12">
      <ProductViewTracker product={product} />
      <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <ProductGallery images={product.images} productName={product.name} />
        <AddToBagPanel
          isAuthenticated={Boolean(user)}
          isWishlisted={isWishlisted}
          path={`/shop/${product.slug}`}
          product={product}
        />
      </div>
      <section className="mt-12 rounded-[32px] border border-line/70 bg-white/70 p-6 shadow-[0_24px_80px_rgba(106,72,56,0.08)]">
        <div className="grid gap-6 md:grid-cols-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand">
              Description
            </p>
            <p className="mt-3 text-sm leading-7 text-muted">{product.description}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand">
              Delivery information
            </p>
            <p className="mt-3 text-sm leading-7 text-muted">{product.deliveryInformation}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand">
              Return & exchange
            </p>
            <p className="mt-3 text-sm leading-7 text-muted">{product.returnPolicy}</p>
          </div>
        </div>
      </section>
      {relatedProducts.length > 0 ? (
        <section className="mt-12">
          <SectionHeading
            description="Explore similar styles from the same collection and related edits."
            eyebrow="You may also like"
            title="Recommended for you"
          />
          <div className="mt-8">
            <ProductGrid
              isAuthenticated={Boolean(user)}
              path={`/shop/${product.slug}`}
              products={relatedProducts}
              wishlistIds={wishlistIds}
            />
          </div>
        </section>
      ) : null}
    </div>
  );
}
