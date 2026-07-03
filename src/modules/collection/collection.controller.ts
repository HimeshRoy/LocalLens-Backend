import { Request, Response } from "express";

import ApiResponse from "../../utils/ApiResponse.js";
import {
  createCollection,
  getMyCollections,
  addPlaceToCollection,
  getCollectionById,
  removePlaceFromCollection,
  updateCollection,
  deleteCollection,
} from "./collection.service.js";

export const create = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user.userId;

  const result = await createCollection(userId, req.body);

  const statusCode = result.success ? 201 : 400;

  const response = new ApiResponse(result.success, result.message, result.data);

  res.status(statusCode).json(response);
};

export const getMine = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user.userId;

  const result = await getMyCollections(userId);

  const response = new ApiResponse(result.success, result.message, result.data);

  res.status(200).json(response);
};

export const addPlace = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user.userId;

  const { collectionId } = req.params;

  const result = await addPlaceToCollection(
    userId,
    collectionId as string,
    req.body,
  );

  const statusCode = result.success ? 201 : 400;

  const response = new ApiResponse(result.success, result.message, result.data);

  res.status(statusCode).json(response);
};

export const getById = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user.userId;
  const { id } = req.params;

  const result = await getCollectionById(userId, id as string);

  const statusCode = result.success ? 200 : 404;

  const response = new ApiResponse(result.success, result.message, result.data);

  res.status(statusCode).json(response);
};

export const removePlace = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const userId = req.user.userId;

  const { collectionId, placeId } = req.params;

  const result = await removePlaceFromCollection(
    userId,
    collectionId as string,
    placeId as string,
  );

  const statusCode = result.success ? 200 : 404;

  const response = new ApiResponse(result.success, result.message, result.data);

  res.status(statusCode).json(response);
};

export const update = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user.userId;

  const { collectionId } = req.params;

  const result = await updateCollection(
    userId,
    collectionId as string,
    req.body,
  );

  const statusCode = result.success ? 200 : 400;

  const response = new ApiResponse(result.success, result.message, result.data);

  res.status(statusCode).json(response);
};

export const remove = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user.userId;

  const { collectionId } = req.params;

  const result = await deleteCollection(userId, collectionId as string);

  const statusCode = result.success ? 200 : 404;

  const response = new ApiResponse(result.success, result.message, result.data);

  res.status(statusCode).json(response);
};
