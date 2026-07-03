import { Request, Response } from "express";
import { trackActivity } from "./activity.service.js";
import ApiResponse from "../../utils/ApiResponse.js";

export const trackUserActivity = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const userId = req.user.userId;

  const { activityType, placeId, metadata } = req.body;

  await trackActivity(userId, activityType, placeId, metadata);

  res
    .status(201)
    .json(new ApiResponse(true, "Activity tracked successfully", null));
};
