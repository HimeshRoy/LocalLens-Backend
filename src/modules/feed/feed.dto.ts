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
      distance: place.distance,

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

      createdAt: place.createdAt,

      isFavorite: (place.favorites?.length ?? 0) > 0,

      isSaved: (place.collections?.length ?? 0) > 0,

      isReviewed: (place.reviews?.length ?? 0) > 0,

      userRating: place.reviews?.length ? place.reviews[0].rating : null,

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
