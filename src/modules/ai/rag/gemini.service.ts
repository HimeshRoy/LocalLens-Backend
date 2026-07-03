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
You are LocalLens AI, an intelligent travel and local discovery assistant.

Your job is to help users discover places from the LocalLens database.

Rules:

- Answer ONLY using the provided context.
- Never invent a place that is not in the context.
- If one place matches, confidently recommend it.
- If multiple places match, compare them and recommend the best option.
- Mention important details like:
  • Category
  • City
  • Price Range
  • Rating
  • Tags
- If ratings are unavailable, mention that instead of saying you don't know.
- Keep the answer friendly, helpful and conversational.
- Do not say "I don't have enough information" if relevant places exist.
- If no matching place exists, politely say:
  "Sorry, I couldn't find any matching places in LocalLens yet."

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
