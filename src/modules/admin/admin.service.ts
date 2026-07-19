import { prisma } from "../../config/prisma.js";
import { Prisma, UserRole } from "@prisma/client";

export const getDashboard = async () => {
  const [
    users,
    businesses,
    places,
    reviews,
    favorites,
    collections,
    categories,
    tags,
    verifiedPlaces,
    pendingClaims,
    recentUsers,
    recentPlaces,
    recentReviews,
  ] = await Promise.all([
    prisma.user.count(),

    prisma.user.count({
      where: {
        role: "BUSINESS",
      },
    }),

    prisma.place.count(),

    prisma.review.count(),

    prisma.favorite.count(),

    prisma.collection.count(),

    prisma.category.count(),

    prisma.tag.count(),

    prisma.place.count({
      where: {
        isVerified: true,
      },
    }),

    prisma.businessClaim.count({
      where: {
        status: "PENDING",
      },
    }),

    prisma.user.findMany({
      take: 5,
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        fullName: true,
        username: true,
        avatar: true,
        role: true,
        createdAt: true,
      },
    }),

    prisma.place.findMany({
      take: 5,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        category: true,

        createdBy: {
          select: {
            fullName: true,
            username: true,
          },
        },
      },
    }),

    prisma.review.findMany({
      take: 5,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: {
          select: {
            fullName: true,
            username: true,
            avatar: true,
          },
        },

        place: {
          select: {
            name: true,
            slug: true,
          },
        },
      },
    }),
  ]);

  return {
    statistics: {
      users,
      businesses,
      places,
      reviews,
      favorites,
      collections,
      categories,
      tags,
      verifiedPlaces,
      pendingClaims,
    },

    recentUsers,

    recentPlaces,

    recentReviews,
  };
};

export const getUsers = async (query: any) => {
  const {
    search,
    role,
    status,
    verified: verification,
    page = 1,
    limit = 10,
  } = query;

  const where: Prisma.UserWhereInput = {};

  if (search) {
    where.OR = [
      {
        fullName: {
          contains: search,
          mode: "insensitive",
        },
      },
      {
        username: {
          contains: search,
          mode: "insensitive",
        },
      },
      {
        email: {
          contains: search,
          mode: "insensitive",
        },
      },
    ];
  }

  if (role && role !== "ALL") {
    where.role = role as UserRole;
  }

  if (status === "ACTIVE") {
    where.isActive = true;
  }

  if (status === "SUSPENDED") {
    where.isActive = false;
  }

  if (verification === "true") {
    where.isVerified = true;
  }

  if (verification === "false") {
    where.isVerified = false;
  }

  const currentPage = Number(page);
  const take = Number(limit);
  const skip = (currentPage - 1) * take;

  const [users, total, verified, admins, suspended] = await Promise.all([
    prisma.user.findMany({
      where,

      skip,
      take,

      orderBy: {
        createdAt: "desc",
      },

      select: {
        id: true,
        avatar: true,
        fullName: true,
        username: true,
        email: true,
        role: true,
        isVerified: true,
        isActive: true,
        createdAt: true,

        _count: {
          select: {
            reviews: true,
            places: true,
            collections: true,
            favorites: true,
          },
        },
      },
    }),

    prisma.user.count({
      where,
    }),

    prisma.user.count({
      where: {
        isVerified: true,
      },
    }),

    prisma.user.count({
      where: {
        role: "ADMIN",
      },
    }),

    prisma.user.count({
      where: {
        isActive: false,
      },
    }),
  ]);

  return {
    statistics: {
      total,
      verified,
      admins,
      suspended,
    },

    users,
  };
};

export const updateUserStatus = async (userId: string, isActive: boolean) => {
  return prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      isActive,
    },
    select: {
      id: true,
      fullName: true,
      username: true,
      isActive: true,
    },
  });
};

export const updateUserVerification = async (
  userId: string,
  isVerified: boolean,
) => {
  return prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      isVerified,
    },
    select: {
      id: true,
      fullName: true,
      username: true,
      isVerified: true,
    },
  });
};

export const updateUserRole = async (userId: string, role: UserRole) => {
  return prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      role,
    },
    select: {
      id: true,
      fullName: true,
      username: true,
      role: true,
    },
  });
};

export const deleteUser = async (userId: string) => {
  return prisma.user.delete({
    where: {
      id: userId,
    },
    select: {
      id: true,
      fullName: true,
      username: true,
    },
  });
};

export const getPlaces = async (query: any) => {
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.min(100, Number(query.limit) || 10);
  const skip = (page - 1) * limit;

  const where: Prisma.PlaceWhereInput = {
    ...(query.search && {
      OR: [
        {
          name: {
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
      ],
    }),

    ...(query.categoryId && {
      categoryId: query.categoryId,
    }),

    ...(query.status === "ACTIVE" && {
      isActive: true,
    }),

    ...(query.status === "INACTIVE" && {
      isActive: false,
    }),

    ...(query.status === "PENDING" && {
      isVerified: false,
      isActive: true,
    }),

    ...(query.isVerified !== undefined && {
      isVerified: query.isVerified === "true",
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

      _count: {
        select: {
          reviews: true,
          images: true,
        },
      },
    },

    orderBy: {
      createdAt: "desc",
    },
  });

  return {
    places,

    statistics: {
      total: await prisma.place.count(),

      verified: await prisma.place.count({
        where: {
          isVerified: true,
        },
      }),

      pending: await prisma.place.count({
        where: {
          isVerified: false,
          isActive: true,
        },
      }),

      inactive: await prisma.place.count({
        where: {
          isActive: false,
        },
      }),
    },

    pagination: {
      page,
      limit,
      totalItems: total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const updatePlaceVerification = async (
  placeId: string,
  isVerified: boolean,
) => {
  return prisma.place.update({
    where: {
      id: placeId,
    },
    data: {
      isVerified,
    },
    select: {
      id: true,
      name: true,
      isVerified: true,
    },
  });
};

export const updatePlaceStatus = async (
  placeId: string,
  isActive: boolean,
) => {
  return prisma.place.update({
    where: {
      id: placeId,
    },
    data: {
      isActive,
    },
    select: {
      id: true,
      name: true,
      isActive: true,
    },
  });
};

export const deletePlace = async (placeId: string) => {
  return prisma.place.delete({
    where: {
      id: placeId,
    },
    select: {
      id: true,
      name: true,
    },
  });
};