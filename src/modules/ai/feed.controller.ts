import { Request, Response } from "express";
import { FeedEngine } from "./feed.engine.js";
import ApiResponse from "../../utils/ApiResponse.js";
import { asyncHandler } from "../../utils/async-handler.js";

export const getFeed = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user.userId;

    const feed = await FeedEngine.generateFeed(userId);

    res.status(200).json(
      new ApiResponse(
        true,
        "AI feed generated successfully",
        feed,
      ),
    );
  },
);