import type { ProductRecord } from "@/lib/data/types";

import { ProductGrid } from "@/components/product/product-grid";
import { SectionHeading } from "@/components/ui/section-heading";

export function ProductCollectionSection({
  actionHref,
  actionLabel,
  description,
  eyebrow,
  isAuthenticated,
  path,
  products,
  title,
  wishlistIds = [],
}: {
  actionHref?: string;
  actionLabel?: string;
  description?: string;
  eyebrow?: string;
  isAuthenticated: boolean;
  path: string;
  products: ProductRecord[];
  title: string;
  wishlistIds?: string[];
}) {
  return (
    <section className="content-wrap py-10 md:py-14">
      <SectionHeading
        actionHref={actionHref}
        actionLabel={actionLabel}
        description={description}
        eyebrow={eyebrow}
        title={title}
      />
      <div className="mt-8">
        <ProductGrid
          isAuthenticated={isAuthenticated}
          path={path}
          products={products}
          wishlistIds={wishlistIds}
        />
      </div>
    </section>
  );
}
