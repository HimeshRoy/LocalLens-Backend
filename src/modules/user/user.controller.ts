import { Request, Response } from "express";

import ApiResponse from "../../utils/ApiResponse.js";
import {
  getMyProfile,
  updateProfile,
  uploadAvatar,
  getPublicProfile,
  getMyPlaces,
  getMyReviews,
  getMyCollections,
  getMyFavorites,
} from "./user.service.js";

export const getMe = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user.userId;

  const result = await getMyProfile(userId);

  const statusCode = result.success ? 200 : 404;

  const response = new ApiResponse(result.success, result.message, result.data);

  res.status(statusCode).json(response);
};

export const updateMe = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user.userId;

  const result = await updateProfile(userId, req.body);

  const statusCode = result.success ? 200 : 400;

  const response = new ApiResponse(result.success, result.message, result.data);

  res.status(statusCode).json(response);
};

export const uploadMyAvatar = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const userId = req.user.userId;

  const result = await uploadAvatar(userId, req.file as Express.Multer.File);

  const statusCode = result.success ? 200 : 400;

  const response = new ApiResponse(result.success, result.message, result.data);

  res.status(statusCode).json(response);
};

export const getProfile = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { username } = req.params;

  const result = await getPublicProfile(username as string);

  const statusCode = result.success ? 200 : 404;

  const response = new ApiResponse(result.success, result.message, result.data);

  res.status(statusCode).json(response);
};

export const getPlaces = async (
  req: Request,
  res: Response
): Promise<void> => {

  const userId = req.user.userId;

  const result = await getMyPlaces(userId);

  const statusCode = result.success ? 200 : 400;

  res.status(statusCode).json(
    new ApiResponse(
      result.success,
      result.message,
      result.data
    )
  );
};

export const getReviews = async (
  req: Request,
  res: Response
): Promise<void> => {

  const userId = req.user.userId;

  const result = await getMyReviews(userId);

  const statusCode = result.success ? 200 : 400;

  res.status(statusCode).json(
    new ApiResponse(
      result.success,
      result.message,
      result.data
    )
  );
};

export const getCollections = async (
  req: Request,
  res: Response
): Promise<void> => {

  const userId = req.user.userId;

  const result = await getMyCollections(userId);

  const statusCode = result.success ? 200 : 400;

  res.status(statusCode).json(
    new ApiResponse(
      result.success,
      result.message,
      result.data
    )
  );
};

export const getFavorites = async (
  req: Request,
  res: Response
): Promise<void> => {

  const userId = req.user.userId;

  const result = await getMyFavorites(userId);

  const statusCode = result.success ? 200 : 400;

  res.status(statusCode).json(
    new ApiResponse(
      result.success,
      result.message,
      result.data
    )
  );
};