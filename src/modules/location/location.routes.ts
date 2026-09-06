import { Router } from "express";
import {
  getCurrentLocation,
  search,
  directions,
} from "./location.controller.js";

const router = Router();

router.get("/reverse", getCurrentLocation);
router.get("/search", search);
router.get("/directions", directions);

export default router;
