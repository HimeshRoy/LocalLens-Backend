import { Router } from "express";

import {
  getAdminDashboard,
  getAdminUsers,
  updateAdminUserStatus,
  updateAdminUserVerification,
  updateAdminUserRole,
  deleteAdminUser,
} from "./admin.controller.js";

import { authenticate } from "../../middlewares/auth.middleware.js";
import { authorize } from "../../middlewares/authorize.middleware.js";
import { updateUserRoleSchema } from "./admin.validation.js";
import { validate } from "../../middlewares/validate.middleware.js";

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
router.patch(
  "/users/:id/role",
  authenticate,
  authorize("ADMIN"),
  validate(updateUserRoleSchema),
  updateAdminUserRole,
);
router.delete("/users/:id", authenticate, authorize("ADMIN"), deleteAdminUser);

export default router;
