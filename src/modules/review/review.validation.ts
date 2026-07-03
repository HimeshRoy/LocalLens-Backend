import { z } from "zod";

export const createReviewSchema = z.object({
  body: z.object({
    placeId: z.string().min(1, "Place ID is required"),

    rating: z
      .number()
      .int()
      .min(1, "Rating must be at least 1")
      .max(5, "Rating cannot exceed 5"),

    comment: z.string().max(1000).optional(),
  }),
});

export const updateReviewSchema = z.object({
  body: z.object({
    rating: z.number().int().min(1).max(5).optional(),

    comment: z.string().max(1000).optional(),
  }),
});
