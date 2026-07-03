import { prisma } from "../../config/prisma.js";
import { CreateFavoriteInput } from "./favorite.types.js";
import type { ServiceResponse } from "../../types/service-response.js";
import { InterestEngine } from "../ai/interest.engine.js";

export const createFavorite = async (
  userId: string,
  payload: CreateFavoriteInput,
): Promise<ServiceResponse<any>> => {
  const place = await prisma.place.findFirst({
    where: {
      id: payload.placeId,
      isActive: true,
    },
  });

  if (!place) {
    return {
      success: false,
      message: "Place not found",
      data: null,
    };
  }

  const existingFavorite = await prisma.favorite.findUnique({
    where: {
      userId_placeId: {
        userId,
        placeId: payload.placeId,
      },
    },
  });

  if (existingFavorite) {
    return {
      success: false,
      message: "Place already added to favorites",
      data: null,
    };
  }

  const favorite = await prisma.favorite.create({
    data: {
      userId,
      placeId: payload.placeId,
    },

    include: {
      place: {
        include: {
          category: true,
        },
      },
    },
  });

  try {
    await InterestEngine.learn({
      userId,
      placeId: payload.placeId,
      activityType: "FAVORITE",
    });
  } catch (error) {
    console.error("AI learning failed:", error);
  }

  return {
    success: true,
    message: "Place added to favorites",
    data: favorite,
  };
};

export const getMyFavorites = async (
  userId: string,
): Promise<ServiceResponse<any>> => {
  const favorites = await prisma.favorite.findMany({
    where: {
      userId,
    },

    include: {
      place: {
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
      },
    },

    orderBy: {
      createdAt: "desc",
    },
  });

  return {
    success: true,
    message: "Favorites fetched successfully",
    data: favorites,
  };
};

export const removeFavorite = async (
  userId: string,
  placeId: string,
): Promise<ServiceResponse<any>> => {
  const favorite = await prisma.favorite.findUnique({
    where: {
      userId_placeId: {
        userId,
        placeId,
      },
    },
  });

  if (!favorite) {
    return {
      success: false,
      message: "Favorite not found",
      data: null,
    };
  }

  await prisma.favorite.delete({
    where: {
      id: favorite.id,
    },
  });

  return {
    success: true,
    message: "Place removed from favorites",
    data: null,
  };
};
