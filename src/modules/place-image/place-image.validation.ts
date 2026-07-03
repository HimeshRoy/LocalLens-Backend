import { z } from "zod";

export const updatePlaceImageSchema = z.object({
  body: z.object({
    caption: z
      .string()
      .max(200)
      .optional(),
  }),
});