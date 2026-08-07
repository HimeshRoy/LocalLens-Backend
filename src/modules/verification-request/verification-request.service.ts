import { prisma } from "../../config/prisma.js";
import { VERIFICATION_REQUIREMENTS } from "../../constants/verification.js";
import type { ServiceResponse } from "../../types/service-response.js";
import { ClaimStatus, PlaceStatus } from "@prisma/client";

export const createVerificationRequest = async (
  userId: string,
): Promise<ServiceResponse<any>> => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
      isActive: true,
    },
  });

  if (!user) {
    return {
      success: false,
      message: "User not found",
      data: null,
    };
  }

  const approvedPlaces = await prisma.place.count({
    where: {
      createdById: userId,
      status: "APPROVED",
      isActive: true,
    },
  });

  const reviewsCount = await prisma.review.count({
    where: {
      userId,
      isActive: true,
    },
  });

  if (approvedPlaces < VERIFICATION_REQUIREMENTS.approvedPlaces || reviewsCount < VERIFICATION_REQUIREMENTS.reviews) {
    return {
      success: false,
      message:
        "You need at least 50 approved places and 100 reviews before applying for verification.",
      data: {
        approvedPlaces,
        reviewsCount,
        requiredPlaces: VERIFICATION_REQUIREMENTS.approvedPlaces,
        requiredReviews: VERIFICATION_REQUIREMENTS.reviews,
      },
    };
  }

  const existingRequest = await prisma.verificationRequest.findFirst({
    where: {
      userId,
      status: "PENDING",
    },
  });

  if (existingRequest) {
    return {
      success: false,
      message: "You already have a pending verification request",
      data: null,
    };
  }

  const request = await prisma.verificationRequest.create({
    data: {
      userId,
    },
  });

  return {
    success: true,
    message: "Verification request submitted successfully",
    data: request,
  };
};

export const getMyVerificationRequests = async (
  userId: string,
): Promise<ServiceResponse<any>> => {
  const requests = await prisma.verificationRequest.findMany({
    where: {
      userId,
    },

    orderBy: {
      createdAt: "desc",
    },
  });

  return {
    success: true,
    message: "Verification requests fetched successfully",
    data: requests,
  };
};

export const getAllVerificationRequests = async (): Promise<
  ServiceResponse<any>
> => {
  const requests = await prisma.verificationRequest.findMany({
    include: {
      user: {
        select: {
          id: true,
          fullName: true,
          username: true,
          email: true,
          avatar: true,
          isVerified: true,
        },
      },
    },

    orderBy: {
      createdAt: "desc",
    },
  });

  return {
    success: true,
    message: "Verification requests fetched successfully",
    data: requests,
  };
};

export const approveVerificationRequest = async (
  requestId: string,
): Promise<ServiceResponse<any>> => {
  const request = await prisma.verificationRequest.findUnique({
    where: {
      id: requestId,
    },
  });

  if (!request) {
    return {
      success: false,
      message: "Verification request not found",
      data: null,
    };
  }

  if (request.status !== "PENDING") {
    return {
      success: false,
      message: "This verification request has already been processed",
      data: null,
    };
  }

  await prisma.$transaction(async (tx) => {
    await tx.verificationRequest.update({
      where: {
        id: requestId,
      },
      data: {
        status: "APPROVED",
      },
    });

    await tx.user.update({
      where: {
        id: request.userId,
      },
      data: {
        isVerified: true,
      },
    });

    await tx.verificationRequest.updateMany({
      where: {
        userId: request.userId,
        id: {
          not: requestId,
        },
        status: "PENDING",
      },
      data: {
        status: "REJECTED",
      },
    });
  });

  return {
    success: true,
    message: "Verification request approved successfully",
    data: null,
  };
};

export const rejectVerificationRequest = async (
  requestId: string,
): Promise<ServiceResponse<any>> => {
  const request = await prisma.verificationRequest.findUnique({
    where: {
      id: requestId,
    },
  });

  if (!request) {
    return {
      success: false,
      message: "Verification request not found",
      data: null,
    };
  }

  if (request.status !== "PENDING") {
    return {
      success: false,
      message: "This verification request has already been processed",
      data: null,
    };
  }

  const updatedRequest = await prisma.verificationRequest.update({
    where: {
      id: requestId,
    },
    data: {
      status: "REJECTED",
    },
  });

  return {
    success: true,
    message: "Verification request rejected successfully",
    data: updatedRequest,
  };
};

export const getVerificationRequestById = async (
  id: string,
): Promise<ServiceResponse<any>> => {
  const request = await prisma.verificationRequest.findUnique({
    where: {
      id,
    },

    include: {
      user: {
        select: {
          id: true,
          fullName: true,
          username: true,
          email: true,
          avatar: true,
          isVerified: true,
        },
      },
    },
  });

  if (!request) {
    return {
      success: false,
      message: "Verification request not found",
      data: null,
    };
  }

  return {
    success: true,
    message: "Verification request fetched successfully",
    data: request,
  };
};

export const getVerificationEligibility = async (
  userId: string,
): Promise<ServiceResponse<any>> => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
      isActive: true,
    },
    select: {
      isVerified: true,
    },
  });

  if (!user) {
    return {
      success: false,
      message: "User not found",
      data: null,
    };
  }

  const existingRequest = await prisma.verificationRequest.findFirst({
    where: {
      userId,
      status: "PENDING",
    },
  });

  const approvedPlaces = await prisma.place.count({
    where: {
      createdById: userId,
      status: "APPROVED",
      isActive: true,
    },
  });

  const reviewsCount = await prisma.review.count({
    where: {
      userId,
      isActive: true,
    },
  });

  return {
    success: true,
    message: "Verification eligibility fetched successfully",
    data: {
      isVerified: user.isVerified,
      alreadyApplied: !!existingRequest,

      approvedPlaces,
      reviewsCount,

      requiredPlaces:
        VERIFICATION_REQUIREMENTS.approvedPlaces,

      requiredReviews:
        VERIFICATION_REQUIREMENTS.reviews,

      eligible:
        approvedPlaces >=
          VERIFICATION_REQUIREMENTS.approvedPlaces &&
        reviewsCount >=
          VERIFICATION_REQUIREMENTS.reviews,
    },
  };
};
