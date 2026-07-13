import { prisma } from "../../config/prisma.js";
import { FeedQuery } from "./feed.types.js";
import { calculateDistance } from "../../utils/haversine.js";

export const getFeed = async (userId: string | undefined, query: FeedQuery) => {
  const page = Math.max(1, Number(query.page) || 1);

  const limit = Math.min(20, Number(query.limit) || 10);

  const skip = (page - 1) * limit;

  if (query.latitude === undefined || query.longitude === undefined) {
    throw new Error("Latitude and longitude are required.");
  }

  const radius = 80;

  const latDelta = radius / 111;

  const lngDelta = radius / (111 * Math.cos((query.latitude * Math.PI) / 180));

  const minLat = query.latitude - latDelta;
  const maxLat = query.latitude + latDelta;

  const minLng = query.longitude - lngDelta;
  const maxLng = query.longitude + lngDelta;

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

    skip,
    take: limit,

    orderBy: {
      createdAt: "desc",
    },

    include: {
      category: true,

      createdBy: {
        select: {
          id: true,
          fullName: true,
          username: true,
          avatar: true,
          isVerified: true,
        },
      },

      images: {
        orderBy: {
          createdAt: "asc",
        },
      },

      favorites: userId
        ? {
            where: {
              userId,
            },
            select: {
              id: true,
            },
          }
        : false,

      reviews: userId
        ? {
            where: {
              userId,
              isActive: true,
            },
            select: {
              id: true,
              rating: true,
            },
          }
        : false,

      collections: userId
        ? {
            where: {
              collection: {
                userId,
              },
            },
            select: {
              collectionId: true,
            },
          }
        : false,
    },
  });

  const nearbyFeed = places
    .map((place) => ({
      ...place,

      distance: calculateDistance(
        query.latitude,
        query.longitude,
        place.latitude,
        place.longitude,
      ),
    }))
    .filter((place) => place.distance <= radius)
    .sort((a, b) => a.distance - b.distance);

  const hasMore = nearbyFeed.length === limit;

  return {
    items: nearbyFeed,
    page,
    limit,
    hasMore,
  };
};
