import { z } from "zod";

export const createVerificationRequestSchema = z.object({
  reason: z
    .string()
    .trim()
    .max(500, "Reason cannot exceed 500 characters")
    .optional(),

  documentUrl: z
    .string()
    .url("Invalid document URL"),

  documentPublicId: z
    .string()
    .min(1, "Document public ID is required"),

  selfieUrl: z
    .string()
    .url("Invalid selfie URL")
    .optional(),

  selfiePublicId: z
    .string()
    .optional(),
});