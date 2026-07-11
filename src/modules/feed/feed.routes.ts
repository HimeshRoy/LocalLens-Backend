import { Router } from "express";

import { getHomeFeed } from "./feed.controller.js";

const router = Router();

router.get("/", getHomeFeed);

export default router;