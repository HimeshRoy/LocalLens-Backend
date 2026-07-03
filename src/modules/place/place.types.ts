import { PriceRange } from "@prisma/client";

export interface CreatePlaceInput {
  name: string;
  description?: string;

  address: string;
  city: string;
  state: string;
  country: string;

  latitude: number;
  longitude: number;

  phone?: string;
  website?: string;

  openingHours?: string;

  priceRange?: PriceRange;

  coverImage?: string;

  categoryId: string;
}

export interface GetPlacesQuery {
  search?: string;
  city?: string;
  categoryId?: string;

  page?: number;
  limit?: number;
  priceRange?: PriceRange;

  sort?: "newest" | "oldest";
}

export interface UpdatePlaceInput {
  name?: string;
  description?: string;

  address?: string;
  city?: string;
  state?: string;
  country?: string;

  latitude?: number;
  longitude?: number;

  phone?: string;
  website?: string;

  openingHours?: string;

  priceRange?: PriceRange;

  coverImage?: string;

  categoryId?: string;
}

export interface NearbyPlacesQuery {
  latitude: number;
  longitude: number;
  radius: number;
}