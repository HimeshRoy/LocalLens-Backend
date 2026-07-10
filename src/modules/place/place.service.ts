import { Prisma } from "@prisma/client";
import { prisma } from "../../config/prisma.js";
import { uploadImage } from "../../services/cloudinary.service.js";
import { generateSlug, generateUniqueSlug } from "../../utils/slug.js";
import {
  type CreatePlaceInput,
  type GetPlacesQuery,
  type UpdatePlaceInput,
} from "./place.types.js";
import { NearbyPlacesQuery } from "./place.types.js";
import { calculateDistance } from "../../utils/haversine.js";
import { InterestEngine } from "../ai/interest.engine.js";

export const createPlace = async (
  userId: string,
  payload: CreatePlaceInput,
) => {
  const category = await prisma.category.findUnique({
    where: {
      id: payload.categoryId,
      isActive: true,
    },
  });

  if (!category) {
    return {
      success: false,
      message: "Category not found",
    };
  }

  const existingPlace = await prisma.place.findFirst({
    where: {
      name: payload.name,
      city: payload.city,
    },
  });

  if (existingPlace) {
    return {
      success: false,
      message: "Place already exists in this city",
    };
  }

  const slug = await generateUniqueSlug(payload.name, payload.city);

  const place = await prisma.place.create({
    data: {
      ...payload,
      slug,
      createdById: userId,
    },

    include: {
      category: true,
      createdBy: {
        select: {
          id: true,
          fullName: true,
          username: true,
        },
      },
    },
  });

  return {
    success: true,
    message: "Place created successfully",
    data: place,
  };
};

