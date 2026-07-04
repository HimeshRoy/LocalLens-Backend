import { Router } from "express";
import { getCurrentLocation } from "./location.controller.js";

const router = Router();

router.get("/reverse", getCurrentLocation);

export default router;