import { z } from "zod";

export const createFavoriteSchema = z.object({
  body: z.object({
    placeId: z.string().min(1, "Place ID is required"),
  }),
});