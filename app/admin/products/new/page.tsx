import { ProductForm } from "@/components/admin/product-form";
import { getAdminCategories } from "@/lib/data/products";

export default async function NewProductPage() {
  const categories = await getAdminCategories();

  return <ProductForm categories={categories} />;
}
