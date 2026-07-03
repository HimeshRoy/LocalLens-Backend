import { Router } from "express";
import { chat } from "./rag.controller.js";
import { authenticate } from "../../../middlewares/auth.middleware.js";
import { validate } from "../../../middlewares/validate.middleware.js";
import { chatSchema } from "./rag.validation.js";

const router = Router();

router.post("/chat", authenticate, validate(chatSchema), chat);

export default router;
