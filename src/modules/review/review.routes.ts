import { Router } from "express";

import { authenticate } from "../../middlewares/auth.middleware.js";
import { validate } from "../../middlewares/validate.middleware.js";

import { create, getByPlace, update, remove } from "./review.controller.js";

import { createReviewSchema, updateReviewSchema } from "./review.validation.js";

const router = Router();

router.post("/", authenticate, validate(createReviewSchema), create);
router.get("/place/:placeId", getByPlace);
router.patch("/:id", authenticate, validate(updateReviewSchema), update);
router.delete("/:id", authenticate, remove);

export default router;
