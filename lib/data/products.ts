import "server-only";

import { cache } from "react";

import type { Database } from "@/lib/supabase/database.types";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import {
  isSupabaseAdminConfigured,
  isSupabaseConfigured,
} from "@/lib/utils/env";
import { resolveImageUrl } from "@/lib/utils/storage";
import { catalogSearchParamsSchema } from "@/lib/validations/filters";

import type {
  BagItemSnapshot,
  CatalogFilters,
  CategoryRecord,
  CouponRecord,
  ProductRecord,
  ProductRowWithRelations,
  StorefrontHomeData,
} from "@/lib/data/types";

const productSelect = `
  *,
  categories (*),
  product_images (*),
  product_sizes (*),
  product_tags (*)
`;

function mapProduct(row: ProductRowWithRelations): ProductRecord {
  const images = [...row.product_images]
    .sort((left, right) => {
      if (left.is_primary === right.is_primary) {
        return left.display_order - right.display_order;
      }

      return left.is_primary ? -1 : 1;
    })
    .map((image) => ({
      id: image.id,
      imageUrl: resolveImageUrl(image.image_url),
      altText: image.alt_text,
      displayOrder: image.display_order,
      isPrimary: image.is_primary,
    }));

  const sizes = [...row.product_sizes]
    .sort((left, right) => left.size.localeCompare(right.size))
    .map((size) => ({
      id: size.id,
      size: size.size,
      quantity: size.quantity,
      inStock: size.quantity > 0,
    }));

  return {
    id: row.id,
    categoryId: row.category_id,
    category: row.categories,
    name: row.name,
    slug: row.slug,
    description: row.description,
    price: row.price,
    discountedPrice: row.discounted_price,
    effectivePrice: row.discounted_price ?? row.price,
    stock: row.stock,
    fabric: row.fabric,
    color: row.color,
    sku: row.sku,
    featured: row.featured,
    isActive: row.is_active,
    availabilityStatus: row.availability_status,
    popularityScore: row.popularity_score,
    deliveryInformation: row.delivery_information,
    returnPolicy: row.return_policy,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    images,
    sizes,
    tags: row.product_tags.map((tag) => tag.tag),
  };
}

export const getCategories = cache(async (): Promise<CategoryRecord[]> => {
  if (!isSupabaseConfigured()) {
    return [];
  }

  const supabase = await createServerSupabaseClient();
  const { data } = await supabase
    .from("categories")
    .select("*")
    .order("name", { ascending: true });

  return data ?? [];
});

export const getPublishedProducts = cache(async (): Promise<ProductRecord[]> => {
  if (!isSupabaseConfigured()) {
    return [];
  }

  const supabase = await createServerSupabaseClient();
  const { data } = await supabase
    .from("products")
    .select(productSelect)
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  return ((data as ProductRowWithRelations[] | null) ?? []).map(mapProduct);
});

