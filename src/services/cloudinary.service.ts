import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";

export interface CloudinaryUploadResult {
  imageUrl: string;
  publicId: string;
}

export const uploadImage = (
  file: Express.Multer.File,
  folder: string
): Promise<CloudinaryUploadResult> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }

        if (!result) {
          return reject(new Error("Upload failed"));
        }

        resolve({
          imageUrl: result.secure_url,
          publicId: result.public_id,
        });
      }
    );

    streamifier.createReadStream(file.buffer).pipe(uploadStream);
  });
};