import { prisma } from "../../config/prisma.js";
import type { ServiceResponse } from "../../types/service-response.js";
import { InterestEngine } from "../ai/interest.engine.js";
import type {
  CreateCollectionInput,
  AddPlaceToCollectionInput,
} from "./collection.types.js";

export const createCollection = async (
  userId: string,
  payload: CreateCollectionInput,
): Promise<ServiceResponse<any>> => {
  const existingCollection = await prisma.collection.findFirst({
    where: {
      userId,
      name: payload.name,
    },
  });

  if (existingCollection) {
    return {
      success: false,
      message: "You already have a collection with this name",
      data: null,
    };
  }

  const collection = await prisma.collection.create({
    data: {
      userId,
      name: payload.name,
      emoji: payload.emoji,
      description: payload.description,
      isPrivate: payload.isPrivate ?? false,
    },
  });

  return {
    success: true,
    message: "Collection created successfully",
    data: collection,
  };
};

export const getMyCollections = async (
  userId: string,
): Promise<ServiceResponse<any>> => {
  const collections = await prisma.collection.findMany({
    where: {
      userId,
    },

    include: {
      places: {
        take: 1,

        include: {
          place: {
            select: {
              coverImage: true,
            },
          },
        },
      },

      _count: {
        select: {
          places: true,
        },
      },
    },

    orderBy: {
      updatedAt: "desc",
    },
  });

  const formattedCollections = collections.map((collection) => ({
    id: collection.id,
    name: collection.name,
    emoji: collection.emoji,
    description: collection.description,
    isPrivate: collection.isPrivate,

    placesCount: collection._count.places,

    coverImage: collection.places[0]?.place.coverImage ?? null,

    createdAt: collection.createdAt,
    updatedAt: collection.updatedAt,
  }));

  return {
    success: true,
    message: "Collections fetched successfully",
    data: formattedCollections,
  };
};

export const addPlaceToCollection = async (
  userId: string,
  collectionId: string,
  payload: AddPlaceToCollectionInput,
): Promise<ServiceResponse<any>> => {
  const collection = await prisma.collection.findFirst({
    where: {
      id: collectionId,
      userId,
    },
  });

  if (!collection) {
    return {
      success: false,
      message: "Collection not found",
      data: null,
    };
  }

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

  const existingPlace = await prisma.collectionPlace.findUnique({
    where: {
      collectionId_placeId: {
        collectionId,
        placeId: payload.placeId,
      },
    },
  });

  if (existingPlace) {
    return {
      success: false,
      message: "Place already exists in this collection",
      data: null,
    };
  }

  const savedPlace = await prisma.collectionPlace.create({
    data: {
      collectionId,
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

  await InterestEngine.learn({
    userId,
    placeId: payload.placeId,
    activityType: "COLLECTION",
  });

  return {
    success: true,
    message: "Place added to collection successfully",
    data: savedPlace,
  };
};

export const getCollectionById = async (
  userId: string,
  collectionId: string,
): Promise<ServiceResponse<any>> => {
  const collection = await prisma.collection.findFirst({
    where: {
      id: collectionId,
      userId,
    },

    include: {
      places: {
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
      },
    },
  });

  if (!collection) {
    return {
      success: false,
      message: "Collection not found",
      data: null,
    };
  }

  return {
    success: true,
    message: "Collection fetched successfully",
    data: collection,
  };
};

export const removePlaceFromCollection = async (
  userId: string,
  collectionId: string,
  placeId: string,
): Promise<ServiceResponse<any>> => {
  const collection = await prisma.collection.findFirst({
    where: {
      id: collectionId,
      userId,
    },
  });

  if (!collection) {
    return {
      success: false,
      message: "Collection not found",
      data: null,
    };
  }

  const collectionPlace = await prisma.collectionPlace.findUnique({
    where: {
      collectionId_placeId: {
        collectionId,
        placeId,
      },
    },
  });

  if (!collectionPlace) {
    return {
      success: false,
      message: "Place not found in this collection",
      data: null,
    };
  }

  await prisma.collectionPlace.delete({
    where: {
      id: collectionPlace.id,
    },
  });

  return {
    success: true,
    message: "Place removed from collection successfully",
    data: null,
  };
};

export const updateCollection = async (
  userId: string,
  collectionId: string,
  payload: Partial<CreateCollectionInput>,
): Promise<ServiceResponse<any>> => {
  const collection = await prisma.collection.findFirst({
    where: {
      id: collectionId,
      userId,
    },
  });

  if (!collection) {
    return {
      success: false,
      message: "Collection not found",
      data: null,
    };
  }

  if (payload.name) {
    const existingCollection = await prisma.collection.findFirst({
      where: {
        userId,
        name: payload.name,
        id: {
          not: collectionId,
        },
      },
    });

    if (existingCollection) {
      return {
        success: false,
        message: "You already have a collection with this name",
        data: null,
      };
    }
  }

  const updatedCollection = await prisma.collection.update({
    where: {
      id: collectionId,
    },

    data: payload,
  });

  return {
    success: true,
    message: "Collection updated successfully",
    data: updatedCollection,
  };
};

export const deleteCollection = async (
  userId: string,
  collectionId: string,
): Promise<ServiceResponse<any>> => {
  const collection = await prisma.collection.findFirst({
    where: {
      id: collectionId,
      userId,
    },
  });

  if (!collection) {
    return {
      success: false,
      message: "Collection not found",
      data: null,
    };
  }

  await prisma.collection.delete({
    where: {
      id: collectionId,
    },
  });

  return {
    success: true,
    message: "Collection deleted successfully",
    data: null,
  };
};
