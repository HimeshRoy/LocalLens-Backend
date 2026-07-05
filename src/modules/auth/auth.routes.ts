import { Router } from "express";
import { register, login, checkUsername } from "./auth.controller.js";
import { authenticate } from "../../middlewares/auth.middleware.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { checkUsernameSchema } from "./auth.validation.js";

const router = Router();

router.get("/check-username", validate(checkUsernameSchema), checkUsername);
router.post("/register", register);
router.post("/login", login);

router.get("/test", authenticate, (req, res) => {
  res.json({
    success: true,
    message: "Middleware working",
  });
});

export default router;