export async function getCatalogProducts(searchParams: Record<string, string | string[] | undefined>) {
  const filters = catalogSearchParamsSchema.parse({
    availability:
      typeof searchParams.availability === "string"
        ? searchParams.availability
        : undefined,
    maxPrice: typeof searchParams.maxPrice === "string" ? searchParams.maxPrice : undefined,
    minPrice: typeof searchParams.minPrice === "string" ? searchParams.minPrice : undefined,
    q: typeof searchParams.q === "string" ? searchParams.q : "",
    size: typeof searchParams.size === "string" ? searchParams.size : "",
    sort: typeof searchParams.sort === "string" ? searchParams.sort : undefined,
  }) as CatalogFilters;

  const products = await getPublishedProducts();

  const normalizedQuery = filters.q.toLowerCase().trim();

  const filtered = products
    .filter((product) => {
      if (filters.availability === "in_stock" && product.stock <= 0) {
        return false;
      }

      if (filters.availability === "out_of_stock" && product.stock > 0) {
        return false;
      }

      if (filters.size) {
        const matchingSize = product.sizes.find(
          (size) =>
            size.size.toLowerCase() === filters.size.toLowerCase() && size.quantity > 0,
        );

        if (!matchingSize) {
          return false;
        }
      }

      if (filters.minPrice !== null && product.effectivePrice < filters.minPrice) {
        return false;
      }

      if (filters.maxPrice !== null && product.effectivePrice > filters.maxPrice) {
        return false;
      }

      if (!normalizedQuery) {
        return true;
      }

      const haystack = [
        product.name,
        product.description,
        product.fabric,
        product.color,
        product.sku,
        ...(product.tags ?? []),
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(normalizedQuery);
    })
    .sort((left, right) => {
      switch (filters.sort) {
        case "price-asc":
          return left.effectivePrice - right.effectivePrice;
        case "price-desc":
          return right.effectivePrice - left.effectivePrice;
        case "popularity":
          return right.popularityScore - left.popularityScore;
        case "newest":
        default:
          return new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime();
      }
    });

  return {
    filters,
    products: filtered,
    total: filtered.length,
  };
}

export async function getHomePageData(): Promise<StorefrontHomeData> {
  const products = await getPublishedProducts();

  const featuredProducts = products.filter((product) => product.featured).slice(0, 4);
  const bestSellers = [...products]
    .sort((left, right) => right.popularityScore - left.popularityScore)
    .slice(0, 4);
  const newArrivals = [...products]
    .sort((left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime())
    .slice(0, 8);

  return {
    featuredProducts,
    bestSellers,
    newArrivals,
  };
}

export async function getProductBySlug(slug: string) {
  const products = await getPublishedProducts();
  return products.find((product) => product.slug === slug) ?? null;
}

export async function getProductById(productId: string) {
  const products = await getPublishedProducts();
  return products.find((product) => product.id === productId) ?? null;
}

export async function getProductsByIds(productIds: string[]) {
  if (productIds.length === 0) {
    return [];
  }

  const allProducts = await getPublishedProducts();
  const productMap = new Map(allProducts.map((product) => [product.id, product]));

  return productIds
    .map((productId) => productMap.get(productId))
    .filter((product): product is ProductRecord => Boolean(product));
}

export async function getRelatedProducts(product: ProductRecord) {
  const products = await getPublishedProducts();

  return products
    .filter((candidate) => candidate.id !== product.id)
    .map((candidate) => {
      let score = 0;

      score += candidate.tags.filter((tag) => product.tags.includes(tag)).length * 3;

      if (candidate.fabric === product.fabric) {
        score += 2;
      }

      if (candidate.color === product.color) {
        score += 1;
      }

      score += candidate.popularityScore / 100;

      return { candidate, score };
    })
    .sort((left, right) => right.score - left.score)
    .map(({ candidate }) => candidate)
    .slice(0, 4);
}

export async function getCouponByCode(code: string): Promise<CouponRecord | null> {
  if (!code || !isSupabaseAdminConfigured()) {
    return null;
  }

  const supabase = createAdminSupabaseClient();
  const normalizedCode = code.trim().toUpperCase();
  const { data } = await supabase
    .from("coupons")
    .select("*")
    .eq("code", normalizedCode)
    .eq("is_active", true)
    .maybeSingle();

  if (!data) {
    return null;
  }

  const now = new Date();
  const startsAt = data.starts_at ? new Date(data.starts_at) : null;
  const endsAt = data.ends_at ? new Date(data.ends_at) : null;

  if (startsAt && startsAt > now) {
    return null;
  }

  if (endsAt && endsAt < now) {
    return null;
  }

  if (data.usage_limit !== null && data.usage_count >= data.usage_limit) {
    return null;
  }

  return data;
}

export async function getWishlistProducts(userId: string) {
  if (!isSupabaseConfigured()) {
    return [];
  }

  const supabase = await createServerSupabaseClient();
  const { data } = await supabase
    .from("wishlist_items")
    .select("product_id")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  const productIds = (data ?? []).map((entry) => entry.product_id);
  return getProductsByIds(productIds);
}

export async function getWishlistProductIds(userId: string) {
  if (!isSupabaseConfigured()) {
    return [];
  }

  const supabase = await createServerSupabaseClient();
  const { data } = await supabase
    .from("wishlist_items")
    .select("product_id")
    .eq("user_id", userId);

  return (data ?? []).map((entry) => entry.product_id);
}

export async function getRecentlyViewedProducts(userId: string) {
  if (!isSupabaseConfigured()) {
    return [];
  }

  const supabase = await createServerSupabaseClient();
  const { data } = await supabase
    .from("recently_viewed_products")
    .select("product_id")
    .eq("user_id", userId)
    .order("viewed_at", { ascending: false })
    .limit(6);

  const productIds = (data ?? []).map((entry) => entry.product_id);
  return getProductsByIds(productIds);
}

export async function getPersistedCartItems(userId: string): Promise<BagItemSnapshot[]> {
  if (!isSupabaseConfigured()) {
    return [];
  }

  const supabase = await createServerSupabaseClient();
  const { data } = await supabase
    .from("cart_items")
    .select("product_id, quantity, selected_size")
    .eq("user_id", userId);

  const products = await getProductsByIds((data ?? []).map((item) => item.product_id));
  const productMap = new Map(products.map((product) => [product.id, product]));

  return (data ?? [])
    .map((item) => {
      const product = productMap.get(item.product_id);

      if (!product) {
        return null;
      }

      return {
        productId: product.id,
        slug: product.slug,
        name: product.name,
        imageUrl: product.images[0]?.imageUrl ?? "/catalog/noor-teal-main.svg",
        unitPrice: product.effectivePrice,
        originalPrice: product.discountedPrice ? product.price : null,
        selectedSize: item.selected_size,
        quantity: item.quantity,
        color: product.color,
        fabric: product.fabric,
        sku: product.sku,
      };
    })
    .filter((item): item is BagItemSnapshot => Boolean(item));
}

export async function getAdminCategories() {
  if (!isSupabaseAdminConfigured()) {
    return [];
  }

  const supabase = createAdminSupabaseClient();
  const { data } = await supabase
    .from("categories")
    .select("*")
    .order("name", { ascending: true });

  return data ?? [];
}

export async function getAdminProducts(search = "") {
  if (!isSupabaseAdminConfigured()) {
    return [];
  }

  const supabase = createAdminSupabaseClient();
  const { data } = await supabase
    .from("products")
    .select(productSelect)
    .order("created_at", { ascending: false });

  const products = ((data as ProductRowWithRelations[] | null) ?? []).map(mapProduct);
  const normalizedSearch = search.trim().toLowerCase();

  if (!normalizedSearch) {
    return products;
  }

  return products.filter((product) =>
    [product.name, product.sku, product.color, product.fabric, product.slug]
      .join(" ")
      .toLowerCase()
      .includes(normalizedSearch),
  );
}

export async function getAdminProductById(productId: string) {
  const products = await getAdminProducts();
  return products.find((product) => product.id === productId) ?? null;
}

export type OrderStatus = Database["public"]["Enums"]["order_status"];
