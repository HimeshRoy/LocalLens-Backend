import { Request, Response } from "express";

import ApiResponse from "../../utils/ApiResponse.js";

import { getFeed } from "./feed.service.js";

import { FeedDto } from "./feed.dto.js";

export const getHomeFeed = async (
  req: Request,
  res: Response,
) => {
  const userId = req.user?.userId;
  
  const result = await getFeed(userId, {
  latitude: Number(req.query.latitude),
  longitude: Number(req.query.longitude),
  page: Number(req.query.page),
  limit: Number(req.query.limit),
});

  res.status(200).json(
    new ApiResponse(
      true,
      "Feed fetched successfully",
      FeedDto.toResponseArray(result),
    ),
  );
};