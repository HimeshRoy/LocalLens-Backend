import { prisma } from "../../config/prisma.js";
import { CreateReviewInput, UpdateReviewInput } from "./review.types.js";
import { InterestEngine } from "../ai/interest.engine.js";

export const createReview = async (
  userId: string,
  payload: CreateReviewInput,
) => {
  const place = await prisma.place.findFirst({
    where: {
      id: payload.placeId,
      isActive: true,
    },
  });

  if (!place) {
    return {
      success: false,
      message: "Place not found",
    };
  }

  const existingReview = await prisma.review.findUnique({
    where: {
      userId_placeId: {
        userId,
        placeId: payload.placeId,
      },
    },
  });

  if (existingReview) {
    return {
      success: false,
      message: "You have already reviewed this place",
    };
  }

  const review = await prisma.review.create({
    data: {
      rating: payload.rating,
      comment: payload.comment,

      placeId: payload.placeId,
      userId,
    },

    include: {
      user: {
        select: {
          id: true,
          fullName: true,
          username: true,
        },
      },

      place: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
    },
  });

  await InterestEngine.learn({
    userId,
    placeId: payload.placeId,
    activityType: `REVIEW_${payload.rating}` as
      "REVIEW_1" | "REVIEW_2" | "REVIEW_3" | "REVIEW_4" | "REVIEW_5",
  });

  return {
    success: true,
    message: "Review added successfully",
    data: review,
  };
};

export const getPlaceReviews = async (placeId: string) => {
  const place = await prisma.place.findFirst({
    where: {
      id: placeId,
      isActive: true,
    },
  });

  if (!place) {
    return {
      success: false,
      message: "Place not found",
    };
  }

  const reviews = await prisma.review.findMany({
    where: {
      placeId,
      isActive: true,
    },

    include: {
      user: {
        select: {
          id: true,
          fullName: true,
          username: true,
        },
      },
    },

    orderBy: {
      createdAt: "desc",
    },
  });

  const stats = await prisma.review.aggregate({
    where: {
      placeId,
      isActive: true,
    },

    _avg: {
      rating: true,
    },

    _count: {
      rating: true,
    },
  });

  return {
    success: true,
    message: "Reviews fetched successfully",
    data: {
      averageRating: Number((stats._avg.rating ?? 0).toFixed(1)),

      totalReviews: stats._count.rating,

      reviews,
    },
  };
};

export const updateReview = async (
  reviewId: string,
  userId: string,
  role: string,
  payload: UpdateReviewInput,
) => {
  const review = await prisma.review.findUnique({
    where: {
      id: reviewId,
    },
  });

  if (!review || !review.isActive) {
    return {
      success: false,
      message: "Review not found",
    };
  }

  if (review.userId !== userId && role !== "ADMIN") {
    return {
      success: false,
      message: "You are not authorized to update this review",
    };
  }

  const updatedReview = await prisma.review.update({
    where: {
      id: reviewId,
    },

    data: {
      ...payload,
    },

    include: {
      user: {
        select: {
          id: true,
          fullName: true,
          username: true,
        },
      },

      place: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
    },
  });

  return {
    success: true,
    message: "Review updated successfully",
    data: updatedReview,
  };
};

export const deleteReview = async (
  reviewId: string,
  userId: string,
  role: string,
) => {
  const review = await prisma.review.findUnique({
    where: {
      id: reviewId,
    },
  });

  if (!review || !review.isActive) {
    return {
      success: false,
      message: "Review not found",
    };
  }

  if (review.userId !== userId && role !== "ADMIN") {
    return {
      success: false,
      message: "You are not authorized to delete this review",
    };
  }

  const deletedReview = await prisma.review.update({
    where: {
      id: reviewId,
    },
    data: {
      isActive: false,
    },
    include: {
      user: {
        select: {
          id: true,
          fullName: true,
          username: true,
        },
      },
      place: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
    },
  });

  return {
    success: true,
    message: "Review deleted successfully",
    data: deletedReview,
  };
};
