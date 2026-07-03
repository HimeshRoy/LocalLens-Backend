import { Router } from "express";

import { authenticate } from "../../middlewares/auth.middleware.js";
import { validate } from "../../middlewares/validate.middleware.js";

import { create, getMine, remove } from "./favorite.controller.js";
import { createFavoriteSchema } from "./favorite.validation.js";

const router = Router();

router.get("/", authenticate, getMine);
router.post("/", authenticate, validate(createFavoriteSchema), create);
router.delete("/:placeId", authenticate, remove);

export default router;
