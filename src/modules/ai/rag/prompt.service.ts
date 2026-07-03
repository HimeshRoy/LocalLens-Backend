import { RetrieverService } from "./retriever.service.js";

export interface ParsedQuery {
  originalQuery: string;

  category?: string;

  city?: string;

  maxPrice?: string;

  tags: string[];

  features: string[];

  sortBy?: "rating" | "distance" | "price";
}

export class PromptService {
  static async parseQuery(query: string): Promise<ParsedQuery> {
    const lowerQuery = query.toLowerCase();

    const parsed: ParsedQuery = {
      originalQuery: query,
      tags: [],
      features: [],
    };

    const categories = [
      "restaurant",
      "cafe",
      "hotel",
      "park",
      "temple",
      "museum",
      "mall",
      "hospital",
      "school",
      "gym",
    ];

    for (const category of categories) {
      if (lowerQuery.includes(category)) {
        parsed.category = category.charAt(0).toUpperCase() + category.slice(1);

        break;
      }
    }

    const keywordMap = [
      {
        words: ["cheap", "budget", "affordable", "low cost"],
        price: "BUDGET",
      },
      {
        words: ["moderate", "mid range"],
        price: "MODERATE",
      },
      {
        words: ["premium"],
        price: "PREMIUM",
      },
      {
        words: ["luxury", "expensive"],
        price: "LUXURY",
      },
    ];

    for (const item of keywordMap) {
      if (item.words.some((word) => lowerQuery.includes(word))) {
        parsed.maxPrice = item.price;
        break;
      }
    }

    const featureKeywords = [
      "wifi",
      "parking",
      "family",
      "romantic",
      "pet friendly",
      "pet-friendly",
      "rooftop",
      "outdoor",
      "air conditioned",
      "ac",
    ];

    for (const feature of featureKeywords) {
      if (lowerQuery.includes(feature)) {
        parsed.features.push(feature);
      }
    }

    const cities = await RetrieverService.getCities();

    for (const city of cities) {
      if (lowerQuery.includes(city.toLowerCase())) {
        parsed.city = city;
        break;
      }
    }

    return parsed;
  }
}
