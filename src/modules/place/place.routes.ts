import { Router } from "express";

import {
  create,
  getAll,
  getById,
  update,
  remove,
  uploadCover,
  getNearby,
} from "./place.controller.js";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { validate } from "../../middlewares/validate.middleware.js";
import {
  createPlaceSchema,
  updatePlaceSchema,
  nearbyPlacesSchema,
} from "./place.validation.js";
import { upload } from "../../middlewares/upload.middleware.js";

const router = Router();

router.post("/", authenticate, validate(createPlaceSchema), create);
router.get("/", getAll);
router.get("/nearby", validate(nearbyPlacesSchema), getNearby);
router.get("/:id", getById);
router.patch("/:id", authenticate, validate(updatePlaceSchema), update);
router.post(
  "/:id/upload-cover",
  authenticate,
  upload.single("cover"),
  uploadCover,
);
router.delete("/:id", authenticate, remove);
export default router;
