import { z } from "zod";

export const createCategorySchema = z.object({
  name: z
    .string()
    .min(3, "Category name must be at least 3 characters")
    .max(50),

  description: z.string().max(200).optional(),

  icon: z.string().optional(),
});

export const updateCategorySchema = createCategorySchema.partial();
