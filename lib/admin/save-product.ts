import "server-only";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import type { Database } from "@/lib/supabase/database.types";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import type { ActionState } from "@/lib/utils/action-state";
import { slugify } from "@/lib/utils/slug";
import { productFormSchema } from "@/lib/validations/product";

const DEFAULT_PRODUCT_NAME = "Untitled listing";
const DEFAULT_DESCRIPTION = "Product details will be updated soon.";
const DEFAULT_FABRIC = "To be updated";
const DEFAULT_COLOR = "To be updated";
const DEFAULT_DELIVERY_INFORMATION =
  "Ships within 2-4 business days across India.";
const DEFAULT_RETURN_POLICY =
  "Return or exchange accepted within 7 days for unused items.";

function getFileExtension(filename: string) {
  const parts = filename.split(".");
  return parts.length > 1 ? parts.at(-1) : "jpg";
}

function createFallbackSku() {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).slice(2, 6).toUpperCase();

  return `ART-${timestamp}-${random}`;
}

async function resolveUniqueSlug(name: string, currentProductId?: string) {
  const supabase = createAdminSupabaseClient();
  const baseSlug = slugify(name);
  let candidate = baseSlug;
  let attempt = 1;

  while (true) {
    const { data } = await supabase
      .from("products")
      .select("id")
      .eq("slug", candidate)
      .maybeSingle();

    if (!data || data.id === currentProductId) {
      return candidate;
    }

    attempt += 1;
    candidate = `${baseSlug}-${attempt}`;
  }
}

