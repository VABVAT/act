import { z } from "zod";

export const productSizeSchema = z.object({
  size: z.string().trim().min(1, "Size is required."),
  quantity: z.coerce.number().int().min(0, "Quantity cannot be negative."),
});

export const productImageUrlSchema = z.object({
  imageUrl: z.string().trim().min(1, "Image URL is required."),
  altText: z.string().trim().optional().nullable(),
  isPrimary: z.boolean().default(false),
});

export const productFormSchema = z.object({
  categoryId: z
    .string()
    .trim()
    .nullable()
    .optional()
    .transform((value) => {
      if (!value) {
        return null;
      }

      const parsed = z.uuid().safeParse(value);
      return parsed.success ? parsed.data : null;
    }),
  color: z.string().trim(),
  deliveryInformation: z.string().trim(),
  description: z.string().trim(),
  discountedPrice: z
    .union([z.coerce.number().min(0), z.nan()])
    .transform((value) => (Number.isNaN(value) ? null : value))
    .nullable(),
  fabric: z.string().trim(),
  featured: z.boolean().default(false),
  isActive: z.boolean().default(true),
  name: z.string().trim(),
  price: z.coerce.number().min(0, "Price cannot be negative."),
  returnPolicy: z.string().trim(),
  sizes: z.array(productSizeSchema).default([]),
  sku: z.string().trim(),
  tags: z.array(z.string().trim().min(1)).default([]),
});
