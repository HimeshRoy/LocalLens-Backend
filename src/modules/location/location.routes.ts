import { Router } from "express";
import {
  getCurrentLocation,
  search,
  directions,
  mapTile,
} from "./location.controller.js";

const router = Router();

router.get("/reverse", getCurrentLocation);
router.get("/search", search);
router.get("/directions", directions);
router.get("/tiles/:z/:x/:y.png", mapTile);

export default router;
