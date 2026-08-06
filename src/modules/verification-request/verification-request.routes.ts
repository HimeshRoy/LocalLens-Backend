import { Router } from "express";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { authorize } from "../../middlewares/authorize.middleware.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { UserRole } from "@prisma/client";
import { upload } from "../../middlewares/upload.middleware.js";

import {
  create,
  getMine,
  getAll,
  approve,
  reject,
  getById,
} from "./verification-request.controller.js";

import { createVerificationRequestSchema } from "./verification-request.validation.js";

const router = Router();

router.post(
  "/",
  authenticate,
  upload.fields([
    {
      name: "document",
      maxCount: 1,
    },
    {
      name: "selfie",
      maxCount: 1,
    },
  ]),
  validate(createVerificationRequestSchema),
  create,
);
router.get("/my", authenticate, getMine);
router.get("/", authenticate, authorize(UserRole.ADMIN), getAll);
router.get(
  "/:id",
  authenticate,
  authorize(UserRole.ADMIN),
  getById,
);
router.patch("/:id/approve", authenticate, authorize(UserRole.ADMIN), approve);
router.patch("/:id/reject", authenticate, authorize(UserRole.ADMIN), reject);

export default router;
