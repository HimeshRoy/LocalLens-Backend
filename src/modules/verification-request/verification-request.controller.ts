import { Request, Response } from "express";

import ApiResponse from "../../utils/ApiResponse.js";

import {
  createVerificationRequest,
  getMyVerificationRequests,
  getAllVerificationRequests,
  approveVerificationRequest,
  rejectVerificationRequest,
  getVerificationRequestById,
} from "./verification-request.service.js";

export const create = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user.userId;

  const result = await createVerificationRequest(
    userId,
    req.body,
    req.files as {
      document?: Express.Multer.File[];
      selfie?: Express.Multer.File[];
    },
  );

  const statusCode = result.success ? 201 : 400;

  const response = new ApiResponse(result.success, result.message, result.data);

  res.status(statusCode).json(response);
};

export const getMine = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user.userId;

  const result = await getMyVerificationRequests(userId);

  const response = new ApiResponse(result.success, result.message, result.data);

  res.status(200).json(response);
};

export const getAll = async (_req: Request, res: Response): Promise<void> => {
  const result = await getAllVerificationRequests();

  const response = new ApiResponse(result.success, result.message, result.data);

  res.status(200).json(response);
};

export const approve = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  const result = await approveVerificationRequest(id as string);

  const statusCode = result.success ? 200 : 400;

  const response = new ApiResponse(result.success, result.message, result.data);

  res.status(statusCode).json(response);
};

export const reject = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  const result = await rejectVerificationRequest(id as string);

  const statusCode = result.success ? 200 : 400;

  const response = new ApiResponse(result.success, result.message, result.data);

  res.status(statusCode).json(response);
};

export const getById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { id } = req.params;

  const result = await getVerificationRequestById(id as string);

  const statusCode = result.success ? 200 : 404;

  const response = new ApiResponse(
    result.success,
    result.message,
    result.data,
  );

  res.status(statusCode).json(response);
};