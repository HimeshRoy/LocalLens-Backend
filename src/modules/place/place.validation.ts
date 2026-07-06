import { PriceRange } from "@prisma/client";
import { z } from "zod";

export const createPlaceSchema = z.object({
  body: z.object({
    name: z
      .string()
      .trim()
      .min(2, "Place name must be at least 2 characters")
      .max(100, "Place name cannot exceed 100 characters"),

    description: z.string().optional(),

    address: z.string().min(5, "Address is required"),

    city: z.string().min(2, "City is required"),

    state: z.string().min(2, "State is required"),

    country: z.string().min(2, "Country is required"),

    latitude: z.number(),

    longitude: z.number(),

    phone: z.string().optional(),

    website: z.string().url("Invalid website URL").optional(),

    openingHours: z.string().optional(),

    priceRange: z.nativeEnum(PriceRange).optional(),

    coverImage: z.string().optional(),

    categoryId: z.string().cuid("Invalid category ID"),
  }),
});

export const updatePlaceSchema = createPlaceSchema.partial();

export const nearbyPlacesSchema = z.object({
  query: z.object({
    latitude: z.coerce.number({
      message: "Latitude must be a number",
    }),

    longitude: z.coerce.number({
      message: "Longitude must be a number",
    }),

    radius: z.coerce
      .number({
        message: "Radius must be a number",
      })
      .min(1, "Radius must be at least 1 km")
      .max(100, "Radius cannot exceed 100 km")
      .default(5),
  }),
});

export const getPlacesSchema = z.object({
  query: z.object({
  page: z.coerce.number().min(1).optional(),

  limit: z.coerce.number().min(1).max(100).optional(),

  city: z.string().optional(),

  categoryId: z.string().cuid().optional(),

  search: z.string().optional(),

  sort: z.enum(["latest", "oldest"]).optional(),

  priceRange: z.nativeEnum(PriceRange).optional(),
  })
});
