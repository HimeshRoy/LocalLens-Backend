import { Router } from "express";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { authorize } from "../../middlewares/authorize.middleware.js";
import { UserRole } from "@prisma/client";

import {
  create,
  getMine,
  getAll,
  approve,
  reject,
  getById,
  getEligibility,
} from "./verification-request.controller.js";

const router = Router();

router.post("/", authenticate, create);
router.get("/eligibility", authenticate, getEligibility);
router.get("/my", authenticate, getMine);
router.get("/", authenticate, authorize(UserRole.ADMIN), getAll);
router.get("/:id", authenticate, authorize(UserRole.ADMIN), getById);
router.patch("/:id/approve", authenticate, authorize(UserRole.ADMIN), approve);
router.patch("/:id/reject", authenticate, authorize(UserRole.ADMIN), reject);

export default router;
