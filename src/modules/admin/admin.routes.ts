import { Router } from "express";

import { getAdminDashboard } from "./admin.controller.js";

import { authenticate } from "../../middlewares/auth.middleware.js";
import { authorize } from "../../middlewares/authorize.middleware.js";

const router = Router();

router.get("/dashboard", authenticate, authorize("ADMIN"), getAdminDashboard);

export default router;
