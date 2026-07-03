import { prisma } from "../../config/prisma.js";

export const trackActivity = async (
  userId: string,
  activityType: string,
  placeId?: string,
  metadata?: any
) => {
  return prisma.userActivity.create({
    data: {
      userId,
      activityType: activityType as any,
      placeId,
      metadata,
    },
  });
};