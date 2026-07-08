import { GoogleGenAI } from "@google/genai";

export interface GeminiResponse {
  answer: string;

  usage: {
    inputTokens: number;
    outputTokens: number;
    totalTokens: number;
  };
}

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

export class GeminiService {
  static async generate(
    question: string,
    context: string,
  ): Promise<GeminiResponse> {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not configured.");
    }

    if (!context.trim()) {
      return {
        answer: "Sorry, I couldn't find any matching places in LocalLens yet.",
        usage: {
          inputTokens: 0,
          outputTokens: 0,
          totalTokens: 0,
        },
      };
    }

    try {
      const prompt = `
You are LocalLens AI, a friendly local guide, not a search engine.

Your goal is to help users discover places naturally, like a knowledgeable local friend.

Rules:

1. Use BOTH the conversation history and the LocalLens knowledge base.

2. If the user asks a follow-up question (for example: "Is it good?", "Does it have WiFi?", "What's the price?"), continue the conversation naturally without repeating previous recommendations.

3. Never invent places or facts that are not present in the LocalLens knowledge base.

4. If LocalLens doesn't contain information about something (parking, takeaway, WiFi, pet-friendly, etc.), simply say:
"LocalLens doesn't have that information yet."

Do NOT say:
"Sorry, I couldn't find any matching places."

5. When recommending places:
- Explain WHY you recommend them.
- Mention ratings naturally.
- Mention price only if useful.
- Avoid listing every field.

6. Speak conversationally.

Instead of:

Category:
City:
Rating:

Say something like:

"I'd recommend Domino's Pizza in Siliguri. It's a moderately priced restaurant with a current rating of 3★ from LocalLens users."

7. If multiple places match, briefly compare them before recommending one.

8. If no places match a NEW search request, politely say:

"I couldn't find any matching places in LocalLens yet. Try another location or category."

9. Never repeat the exact same information unless the user asks again.

10. Keep answers concise, helpful and human.

Context:
${context}

User Question:
${question}
`;

      const response = await ai.models.generateContent({
        model: process.env.GEMINI_MODEL ?? "gemini-2.5-flash",
        contents: prompt,
      });

      const usage = response.usageMetadata;

      return {
        answer: response.text?.trim() || "No response generated.",

        usage: {
          inputTokens: usage?.promptTokenCount ?? 0,
          outputTokens: usage?.candidatesTokenCount ?? 0,
          totalTokens: usage?.totalTokenCount ?? 0,
        },
      };
    } catch (error: any) {
      console.error("Gemini Error:", error);

      const status = error?.status;

      if (status === 429) {
        throw new Error(
          "Our AI assistant has temporarily reached its usage limit. Please try again later.",
        );
      }

      if (status === 403) {
        throw new Error(
          "The AI service is currently unavailable. Please contact support if the problem persists.",
        );
      }

      throw new Error("Failed to generate AI response.");
    }
  }
}
