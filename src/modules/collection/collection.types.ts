export interface CreateCollectionInput {
  name: string;
  emoji?: string;
  description?: string;
  isPrivate?: boolean;
}

export interface AddPlaceToCollectionInput {
  placeId: string;
}