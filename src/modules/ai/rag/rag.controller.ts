import { Request, Response } from "express";
import { asyncHandler } from "../../../utils/async-handler.js";
import ApiResponse from "../../../utils/ApiResponse.js";
import { RagService } from "./rag.service.js";
import { ChatInput } from "./rag.types.js";

export const chat = asyncHandler(async (req: Request, res: Response) => {
  const payload: ChatInput = req.body;

  if (!payload.message?.trim()) {
    return res
      .status(400)
      .json(new ApiResponse(false, "Message is required", null));
  }

  const userId = req.user.userId;

  const result = await RagService.chat(
    userId,
    payload.message,
    payload.conversationId,
  );

  return res
    .status(200)
    .json(new ApiResponse(true, "AI response generated successfully", result));
});
