import { getCurrentUser } from "@/lib/auth/session";
import {
  getHomePageData,
  getRecentlyViewedProducts,
  getWishlistProductIds,
} from "@/lib/data/products";

import { AboutPreview } from "@/components/sections/about-preview";
import { HomeHero } from "@/components/sections/home-hero";
import { ProductCollectionSection } from "@/components/sections/product-collection-section";
import { RecentlyViewedRail } from "@/components/sections/recently-viewed-rail";
import { TrustStrip } from "@/components/sections/trust-strip";

export default async function HomePage() {
  const [homeData, user] = await Promise.all([getHomePageData(), getCurrentUser()]);
  const [wishlistIds, recentlyViewed] = user
    ? await Promise.all([
        getWishlistProductIds(user.id),
        getRecentlyViewedProducts(user.id),
      ])
    : [[], []];

  return (
    <>
      <HomeHero />
      <ProductCollectionSection
        actionHref="/shop?sort=newest"
        actionLabel="View all"
        description="Fresh additions with graceful textures, occasion-ready colour, and easy silhouettes."
        eyebrow="New season"
        isAuthenticated={Boolean(user)}
        path="/"
        products={homeData.newArrivals}
        title="New arrivals"
        wishlistIds={wishlistIds}
      />
      <TrustStrip />
      <ProductCollectionSection
        actionHref="/shop?sort=popularity"
        actionLabel="Shop best sellers"
        description="The most-loved sets our customers keep coming back to."
        eyebrow="Most wanted"
        isAuthenticated={Boolean(user)}
        path="/"
        products={homeData.bestSellers}
        title="Best sellers"
        wishlistIds={wishlistIds}
      />
      <ProductCollectionSection
        actionHref="/shop"
        actionLabel="Explore collection"
        description="Signature styles handpicked for celebrations, hosting, gifting, and everyday elegance."
        eyebrow="Featured collection"
        isAuthenticated={Boolean(user)}
        path="/"
        products={homeData.featuredProducts}
        title="Editor’s picks"
        wishlistIds={wishlistIds}
      />
      <RecentlyViewedRail fallbackProducts={recentlyViewed} />
      <AboutPreview />
    </>
  );
}
