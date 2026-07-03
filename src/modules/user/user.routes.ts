import { Router } from "express";

import { authenticate } from "../../middlewares/auth.middleware.js";
import { validate } from "../../middlewares/validate.middleware.js";

import {
  getMe,
  updateMe,
  uploadMyAvatar,
  getProfile,
  getPlaces,
  getReviews,
  getCollections,
  getFavorites,
} from "./user.controller.js";
import { upload } from "../../middlewares/upload.middleware.js";
import { updateProfileSchema } from "./user.validation.js";

const router = Router();

router.get("/me", authenticate, getMe);

router.patch("/me", authenticate, validate(updateProfileSchema), updateMe);
router.post(
  "/me/avatar",
  authenticate,
  upload.single("avatar"),
  uploadMyAvatar,
);

router.get("/me/places", authenticate, getPlaces);
router.get("/me/reviews", authenticate, getReviews);
router.get("/me/collections", authenticate, getCollections);
router.get("/me/favorites", authenticate, getFavorites);
router.get("/:username", getProfile);

export default router;
