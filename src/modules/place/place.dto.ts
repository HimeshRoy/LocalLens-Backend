export class PlaceDto {
  static toResponse(place: any) {
    return {
      id: place.id,

      name: place.name,

      slug: place.slug,

      description: place.description,

      address: place.address,

      city: place.city,

      state: place.state,

      country: place.country,

      latitude: place.latitude,

      longitude: place.longitude,

      coverImage: place.coverImage,

      phone: place.phone,

      website: place.website,

      openingHours: place.openingHours,

      priceRange: place.priceRange,

      averageRating: place.averageRating > 0 ? place.averageRating : null,

      totalReviews: place.totalReviews,

      category: {
        id: place.category.id,
        name: place.category.name,
        icon: place.category.icon,
      },

      tags: place.tags.map((tag: any) => tag.tag.name),

      images: place.images.map((image: any) => ({
        id: image.id,
        imageUrl: image.imageUrl,
      })),

      isVerified: place.isVerified,
    };
  }

  static toResponseArray(places: any[]) {
    return places.map(this.toResponse);
  }
}
