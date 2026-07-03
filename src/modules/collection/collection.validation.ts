import { z } from "zod";

export const createCollectionSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Collection name must be at least 2 characters")
    .max(50, "Collection name cannot exceed 50 characters"),

  emoji: z
    .string()
    .trim()
    .max(10, "Emoji is invalid")
    .optional(),

  description: z
    .string()
    .trim()
    .max(300, "Description cannot exceed 300 characters")
    .optional(),

  isPrivate: z.boolean().optional(),
});

export const addPlaceToCollectionSchema = z.object({
  placeId: z.string().cuid("Invalid place ID"),
});

export const updateCollectionSchema = createCollectionSchema.partial();