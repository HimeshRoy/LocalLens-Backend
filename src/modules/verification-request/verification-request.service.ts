import { prisma } from "../../config/prisma.js";
import type { ServiceResponse } from "../../types/service-response.js";
import type { CreateVerificationRequestInput } from "./verification-request.types.js";
import { uploadImage } from "../../services/cloudinary.service.js";

export const createVerificationRequest = async (
  userId: string,
  payload: CreateVerificationRequestInput,
  files: {
    document?: Express.Multer.File[];
    selfie?: Express.Multer.File[];
  },
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

  const documentFile = files.document?.[0];
  const selfieFile = files.selfie?.[0];

  if (!documentFile) {
    return {
      success: false,
      message: "Government ID is required.",
      data: null,
    };
  }

  const [documentUpload, selfieUpload] = await Promise.all([
    uploadImage(documentFile, "locallens/verification/documents"),
    selfieFile
      ? uploadImage(selfieFile, "locallens/verification/selfies")
      : Promise.resolve(undefined),
  ]);

  const request = await prisma.verificationRequest.create({
    data: {
      userId,

      reason: payload.reason,

      documentUrl: documentUpload.imageUrl,
      documentPublicId: documentUpload.publicId,

      selfieUrl: selfieUpload?.imageUrl,
      selfiePublicId: selfieUpload?.publicId,
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
