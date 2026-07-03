import { z } from "zod";

export const updateProfileSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name cannot exceed 100 characters")
    .optional(),

  username: z
    .string()
    .trim()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username cannot exceed 30 characters")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers and underscores"
    )
    .optional(),

  bio: z
    .string()
    .trim()
    .max(250, "Bio cannot exceed 250 characters")
    .optional(),

  city: z
    .string()
    .trim()
    .max(100, "City cannot exceed 100 characters")
    .optional(),

  country: z
    .string()
    .trim()
    .max(100, "Country cannot exceed 100 characters")
    .optional(),
});