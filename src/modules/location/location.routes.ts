import { Router } from "express";
import { getCurrentLocation,search } from "./location.controller.js";

const router = Router();

router.get("/reverse", getCurrentLocation);
router.get("/search", search);

export default router;