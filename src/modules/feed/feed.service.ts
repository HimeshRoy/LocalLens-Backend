import { prisma } from "../../config/prisma.js";
import { FeedQuery } from "./feed.types.js";

export const getFeed = async (userId: string, query: FeedQuery) => {
  const page = Math.max(1, Number(query.page) || 1);

  const limit = Math.min(20, Number(query.limit) || 10);

  const skip = (page - 1) * limit;

  const places = await prisma.place.findMany({
    where: {
      isActive: true,
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

      favorites: {
        where: {
          userId,
        },
        select: {
          id: true,
        },
      },

      reviews: {
        where: {
          userId,
          isActive: true,
        },
        select: {
          id: true,
          rating: true,
        },
      },

      collectionPlaces: {
        where: {
          collection: {
            userId,
          },
        },
        select: {
          collectionId: true,
        },
      },
    },
  });

  return places;
};
