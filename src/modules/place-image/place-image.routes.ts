import { Router } from "express";

import { authenticate } from "../../middlewares/auth.middleware.js";
import { upload } from "../../middlewares/upload.middleware.js";

import { uploadImages } from "./place-image.controller.js";

const router = Router();

router.post(
  "/:id/images",
  authenticate,
  upload.array("images", 10),
  uploadImages,
);

export default router;
