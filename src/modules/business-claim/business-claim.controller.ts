import { Request, Response } from "express";

import ApiResponse from "../../utils/ApiResponse.js";
import {
  createBusinessClaim,
  getMyBusinessClaims,
  getAllBusinessClaims,
  approveBusinessClaim,
  rejectBusinessClaim,
} from "./business-claim.service.js";

export const create = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user.userId;

  const result = await createBusinessClaim(userId, req.body);

  const statusCode = result.success ? 201 : 400;

  const response = new ApiResponse(result.success, result.message, result.data);

  res.status(statusCode).json(response);
};

export const getMine = async (req: Request, res: Response): Promise<void> => {
  const userId = req.user.userId;

  const result = await getMyBusinessClaims(userId);

  const response = new ApiResponse(result.success, result.message, result.data);

  res.status(200).json(response);
};

export const getAll = async (req: Request, res: Response): Promise<void> => {
  const result = await getAllBusinessClaims();

  const response = new ApiResponse(result.success, result.message, result.data);

  res.status(200).json(response);
};

export const approve = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  const result = await approveBusinessClaim(id as string);

  const statusCode = result.success ? 200 : 400;

  const response = new ApiResponse(result.success, result.message, result.data);

  res.status(statusCode).json(response);
};

export const reject = async (
  req: Request,
  res: Response
): Promise<void> => {

  const { id } = req.params;

  const result = await rejectBusinessClaim(id as string);

  const statusCode = result.success ? 200 : 400;

  const response = new ApiResponse(
    result.success,
    result.message,
    result.data
  );

  res.status(statusCode).json(response);
};