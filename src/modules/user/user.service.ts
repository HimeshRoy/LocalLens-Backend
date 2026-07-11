import { prisma } from "../../config/prisma.js";
import type { ServiceResponse } from "../../types/service-response.js";
import type { UpdateProfileInput } from "./user.types.js";
import { uploadImage } from "../../services/cloudinary.service.js";

export const getMyProfile = async (
  userId: string,
): Promise<ServiceResponse<any>> => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
      isActive: true,
    },

    select: {
      id: true,
      fullName: true,
      username: true,
      email: true,
      avatar: true,
      bio: true,
      city: true,
      country: true,
      role: true,
      isVerified: true,
      createdAt: true,
      isPrivate: true,

      _count: {
        select: {
          reviews: true,
          favorites: true,
          collections: true,
          places: true,
          businessClaims: true,
        },
      },
    },
  });

  if (!user) {
    return {
      success: false,
      message: "User not found",
      data: null,
    };
  }

  return {
    success: true,
    message: "Profile fetched successfully",
    data: user,
  };
};

export const updateProfile = async (
  userId: string,
  payload: UpdateProfileInput,
): Promise<ServiceResponse<any>> => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
      isActive: true,
    },
  });

  if (!user) {
    return {
      success: false,
      message: "User not found",
      data: null,
    };
  }

  if (payload.username) {
    const existingUser = await prisma.user.findFirst({
      where: {
        username: payload.username,
        id: {
          not: userId,
        },
      },
    });

    if (existingUser) {
      return {
        success: false,
        message: "Username already exists",
        data: null,
      };
    }
  }

  const updatedUser = await prisma.user.update({
    where: {
      id: userId,
    },

    data: {
      ...payload,
    },

    select: {
      id: true,
      fullName: true,
      username: true,
      email: true,
      avatar: true,
      bio: true,
      city: true,
      country: true,
      role: true,
      isVerified: true,
      isPrivate: true,
      updatedAt: true,
    },
  });

  return {
    success: true,
    message: "Profile updated successfully",
    data: updatedUser,
  };
};

export const uploadAvatar = async (
  userId: string,
  file: Express.Multer.File,
): Promise<ServiceResponse<any>> => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
      isActive: true,
    },
  });

  if (!user) {
    return {
      success: false,
      message: "User not found",
      data: null,
    };
  }

  if (!file) {
    return {
      success: false,
      message: "Avatar image is required",
      data: null,
    };
  }

  if (user.avatar) {
    // #############################################
  }

  const { imageUrl, publicId } = await uploadImage(file, "locallens/users");

  const updatedUser = await prisma.user.update({
    where: {
      id: userId,
    },

    data: {
      avatar: imageUrl,
    },

    select: {
      id: true,
      fullName: true,
      username: true,
      avatar: true,
    },
  });

  return {
    success: true,
    message: "Avatar uploaded successfully",
    data: updatedUser,
  };
};

export const getPublicProfile = async (
  username: string,
): Promise<ServiceResponse<any>> => {
  const user = await prisma.user.findFirst({
    where: {
      username,
      isActive: true,
    },

    select: {
      id: true,
      fullName: true,
      username: true,
      avatar: true,
      bio: true,
      city: true,
      country: true,
      role: true,
      isVerified: true,
      createdAt: true,
      isPrivate: true,

      places: {
        where: {
          isActive: true,
        },

        take: 6,

        orderBy: {
          createdAt: "desc",
        },

        include: {
          category: true,
        },
      },

      reviews: {
        where: {
          isActive: true,
        },

        take: 6,

        orderBy: {
          createdAt: "desc",
        },

        include: {
          place: {
            select: {
              id: true,
              name: true,
              slug: true,
              coverImage: true,
            },
          },
        },
      },

      collections: {
        where: {
          isPrivate: false,
        },

        take: 6,

        orderBy: {
          updatedAt: "desc",
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
      },

      _count: {
        select: {
          reviews: true,

          collections: {
            where: {
              isPrivate: false,
            },
          },

          places: true,
        },
      },
    },
  });

  if (!user) {
    return {
      success: false,
      message: "User not found",
      data: null,
    };
  }

  if (user.isPrivate) {
    return {
      success: false,
      message: "This profile is private.",
      data: null,
    };
  }

  const formattedCollections = user.collections.map((collection) => ({
    id: collection.id,
    name: collection.name,
    emoji: collection.emoji,
    description: collection.description,
    placesCount: collection._count.places,
    coverImage: collection.places[0]?.place.coverImage ?? null,
  }));

  return {
    success: true,
    message: "Profile fetched successfully",
    data: {
      ...user,
      collections: formattedCollections,
    },
  };
};

export const getMyPlaces = async (
  userId: string,
): Promise<ServiceResponse<any>> => {
  const places = await prisma.place.findMany({
    where: {
      createdById: userId,
      isActive: true,
    },

    include: {
      category: true,
    },

    orderBy: {
      createdAt: "desc",
    },
  });

  return {
    success: true,
    message: "Places fetched successfully",
    data: places,
  };
};

export const getMyReviews = async (
  userId: string,
): Promise<ServiceResponse<any>> => {
  const reviews = await prisma.review.findMany({
    where: {
      userId,
      isActive: true,
    },

    orderBy: {
      createdAt: "desc",
    },

    include: {
      place: {
        select: {
          id: true,
          name: true,
          coverImage: true,
          city: true,
          averageRating: true,
          category: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
  });

  return {
    success: true,
    message: "Reviews fetched successfully",
    data: reviews,
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

export const getMyFavorites = async (
  userId: string,
): Promise<ServiceResponse<any>> => {
  const favorites = await prisma.favorite.findMany({
    where: {
      userId,
    },

    orderBy: {
      createdAt: "desc",
    },

    include: {
      place: {
        include: {
          category: {
            select: {
              id: true,
              name: true,
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
      },
    },
  });

  return {
    success: true,
    message: "Favorite places fetched successfully",
    data: favorites,
  };
};
