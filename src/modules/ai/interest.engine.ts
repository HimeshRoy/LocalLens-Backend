import { prisma } from "../../config/prisma.js";
import { InterestType } from "@prisma/client";
import { ACTIVITY_WEIGHTS } from "./ai.constants.js";

interface LearnInput {
  userId: string;
  placeId: string;
  activityType:
    | "VIEW"
    | "SEARCH"
    | "CLICK"
    | "FAVORITE"
    | "COLLECTION"
    | "SHARE"
    | "REVIEW_1"
    | "REVIEW_2"
    | "REVIEW_3"
    | "REVIEW_4"
    | "REVIEW_5";
}

export class InterestEngine {
  private static getWeight(
    activity:
      | "VIEW"
      | "SEARCH"
      | "CLICK"
      | "FAVORITE"
      | "COLLECTION"
      | "SHARE"
      | "REVIEW_1"
      | "REVIEW_2"
      | "REVIEW_3"
      | "REVIEW_4"
      | "REVIEW_5",
  ) {
    return ACTIVITY_WEIGHTS[activity];
  }

  static async learn({ userId, placeId, activityType }: LearnInput) {
    const place = await prisma.place.findUnique({
      where: {
        id: placeId,
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

    if (!place) {
      return;
    }

    const weight = this.getWeight(activityType);

    await this.updateInterest(userId, "CATEGORY", place.category.name, weight);
    await this.updateInterest(userId, "CITY", place.city, weight);
    if (place.priceRange) {
      await this.updateInterest(
        userId,
        "PRICE_RANGE",
        place.priceRange,
        weight,
      );
    }
    for (const placeTag of place.tags) {
      await this.updateInterest(userId, "TAG", placeTag.tag.name, weight);
    }
  }

  private static async updateInterest(
    userId: string,
    type: InterestType,
    value: string,
    weight: number,
  ) {
    await prisma.userInterest.upsert({
      where: {
        userId_type_value: {
          userId,
          type,
          value,
        },
      },

      update: {
        score: {
          increment: weight,
        },
      },

      create: {
        userId,
        type,
        value,
        score: weight,
      },
    });
  }
}
