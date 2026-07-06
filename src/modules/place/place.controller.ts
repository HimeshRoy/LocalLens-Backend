import { Request, Response, NextFunction } from "express";
import ApiResponse from "../../utils/ApiResponse.js";
import {
  createPlace,
  getPlaces,
  getPlaceById,
  updatePlace,
  deletePlace,
  uploadPlaceCover,
  getNearbyPlaces,
  getPlaceBySlug,
} from "./place.service.js";
import * as placeService from "./place.service.js";

import { asyncHandler } from "../../utils/async-handler.js";
import { ApiError } from "../../utils/api-error.js";

import {
  type GetPlacesQuery,
  type UpdatePlaceInput,
  type NearbyPlacesQuery,
} from "./place.types.js";

export const create = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user.userId;

  const result = await createPlace(userId, req.body);

  if (!result.success) {
    switch (result.message) {
      case "Category not found":
        throw new ApiError(404, result.message);

      case "Place already exists in this city":
        throw new ApiError(409, result.message);

      default:
        throw new ApiError(400, result.message);
    }
  }

  res.status(201).json(new ApiResponse(true, result.message, result.data));
});

export const getAll = async (req: Request, res: Response): Promise<void> => {
  try {
    const query: GetPlacesQuery = {
      search: req.query.search as string,
      city: req.query.city as string,
      categoryId: req.query.categoryId as string,

      page: req.query.page ? Number(req.query.page) : 1,

      limit: req.query.limit ? Number(req.query.limit) : 10,

      sort: (req.query.sort as "newest" | "oldest") || "newest",
    };

    const result = await getPlaces(query);

    const response = new ApiResponse(
      result.success,
      result.message,
      result.data,
    );

    res.status(200).json(response);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;

    const result = await getPlaceById(id as string, userId);

    const response = new ApiResponse(
      result.success,
      result.message,
      result.data,
    );

    res.status(result.success ? 200 : 404).json(response);
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

    const payload: UpdatePlaceInput = req.body;

    const result = await updatePlace(id as string, userId, role, payload);

    let statusCode = 200;

    if (!result.success) {
      if (result.message === "Place not found") {
        statusCode = 404;
      } else if (
        result.message === "You are not authorized to update this place"
      ) {
        statusCode = 403;
      } else {
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

    const result = await deletePlace(id as string, userId, role);

    let statusCode = 200;

    if (!result.success) {
      if (result.message === "Place not found") {
        statusCode = 404;
      } else if (
        result.message === "You are not authorized to delete this place"
      ) {
        statusCode = 403;
      } else {
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

export const uploadCover = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;

    const userId = req.user.userId;
    const role = req.user.role;

    const file = req.file;

    const result = await uploadPlaceCover(
      id as string,
      userId,
      role,
      file as Express.Multer.File,
    );

    let statusCode = 200;

    if (!result.success) {
      switch (result.message) {
        case "Place not found":
          statusCode = 404;
          break;

        case "You are not authorized to update this place":
          statusCode = 403;
          break;

        case "Image is required":
          statusCode = 400;
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

export const getNearby = async (req: Request, res: Response): Promise<void> => {
  const query: NearbyPlacesQuery = {
    latitude: Number(req.query.latitude),
    longitude: Number(req.query.longitude),
    radius: Number(req.query.radius),
  };

  const result = await getNearbyPlaces(query);

  const response = new ApiResponse(result.success, result.message, result.data);

  res.status(200).json(response);
};

export const getBySlug = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const place = await placeService.getPlaceBySlug(req.params.slug as string);

    if (!place) {
      return res.status(404).json({
        success: false,
        message: "Place not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Place fetched successfully",
      data: place,
    });
  } catch (error) {
    next(error);
  }
};
