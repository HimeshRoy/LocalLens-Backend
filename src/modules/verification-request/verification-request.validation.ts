import { z } from "zod";

export const createVerificationRequestSchema = z.object({
  reason: z
    .string()
    .trim()
    .max(500, "Reason cannot exceed 500 characters")
    .optional(),
});