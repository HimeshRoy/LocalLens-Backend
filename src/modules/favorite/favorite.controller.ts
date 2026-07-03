import { Request, Response } from "express";

import ApiResponse from "../../utils/ApiResponse.js";

import { CreateFavoriteInput } from "./favorite.types.js";
import { createFavorite, getMyFavorites, removeFavorite, } from "./favorite.service.js";

export const create = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user.userId;

  const payload: CreateFavoriteInput = req.body;

  const result = await createFavorite(userId, payload);

  let statusCode = 201;

  if (!result.success) {
    switch (result.message) {
      case "Place not found":
        statusCode = 404;
        break;

      case "Place already added to favorites":
        statusCode = 409;
        break;

      default:
        statusCode = 400;
    }
  }

  const response = new ApiResponse(result.success, result.message, result.data);

  res.status(statusCode).json(response);
};

export const getMine = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user.userId;

  const result = await getMyFavorites(userId);

  const response = new ApiResponse(result.success, result.message, result.data);

  res.status(200).json(response);
};

export const remove = async (
  req: Request,
  res: Response
): Promise<void> => {

  const userId = req.user.userId;
  const { placeId } = req.params;

  const result = await removeFavorite(
    userId,
    placeId as string
  );

  const statusCode = result.success ? 200 : 404;

  const response = new ApiResponse(
    result.success,
    result.message,
    result.data
  );

  res.status(statusCode).json(response);

};