import { Router } from "express";

import { authenticate } from "../../middlewares/auth.middleware.js";

import { trackUserActivity } from "./ai.controller.js";
import ragRoutes from "./rag/rag.routes.js";
import { getFeed } from "./feed.controller.js";
import conversationRoutes from "./conversation.routes.js";

const router = Router();

router.post("/activity", authenticate, trackUserActivity);
router.get("/feed", authenticate, getFeed);

router.use("/", ragRoutes);
router.use("/", conversationRoutes);

export default router;
