import { Request, Response } from "express";
import { asyncHandler } from "../../utils/async-handler.js";
import { ApiError } from "../../utils/api-error.js";

import ApiResponse from "../../utils/ApiResponse.js";

import {
  createReview,
  getPlaceReviews,
  updateReview,
  deleteReview,
} from "./review.service.js";

import { CreateReviewInput, UpdateReviewInput } from "./review.types.js";

export const create = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user.userId;

  const payload: CreateReviewInput = req.body;

  const result = await createReview(userId, payload);

  if (!result.success) {
    switch (result.message) {
      case "Place not found":
        throw new ApiError(404, result.message);

      case "You have already reviewed this place":
        throw new ApiError(409, result.message);

      default:
        throw new ApiError(400, result.message);
    }
  }

  const response = new ApiResponse(true, result.message, result.data);

  res.status(201).json(response);
});

export const getByPlace = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { placeId } = req.params;

    const result = await getPlaceReviews(placeId as string);

    const statusCode = result.success ? 200 : 404;

    const response = new ApiResponse(
      result.success,
      result.message,
      result.data,
    );

    res.status(statusCode).json(response);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const update = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const userId = req.user.userId;
    const role = req.user.role;

    const payload: UpdateReviewInput = req.body;

    const result = await updateReview(id as string, userId, role, payload);

    let statusCode = 200;

    if (!result.success) {
      switch (result.message) {
        case "Review not found":
          statusCode = 404;
          break;

        case "You are not authorized to update this review":
          statusCode = 403;
          break;

        default:
          statusCode = 400;
      }
    }

    const response = new ApiResponse(
      result.success,
      result.message,
      result.data,
    );

    res.status(statusCode).json(response);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const remove = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const userId = req.user.userId;
    const role = req.user.role;

    const result = await deleteReview(id as string, userId, role);

    let statusCode = 200;

    if (!result.success) {
      switch (result.message) {
        case "Review not found":
          statusCode = 404;
          break;

        case "You are not authorized to delete this review":
          statusCode = 403;
          break;

        default:
          statusCode = 400;
      }
    }

    const response = new ApiResponse(
      result.success,
      result.message,
      result.data,
    );

    res.status(statusCode).json(response);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
