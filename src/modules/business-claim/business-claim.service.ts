import { prisma } from "../../config/prisma.js";
import type { ServiceResponse } from "../../types/service-response.js";
import type { CreateBusinessClaimInput } from "./business-claim.types.js";

export const createBusinessClaim = async (
  userId: string,
  payload: CreateBusinessClaimInput,
): Promise<ServiceResponse<any>> => {
  const place = await prisma.place.findUnique({
    where: {
      id: payload.placeId,
    },
  });

  if (!place || !place.isActive) {
    return {
      success: false,
      message: "Place not found",
      data: null,
    };
  }

  if (place.createdById === userId) {
    return {
      success: false,
      message: "You already own this place",
      data: null,
    };
  }

  const existingClaim = await prisma.businessClaim.findUnique({
    where: {
      userId_placeId: {
        userId,
        placeId: payload.placeId,
      },
    },
  });

  if (existingClaim) {
    return {
      success: false,
      message: "You have already submitted a claim for this place",
      data: null,
    };
  }

  const claim = await prisma.businessClaim.create({
    data: {
      userId,
      placeId: payload.placeId,
      message: payload.message,
    },

    include: {
      place: {
        select: {
          id: true,
          name: true,
          slug: true,
          coverImage: true,
        },
      },

      user: {
        select: {
          id: true,
          fullName: true,
          username: true,
        },
      },
    },
  });

  return {
    success: true,
    message: "Business claim submitted successfully",
    data: claim,
  };
};

export const getMyBusinessClaims = async (
  userId: string,
): Promise<ServiceResponse<any>> => {
  const claims = await prisma.businessClaim.findMany({
    where: {
      userId,
    },

    include: {
      place: {
        include: {
          category: true,
        },
      },
    },

    orderBy: {
      createdAt: "desc",
    },
  });

  return {
    success: true,
    message: "Business claims fetched successfully",
    data: claims,
  };
};

export const getAllBusinessClaims = async (): Promise<ServiceResponse<any>> => {
  const claims = await prisma.businessClaim.findMany({
    include: {
      user: {
        select: {
          id: true,
          fullName: true,
          username: true,
          email: true,
        },
      },

      place: {
        include: {
          category: true,
        },
      },
    },

    orderBy: {
      createdAt: "desc",
    },
  });

  return {
    success: true,
    message: "Business claims fetched successfully",
    data: claims,
  };
};

export const approveBusinessClaim = async (
  claimId: string,
): Promise<ServiceResponse<any>> => {
  const claim = await prisma.businessClaim.findUnique({
    where: {
      id: claimId,
    },

    include: {
      place: true,
    },
  });

  if (!claim) {
    return {
      success: false,
      message: "Business claim not found",
      data: null,
    };
  }

  if (claim.status !== "PENDING") {
    return {
      success: false,
      message: "This claim has already been processed",
      data: null,
    };
  }

  await prisma.$transaction(async (tx) => {
    await tx.businessClaim.update({
      where: {
        id: claimId,
      },
      data: {
        status: "APPROVED",
      },
    });

    await tx.place.update({
      where: {
        id: claim.placeId,
      },
      data: {
        createdById: claim.userId,
        isVerified: true,
      },
    });

    await tx.businessClaim.updateMany({
      where: {
        placeId: claim.placeId,
        id: {
          not: claimId,
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
    message: "Business claim approved successfully",
    data: null,
  };
};

export const rejectBusinessClaim = async (
  claimId: string,
): Promise<ServiceResponse<any>> => {
  const claim = await prisma.businessClaim.findUnique({
    where: {
      id: claimId,
    },
  });

  if (!claim) {
    return {
      success: false,
      message: "Business claim not found",
      data: null,
    };
  }

  if (claim.status !== "PENDING") {
    return {
      success: false,
      message: "This claim has already been processed",
      data: null,
    };
  }

  const updatedClaim = await prisma.businessClaim.update({
    where: {
      id: claimId,
    },

    data: {
      status: "REJECTED",
    },
  });

  return {
    success: true,
    message: "Business claim rejected successfully",
    data: updatedClaim,
  };
};
