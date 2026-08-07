import { Router } from "express";

import {
  getAdminDashboard,
  getAdminUsers,
  updateAdminUserStatus,
  updateAdminUserVerification,
  updateAdminUserRole,
  deleteAdminUser,
  getAdminPlaces,
  updateAdminPlaceStatus,
  deleteAdminPlace,
  getAdminPlaceById,
  approvePlaceController,
  rejectPlaceController,
} from "./admin.controller.js";

import { authenticate } from "../../middlewares/auth.middleware.js";
import { authorize } from "../../middlewares/authorize.middleware.js";
import { updateUserRoleSchema } from "./admin.validation.js";
import { validate } from "../../middlewares/validate.middleware.js";

const router = Router();

router.get("/dashboard", authenticate, authorize("ADMIN"), getAdminDashboard);
router.get("/users", authenticate, authorize("ADMIN"), getAdminUsers);
router.get("/places", authenticate, authorize("ADMIN"), getAdminPlaces);
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
router.patch(
  "/places/:id/approve",
  authenticate,
  authorize("ADMIN"),
  approvePlaceController,
);

router.patch(
  "/places/:id/reject",
  authenticate,
  authorize("ADMIN"),
  rejectPlaceController,
);
router.get("/places/:id", authenticate, authorize("ADMIN"), getAdminPlaceById);
router.patch(
  "/places/:id/status",
  authenticate,
  authorize("ADMIN"),
  updateAdminPlaceStatus,
);
router.delete(
  "/places/:id",
  authenticate,
  authorize("ADMIN"),
  deleteAdminPlace,
);
router.delete("/users/:id", authenticate, authorize("ADMIN"), deleteAdminUser);

export default router;
