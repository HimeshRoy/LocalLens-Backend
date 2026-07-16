import { prisma } from "../../config/prisma.js";

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

export const getUsers = async () => {
  const [
    users,
    total,
    verified,
    admins,
    suspended,
  ] = await Promise.all([
    prisma.user.findMany({
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

    prisma.user.count(),

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