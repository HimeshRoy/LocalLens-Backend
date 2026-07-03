export interface RecommendationRequest {
  userId: string;
}

export interface RecommendationResult {
  placeId: string;
  score: number;
  reasons: string[];
}