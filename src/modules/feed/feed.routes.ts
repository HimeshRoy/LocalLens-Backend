import { Router } from "express";
import { optionalAuthenticate } from "../../middlewares/optional-auth.middleware.js";
import { getHomeFeed } from "./feed.controller.js";

const router = Router();

router.get("/", optionalAuthenticate, getHomeFeed);

export default router;