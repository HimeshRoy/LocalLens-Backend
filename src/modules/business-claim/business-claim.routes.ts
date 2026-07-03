import { Router } from "express";
import { authorize } from "../../middlewares/authorize.middleware.js";
import { UserRole } from "@prisma/client";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { validate } from "../../middlewares/validate.middleware.js";

import {
  create,
  getMine,
  approve,
  getAll,
  reject,
} from "./business-claim.controller.js";
import { createBusinessClaimSchema } from "./business-claim.validation.js";

const router = Router();

router.get("/my", authenticate, getMine);
router.get("/", authenticate, authorize(UserRole.ADMIN), getAll);
router.patch("/:id/approve", authenticate, authorize(UserRole.ADMIN), approve);
router.patch("/:id/reject", authenticate, authorize(UserRole.ADMIN), reject);
router.post("/", authenticate, validate(createBusinessClaimSchema), create);

export default router;
