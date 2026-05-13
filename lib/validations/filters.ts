import { z } from "zod";

export const catalogSearchParamsSchema = z.object({
  availability: z.enum(["all", "in_stock", "out_of_stock"]).default("all"),
  maxPrice: z
    .union([z.coerce.number().nonnegative(), z.nan()])
    .transform((value) => (Number.isNaN(value) ? null : value))
    .nullable()
    .optional(),
  minPrice: z
    .union([z.coerce.number().nonnegative(), z.nan()])
    .transform((value) => (Number.isNaN(value) ? null : value))
    .nullable()
    .optional(),
  q: z.string().trim().optional().default(""),
  size: z.string().trim().optional().default(""),
  sort: z
    .enum(["newest", "price-asc", "price-desc", "popularity"])
    .default("newest"),
});
