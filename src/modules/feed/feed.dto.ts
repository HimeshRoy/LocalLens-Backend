export class FeedDto {
  static toResponse(place: any) {
    return {
      id: place.id,

      slug: place.slug,

      name: place.name,

      description: place.description,

      city: place.city,

      state: place.state,

      coverImage: place.coverImage,

      averageRating: place.averageRating,

      totalReviews: place.totalReviews,

      category: {
        id: place.category.id,
        name: place.category.name,
        icon: place.category.icon,
      },

      createdBy: {
        id: place.createdBy.id,
        fullName: place.createdBy.fullName,
        username: place.createdBy.username,
        avatar: place.createdBy.avatar,
        isVerified: place.createdBy.isVerified,
      },

      isFavorite: place.favorites.length > 0,

      isReviewed: place.reviews.length > 0,

      userRating: place.reviews.length > 0 ? place.reviews[0].rating : null,

      isSaved: place.collectionPlaces.length > 0,

      images: place.images.map((image: any) => ({
        id: image.id,
        imageUrl: image.imageUrl,
      })),
    };
  }

  static toResponseArray(places: any[]) {
    return places.map(this.toResponse);
  }
}
