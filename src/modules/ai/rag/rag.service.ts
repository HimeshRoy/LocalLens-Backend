import { PromptService } from "./prompt.service.js";
import { RetrieverService } from "./retriever.service.js";
import { GeminiService } from "./gemini.service.js";
import { ConversationService } from "../conversation.service.js";
import { MessageService } from "../message.service.js";
import { MessageRole } from "@prisma/client";
import { PlaceDto } from "../../place/place.dto.js";

export class RagService {
  private static buildContext(places: any[]) {
    if (!places.length) {
      return "No matching places found.";
    }

    return places
      .map((place, index) => {
        return `
Place ${index + 1}

Name: ${place.name}
Category: ${place.category.name}
Description: ${place.description}
Address: ${place.address}
City: ${place.city}
State: ${place.state}
Country: ${place.country}

Price Range: ${place.priceRange}

Rating: ${
          place.averageRating > 0
            ? `${place.averageRating} (${place.totalReviews} reviews)`
            : "No ratings yet"
        }

Tags: ${
          place.tags.length
            ? place.tags.map((t: any) => t.tag.name).join(", ")
            : "No tags available"
        }

Website: ${place.website || "Not available"}

Opening Hours: ${place.openingHours || "Not available"}
`;
      })
      .join("\n---------------------------------\n");
  }

  static async retrieveContext(query: string) {
    const parsedQuery = await PromptService.parseQuery(query);

    const places = await RetrieverService.retrieve({
      parsedQuery,
      limit: 10,
    });

    const context = this.buildContext(places);

    return {
      parsedQuery,
      places,
      context,
    };
  }

  static async chat(userId: string, question: string, conversationId?: string) {
    let conversation;

    if (conversationId) {
      conversation = await ConversationService.getConversation(conversationId);

      if (!conversation) {
        throw new Error("Conversation not found.");
      }
    } else {
      conversation = await ConversationService.createConversation(
        userId,
        question.length > 50 ? question.substring(0, 50) + "..." : question,
      );
    }

    await MessageService.saveMessage({
      conversationId: conversation.id,

      role: MessageRole.USER,

      content: question,
    });
    const previousMessages = await MessageService.getMessages(conversation.id);

    const { parsedQuery, places, context } =
      await this.retrieveContext(question);

    const conversationHistory = previousMessages
      .map((message) => {
        const role = message.role === MessageRole.USER ? "User" : "Assistant";

        return `${role}: ${message.content}`;
      })
      .join("\n\n");

    const fullContext = `
Conversation History:

${conversationHistory}

---------------------------------------

Knowledge Base:

${context}
`;

    const geminiResponse = await GeminiService.generate(question, fullContext);

    await MessageService.saveMessage({
      conversationId: conversation.id,

      role: MessageRole.ASSISTANT,

      content: geminiResponse.answer,

      inputTokens: geminiResponse.usage.inputTokens,

      outputTokens: geminiResponse.usage.outputTokens,

      totalTokens: geminiResponse.usage.totalTokens,
    });

    return {
      conversationId: conversation.id,

      question,

      parsedQuery,

      places: PlaceDto.toResponseArray(places),

      answer: geminiResponse.answer,

      usage: geminiResponse.usage,
    };
  }
}