async function uploadImages(files: File[], slug: string) {
  const supabase = createAdminSupabaseClient();
  const uploaded = [];

  for (const [index, file] of files.entries()) {
    const extension = getFileExtension(file.name);
    const storagePath = `${slug}/${Date.now()}-${index}.${extension}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    const { error } = await supabase.storage.from("products").upload(storagePath, buffer, {
      cacheControl: "3600",
      contentType: file.type || "image/jpeg",
      upsert: false,
    });

    if (error) {
      throw new Error(error.message);
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("products").getPublicUrl(storagePath);

    uploaded.push({
      image_url: publicUrl,
      alt_text: file.name.replace(/\.[^/.]+$/, ""),
      display_order: index,
      is_primary: false,
    });
  }

  return uploaded;
}

function parseBooleanValue(formData: FormData, field: string) {
  const value = formData.get(field);
  return value === "on" || value === "true";
}

function parseTags(value: FormDataEntryValue | null) {
  if (typeof value !== "string") {
    return [];
  }

  return value
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function parseSizes(value: FormDataEntryValue | null) {
  if (typeof value !== "string") {
    return [];
  }

  try {
    const parsed = JSON.parse(value);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .map((entry) => ({
        size:
          typeof entry?.size === "string"
            ? entry.size.trim().toUpperCase()
            : "",
        quantity: Number.isFinite(Number(entry?.quantity))
          ? Math.max(0, Math.trunc(Number(entry.quantity)))
          : 0,
      }))
      .filter((entry) => entry.size.length > 0);
  } catch {
    return [];
  }
}

function parseOptionalNumber(
  value: FormDataEntryValue | null,
  fallbackValue: number | null = 0,
) {
  if (typeof value !== "string" || value.trim() === "") {
    return fallbackValue;
  }

  const numericValue = Number(value);

  if (!Number.isFinite(numericValue) || numericValue < 0) {
    return fallbackValue;
  }

  return numericValue;
}

function parseOptionalString(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

function parseOptionalUuid(value: FormDataEntryValue | null) {
  const normalizedValue = parseOptionalString(value);

  if (!normalizedValue) {
    return null;
  }

  return z.uuid().safeParse(normalizedValue).success ? normalizedValue : null;
}

export async function saveProductFromFormData(
  formData: FormData,
  productId?: string,
): Promise<ActionState> {
  const files = formData
    .getAll("images")
    .filter((entry): entry is File => entry instanceof File && entry.size > 0);
  const retainedImages = (() => {
    const value = formData.get("existingImages");
    if (typeof value !== "string" || !value) {
      return [];
    }

    try {
      return JSON.parse(value) as string[];
    } catch {
      return [];
    }
  })();
  const normalizedSizes = parseSizes(formData.get("sizes"));
  const parsedPrice = parseOptionalNumber(formData.get("price"), 0) ?? 0;
  let parsedDiscountedPrice = parseOptionalNumber(formData.get("discountedPrice"), null);

  if (
    parsedDiscountedPrice !== null &&
    typeof parsedDiscountedPrice === "number" &&
    parsedDiscountedPrice > parsedPrice
  ) {
    parsedDiscountedPrice = null;
  }

  const name = parseOptionalString(formData.get("name")) || DEFAULT_PRODUCT_NAME;
  const sku = parseOptionalString(formData.get("sku")) || createFallbackSku();

  const parsed = productFormSchema.safeParse({
    categoryId: parseOptionalUuid(formData.get("categoryId")),
    color: parseOptionalString(formData.get("color")) || DEFAULT_COLOR,
    deliveryInformation:
      parseOptionalString(formData.get("deliveryInformation")) ||
      DEFAULT_DELIVERY_INFORMATION,
    description:
      parseOptionalString(formData.get("description")) || DEFAULT_DESCRIPTION,
    discountedPrice: parsedDiscountedPrice ?? Number.NaN,
    fabric: parseOptionalString(formData.get("fabric")) || DEFAULT_FABRIC,
    featured: parseBooleanValue(formData, "featured"),
    isActive: parseBooleanValue(formData, "isActive"),
    name,
    price: parsedPrice,
    returnPolicy:
      parseOptionalString(formData.get("returnPolicy")) || DEFAULT_RETURN_POLICY,
    sizes: normalizedSizes,
    sku,
    tags: parseTags(formData.get("tags")),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Please fix the highlighted fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    const supabase = createAdminSupabaseClient();
    const slug = await resolveUniqueSlug(parsed.data.name, productId);
    const uploadedImages = await uploadImages(files, slug);
    const allImages = [...retainedImages, ...uploadedImages.map((image) => image.image_url)];
    const totalStock = parsed.data.sizes.reduce(
      (sum, size) => sum + size.quantity,
      0,
    );
    const availabilityStatus: Database["public"]["Enums"]["availability_status"] =
      totalStock > 0 ? "in_stock" : "out_of_stock";

    const payload = {
      availability_status: availabilityStatus,
      category_id: parsed.data.categoryId ?? null,
      color: parsed.data.color,
      delivery_information: parsed.data.deliveryInformation,
      description: parsed.data.description,
      discounted_price: parsed.data.discountedPrice,
      fabric: parsed.data.fabric,
      featured: parsed.data.featured,
      is_active: parsed.data.isActive,
      name: parsed.data.name,
      price: parsed.data.price,
      return_policy: parsed.data.returnPolicy,
      sku: parsed.data.sku,
      slug,
      stock: totalStock,
    };

    const { data: savedProduct, error: productError } = productId
      ? await supabase.from("products").update(payload).eq("id", productId).select("id").single()
      : await supabase.from("products").insert(payload).select("id").single();

    if (productError || !savedProduct) {
      return {
        status: "error",
        message: productError?.message || "Unable to save product.",
      };
    }

    await supabase.from("product_sizes").delete().eq("product_id", savedProduct.id);
    await supabase.from("product_tags").delete().eq("product_id", savedProduct.id);
    await supabase.from("product_images").delete().eq("product_id", savedProduct.id);

    const imageRows = allImages.map((imageUrl, index) => ({
      product_id: savedProduct.id,
      image_url: imageUrl,
      alt_text: `${parsed.data.name} image ${index + 1}`,
      display_order: index,
      is_primary: index === 0,
    }));

    if (imageRows.length > 0) {
      const { error: imageError } = await supabase.from("product_images").insert(imageRows);

      if (imageError) {
        return {
          status: "error",
          message: imageError.message,
        };
      }
    }

    if (parsed.data.sizes.length > 0) {
      const { error: sizeError } = await supabase.from("product_sizes").insert(
        parsed.data.sizes.map((size) => ({
          product_id: savedProduct.id,
          size: size.size,
          quantity: size.quantity,
        })),
      );

      if (sizeError) {
        return {
          status: "error",
          message: sizeError.message,
        };
      }
    }

    if (parsed.data.tags.length > 0) {
      const { error: tagError } = await supabase.from("product_tags").insert(
        parsed.data.tags.map((tag) => ({
          product_id: savedProduct.id,
          tag,
        })),
      );

      if (tagError) {
        return {
          status: "error",
          message: tagError.message,
        };
      }
    }

    revalidatePath("/admin");
    revalidatePath("/admin/products");
    revalidatePath("/shop");
    revalidatePath("/");

    return {
      status: "success",
      message: productId ? "Product updated successfully." : "Product created successfully.",
    };
  } catch (error) {
    return {
      status: "error",
      message:
        error instanceof Error ? error.message : "Something went wrong while saving the product.",
    };
  }
}
