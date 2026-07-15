import { z } from "zod";

const categoryBodySchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Category name must be at least 3 characters")
    .max(50, "Category name cannot exceed 50 characters"),

  description: z
    .string()
    .trim()
    .max(200, "Description cannot exceed 200 characters")
    .optional(),

  icon: z
    .string()
    .trim()
    .max(10, "Icon is invalid")
    .optional(),
});

export const createCategorySchema = z.object({
  body: categoryBodySchema,
});

export const updateCategorySchema = z.object({
  body: categoryBodySchema.partial(),
});