import { notFound } from "next/navigation";

import { ProductForm } from "@/components/admin/product-form";
import { getAdminCategories, getAdminProductById } from "@/lib/data/products";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [categories, product] = await Promise.all([
    getAdminCategories(),
    getAdminProductById(id),
  ]);

  if (!product) {
    notFound();
  }

  return <ProductForm categories={categories} product={product} />;
}