export const getPlaces = async (query: GetPlacesQuery) => {
  const page = Math.max(1, Number(query.page) || 1);

  const limit = Math.min(100, Math.max(1, Number(query.limit) || 10));
  const skip = (page - 1) * limit;

  const where: Prisma.PlaceWhereInput = {
    isActive: true,

    ...(query.city && {
      city: {
        equals: query.city,
        mode: "insensitive",
      },
    }),

    ...(query.categoryId && {
      categoryId: query.categoryId,
    }),

    ...(query.priceRange && {
      priceRange: query.priceRange,
    }),
    ...(query.search && {
      OR: [
        {
          name: {
            contains: query.search,
            mode: "insensitive",
          },
        },
        {
          description: {
            contains: query.search,
            mode: "insensitive",
          },
        },
        {
          city: {
            contains: query.search,
            mode: "insensitive",
          },
        },
        {
          state: {
            contains: query.search,
            mode: "insensitive",
          },
        },
        {
          country: {
            contains: query.search,
            mode: "insensitive",
          },
        },
        {
          category: {
            is: {
              name: {
                contains: query.search,
                mode: "insensitive",
              },
            },
          },
        },
      ],
    }),
  };

  const total = await prisma.place.count({
    where,
  });

  const places = await prisma.place.findMany({
    where,

    skip,

    take: limit,

    include: {
      category: true,
      createdBy: {
        select: {
          id: true,
          fullName: true,
          username: true,
        },
      },
    },

    orderBy: {
      createdAt: query.sort === "oldest" ? "asc" : "desc",
    },
  });

  const totalPages = Math.ceil(total / limit);

  return {
    success: true,
    message: "Places fetched successfully",
    data: places,

    pagination: {
      page,
      limit,
      totalItems: total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  };
};

export const getPlaceById = async (id: string, userId?: string) => {
  const place = await prisma.place.findFirst({
    where: {
      id,
      isActive: true,
    },

    include: {
  category: true,

  images: {
    orderBy: {
      createdAt: "asc",
    },
  },

  createdBy: {
    select: {
      id: true,
      fullName: true,
      username: true,
    },
  },
},
  });

  if (!place) {
    return {
      success: false,
      message: "Place not found",
    };
  }

  const reviewStats = await prisma.review.aggregate({
    where: {
      placeId: id,
      isActive: true,
    },

    _avg: {
      rating: true,
    },

    _count: {
      rating: true,
    },
  });

  const latestReviews = await prisma.review.findMany({
    where: {
      placeId: id,
      isActive: true,
    },

    take: 5,

    orderBy: {
      createdAt: "desc",
    },

    include: {
      user: {
        select: {
          id: true,
          fullName: true,
          username: true,
        },
      },
    },
  });

  if (userId) {
    await InterestEngine.learn({
      userId,
      placeId: id,
      activityType: "VIEW",
    });
  }

  return {
    success: true,
    message: "Place fetched successfully",
    data: {
      ...place,

      averageRating: Number((reviewStats._avg.rating ?? 0).toFixed(1)),

      totalReviews: reviewStats._count.rating,

      latestReviews,
    },
  };
};

export const updatePlace = async (
  id: string,
  userId: string,
  role: string,
  payload: UpdatePlaceInput,
) => {
  const place = await prisma.place.findUnique({
    where: {
      id,
    },
  });

  if (!place || !place.isActive) {
    return {
      success: false,
      message: "Place not found",
    };
  }

  if (place.createdById !== userId && role !== "ADMIN") {
    return {
      success: false,
      message: "You are not authorized to update this place",
    };
  }

  if (payload.categoryId) {
    const category = await prisma.category.findUnique({
      where: {
        id: payload.categoryId,
        isActive: true,
      },
    });

    if (!category) {
      return {
        success: false,
        message: "Category not found",
      };
    }
  }

  const updatedPlace = await prisma.place.update({
    where: {
      id,
    },

    data: {
      ...payload,

      slug: payload.name ? generateSlug(payload.name) : place.slug,
    },

    include: {
      category: true,

      createdBy: {
        select: {
          id: true,
          fullName: true,
          username: true,
        },
      },
    },
  });

  return {
    success: true,
    message: "Place updated successfully",
    data: updatedPlace,
  };
};

export const deletePlace = async (id: string, userId: string, role: string) => {
  const place = await prisma.place.findUnique({
    where: {
      id,
    },
  });

  if (!place || !place.isActive) {
    return {
      success: false,
      message: "Place not found",
    };
  }

  if (place.createdById !== userId && role !== "ADMIN") {
    return {
      success: false,
      message: "You are not authorized to delete this place",
    };
  }

  const deletedPlace = await prisma.place.update({
    where: {
      id,
    },
    data: {
      isActive: false,
    },
  });

  return {
    success: true,
    message: "Place deleted successfully",
    data: deletedPlace,
  };
};

export const uploadPlaceCover = async (
  id: string,
  userId: string,
  role: string,
  file: Express.Multer.File,
) => {
  const place = await prisma.place.findUnique({
    where: {
      id,
    },
  });

  if (!place || !place.isActive) {
    return {
      success: false,
      message: "Place not found",
    };
  }

  if (place.createdById !== userId && role !== "ADMIN") {
    return {
      success: false,
      message: "You are not authorized to update this place",
    };
  }

  if (!file) {
    return {
      success: false,
      message: "Image is required",
    };
  }

  const { imageUrl, publicId } = await uploadImage(file, "locallens/places");

  const updatedPlace = await prisma.place.update({
    where: {
      id,
    },

    data: {
      coverImage: imageUrl,
      coverImageId: publicId,
    },

    include: {
      category: true,

      createdBy: {
        select: {
          id: true,
          fullName: true,
          username: true,
        },
      },
    },
  });

  return {
    success: true,
    message: "Cover image uploaded successfully",
    data: updatedPlace,
  };
};

export const getNearbyPlaces = async (query: NearbyPlacesQuery) => {
  const { latitude, longitude, radius } = query;

  const latDelta = radius / 111;

  const lngDelta = radius / (111 * Math.cos((latitude * Math.PI) / 180));

  const minLat = latitude - latDelta;
  const maxLat = latitude + latDelta;

  const minLng = longitude - lngDelta;
  const maxLng = longitude + lngDelta;

  const places = await prisma.place.findMany({
    where: {
      isActive: true,

      latitude: {
        gte: minLat,
        lte: maxLat,
      },

      longitude: {
        gte: minLng,
        lte: maxLng,
      },
    },

    include: {
      category: true,

      createdBy: {
        select: {
          id: true,
          fullName: true,
          username: true,
        },
      },
    },
  });

  const nearbyPlaces = places
    .map((place) => {
      const distance = calculateDistance(
        latitude,
        longitude,
        place.latitude,
        place.longitude,
      );

      return {
        ...place,
        distance,
      };
    })
    .filter((place) => place.distance <= radius)
    .sort((a, b) => a.distance - b.distance);

  return {
    success: true,
    message: "Nearby places fetched successfully",
    data: nearbyPlaces,
  };
};

export const getPlaceBySlug = async (slug: string) => {
  return prisma.place.findUnique({
    where: {
      slug,
    },
    include: {
      createdBy: {
        select: {
          fullName: true,
          username: true,
          avatar: true,
        },
      },
      category: true,
      images: true,
    },
  });
};
