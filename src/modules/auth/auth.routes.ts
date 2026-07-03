import { Router } from "express";
import {
  register,
  login,
} from "./auth.controller.js";
import { authenticate } from "../../middlewares/auth.middleware.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);

router.get("/test", authenticate, (req, res) => {
  res.json({
    success: true,
    message: "Middleware working",
  });
});

export default router;