import { Router } from "express";
import { getFeed } from "./feed.controller.js";
import { authenticate } from "../../middlewares/auth.middleware.js";

const router = Router();

router.get("/", authenticate, getFeed);

export default router;