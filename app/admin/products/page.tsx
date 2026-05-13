import Link from "next/link";

import { DeleteProductButton } from "@/components/admin/delete-product-button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { SectionHeading } from "@/components/ui/section-heading";
import { getAdminProducts } from "@/lib/data/products";
import { formatCurrency } from "@/lib/utils/currency";

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolvedSearchParams = await searchParams;
  const search =
    typeof resolvedSearchParams.q === "string" ? resolvedSearchParams.q : "";
  const products = await getAdminProducts(search);

  return (
    <>
      <SectionHeading
        actionHref="/admin/products/new"
        actionLabel="Add product"
        description="Create, edit, and remove products from the storefront."
        eyebrow="Catalog"
        title="Manage products"
      />
      <Card>
        <form>
          <Input defaultValue={search} name="q" placeholder="Search by product name or SKU" type="search" />
        </form>
      </Card>
      <div className="grid gap-4">
        {products.map((product) => (
          <Card key={product.id} className="grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg font-semibold text-foreground">{product.name}</h2>
                {product.featured ? <Badge>Featured</Badge> : null}
                {!product.isActive ? <Badge tone="danger">Hidden</Badge> : null}
              </div>
              <p className="mt-2 text-sm text-muted">
                {product.sku} • {product.category?.name || "No category"} • {product.stock} in stock
              </p>
              <p className="mt-2 text-sm font-semibold text-foreground">
                {formatCurrency(product.effectivePrice)}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href={`/admin/products/${product.id}/edit`}
                className="inline-flex rounded-full border border-line bg-white/75 px-4 py-2.5 text-sm font-semibold text-foreground hover:border-brand/30 hover:bg-brand-soft/35"
              >
                Edit
              </Link>
              <DeleteProductButton productId={product.id} />
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}
