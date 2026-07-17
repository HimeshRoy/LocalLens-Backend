import { Router } from "express";

import {
  getAdminDashboard,
  getAdminUsers,
  updateAdminUserStatus,
  updateAdminUserVerification,
} from "./admin.controller.js";

import { authenticate } from "../../middlewares/auth.middleware.js";
import { authorize } from "../../middlewares/authorize.middleware.js";

const router = Router();

router.get("/dashboard", authenticate, authorize("ADMIN"), getAdminDashboard);
router.get("/users", authenticate, authorize("ADMIN"), getAdminUsers);
router.patch(
  "/users/:id/status",
  authenticate,
  authorize("ADMIN"),
  updateAdminUserStatus,
);
router.patch(
  "/users/:id/verification",
  authenticate,
  authorize("ADMIN"),
  updateAdminUserVerification,
);

export default router;
