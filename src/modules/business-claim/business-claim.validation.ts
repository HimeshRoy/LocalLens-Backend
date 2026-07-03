import { z } from "zod";

export const createBusinessClaimSchema = z.object({
  placeId: z.string().cuid("Invalid place ID"),

  message: z
    .string()
    .trim()
    .max(1000, "Message cannot exceed 1000 characters")
    .optional(),
});