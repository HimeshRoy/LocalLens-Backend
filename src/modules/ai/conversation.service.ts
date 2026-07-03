import { prisma } from "../../config/prisma.js";

export class ConversationService {
  static async createConversation(userId: string, title?: string) {
    return prisma.aiConversation.create({
      data: {
        userId,
        title,
      },
    });
  }

  static async getConversation(id: string) {
    return prisma.aiConversation.findUnique({
      where: {
        id,
      },

      include: {
        messages: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });
  }

  static async getUserConversations(userId: string) {
    return prisma.aiConversation.findMany({
      where: {
        userId,
      },

      orderBy: {
        updatedAt: "desc",
      },

      include: {
        messages: {
          orderBy: {
            createdAt: "asc",
          },

          take: 1,
        },
      },
    });
  }
}
