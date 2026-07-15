import { Router } from "express";

import { getAdminDashboard, getAdminUsers } from "./admin.controller.js";

import { authenticate } from "../../middlewares/auth.middleware.js";
import { authorize } from "../../middlewares/authorize.middleware.js";

const router = Router();

router.get("/dashboard", authenticate, authorize("ADMIN"), getAdminDashboard);
router.get("/users", authenticate, authorize("ADMIN"), getAdminUsers);

export default router;
