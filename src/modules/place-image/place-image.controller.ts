import { Request, Response } from "express";
import ApiResponse from "../../utils/ApiResponse.js";
import { uploadPlaceImages } from "./place-image.service.js";

export const uploadImages = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const userId = req.user.userId;
    const role = req.user.role;

    const files = (req.files || []) as Express.Multer.File[];

    const result = await uploadPlaceImages(
      id as string,
      userId,
      role,
      files
    );

    const response = new ApiResponse(
      result.success,
      result.message,
      result.data
    );

    res.status(result.success ? 200 : 400).json(response);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};