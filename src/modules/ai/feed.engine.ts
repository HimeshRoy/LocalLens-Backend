import { InterestType } from "@prisma/client";
import { prisma } from "../../config/prisma.js";

export class FeedEngine {
  static async generateFeed(
    userId: string,
    page: number = 1,
    limit: number = 20,
  ) {
    const safePage = Math.max(1, page);
    const safeLimit = Math.min(50, Math.max(1, limit));

    const skip = (safePage - 1) * safeLimit;

    const interests = await prisma.userInterest.findMany({
      where: {
        userId,
      },
    });

    if (interests.length === 0) {
      const trendingPlaces = await prisma.place.findMany({
        where: {
          isActive: true,
        },

        include: {
          category: true,

          tags: {
            include: {
              tag: true,
            },
          },
        },

        orderBy: [
          {
            averageRating: "desc",
          },
          {
            totalReviews: "desc",
          },
          {
            createdAt: "desc",
          },
        ],

        skip,
        take: safeLimit,
      });

      return trendingPlaces;
    }

    const interestMap = new Map<string, number>();

    for (const interest of interests) {
      interestMap.set(`${interest.type}:${interest.value}`, interest.score);
    }

    const places = await prisma.place.findMany({
      where: {
        isActive: true,
      },

      include: {
        category: true,

        tags: {
          include: {
            tag: true,
          },
        },
      },
    });
    const scoredPlaces = places.map((place) => {
      let score = 0;
      const categoryScore =
        interestMap.get(`CATEGORY:${place.category.name}`) ?? 0;

      score += categoryScore;

      const cityScore = interestMap.get(`CITY:${place.city}`) ?? 0;

      score += cityScore;

      if (place.priceRange) {
        const priceScore =
          interestMap.get(`PRICE_RANGE:${place.priceRange}`) ?? 0;

        score += priceScore;
      }

      for (const placeTag of place.tags) {
        const tagScore = interestMap.get(`TAG:${placeTag.tag.name}`) ?? 0;

        score += tagScore;
      }

      score += place.averageRating * 10;
      score += Math.min(place.totalReviews, 100);
      return {
        place,
        score,
      };
    });

    scoredPlaces.sort((a, b) => b.score - a.score);

    return scoredPlaces.slice(skip, skip + safeLimit).map((item) => item.place);
  }
}
