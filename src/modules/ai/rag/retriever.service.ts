import { prisma } from "../../../config/prisma.js";
import { ParsedQuery } from "./prompt.service.js";

export interface RetrieveOptions {
  parsedQuery: ParsedQuery;
  limit?: number;
}

export class RetrieverService {
  static async retrieve({ parsedQuery, limit = 10 }: RetrieveOptions) {
    const where: any = {
      isActive: true,
    };

    if (parsedQuery.category) {
      where.category = {
        name: {
          equals: parsedQuery.category,
          mode: "insensitive",
        },
      };
    }

    if (parsedQuery.city) {
      where.city = {
        equals: parsedQuery.city,
        mode: "insensitive",
      };
    }

    if (parsedQuery.maxPrice) {
      where.priceRange = parsedQuery.maxPrice;
    }

    if (!parsedQuery.category && !parsedQuery.city) {
      where.OR = [
        {
          name: {
            contains: parsedQuery.originalQuery,
            mode: "insensitive",
          },
        },
        {
          description: {
            contains: parsedQuery.originalQuery,
            mode: "insensitive",
          },
        },
      ];
    }

    const places = await prisma.place.findMany({
      where,

      include: {
        category: true,

        tags: {
          include: {
            tag: true,
          },
        },
      },

      take: limit,
    });

    let filteredPlaces = places;

    if (parsedQuery.features.length) {
      filteredPlaces = places.filter((place) =>
        parsedQuery.features.every((feature) =>
          place.tags.some(
            (tag) => tag.tag.name.toLowerCase() === feature.toLowerCase(),
          ),
        ),
      );
    }

    return filteredPlaces;
  }

  static async getCities(): Promise<string[]> {
    const cities = await prisma.place.findMany({
      where: {
        isActive: true,
      },

      select: {
        city: true,
      },

      distinct: ["city"],
    });

    return cities.map((item) => item.city);
  }
}
