import { prisma } from "../../config/prisma.js";
import { uploadImage } from "../../services/cloudinary.service.js";

export const uploadPlaceImages = async (
  placeId: string,
  userId: string,
  role: string,
  files: Express.Multer.File[]
) => {

  const place = await prisma.place.findUnique({
    where: {
      id: placeId,
    },
  });

  if (!place || !place.isActive) {
    return {
      success: false,
      message: "Place not found",
    };
  }

  if (
    place.createdById !== userId &&
    role !== "ADMIN"
  ) {
    return {
      success: false,
      message: "You are not authorized to upload images",
    };
  }

  if (!files.length) {
    return {
      success: false,
      message: "Images are required",
    };
  }

  const uploadedImages = [];

  for (const file of files) {

    const { imageUrl, publicId } = await uploadImage(
  file,
  "locallens/places"
);

    const image = await prisma.placeImage.create({
      data: {
        imageUrl,

        publicId,

        placeId,

        uploadedById: userId,
      },
    });

    uploadedImages.push(image);
  }

  return {
    success: true,
    message: "Images uploaded successfully",
    data: uploadedImages,
  };
};