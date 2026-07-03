import { prisma } from "../../config/prisma.js";
import { MessageRole } from "@prisma/client";

interface SaveMessageInput {
  conversationId: string;
  role: MessageRole;
  content: string;

  inputTokens?: number;
  outputTokens?: number;
  totalTokens?: number;
}

export class MessageService {
  static async saveMessage(data: SaveMessageInput) {
    return prisma.aiMessage.create({
      data,
    });
  }

  static async getMessages(conversationId: string, limit = 10) {
    const messages = await prisma.aiMessage.findMany({
      where: {
        conversationId,
      },

      orderBy: {
        createdAt: "desc",
      },

      take: limit,
    });

    return messages.reverse();
  }
}
