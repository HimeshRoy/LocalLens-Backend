import { Request, Response } from "express";
import { asyncHandler } from "../../utils/async-handler.js";
import ApiResponse from "../../utils/ApiResponse.js";
import { ConversationService } from "./conversation.service.js";

export const getMyConversations = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user.userId;

    const conversations =
      await ConversationService.getUserConversations(userId);

    return res.status(200).json(
      new ApiResponse(
        true,
        "Conversations fetched successfully",
        conversations,
      ),
    );
  },
);

export const getConversation = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const conversation =
      await ConversationService.getConversation(id as string);

    if (!conversation) {
      return res.status(404).json(
        new ApiResponse(
          false,
          "Conversation not found",
          null,
        ),
      );
    }

    return res.status(200).json(
      new ApiResponse(
        true,
        "Conversation fetched successfully",
        conversation,
      ),
    );
  },
);