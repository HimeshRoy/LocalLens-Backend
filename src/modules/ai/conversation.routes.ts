import { Router } from "express";
import { authenticate } from "../../middlewares/auth.middleware.js";
import {
  getConversation,
  getMyConversations,
} from "./conversation.controller.js";

const router = Router();

router.get("/conversations", authenticate, getMyConversations);

router.get("/conversations/:id", authenticate, getConversation);

export default router;
