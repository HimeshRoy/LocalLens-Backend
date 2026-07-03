import { Router } from "express";

import { authenticate } from "../../middlewares/auth.middleware.js";
import { validate } from "../../middlewares/validate.middleware.js";

import {
  create,
  getMine,
  addPlace,
  getById,
  removePlace,
  update,
  remove,
} from "./collection.controller.js";
import {
  createCollectionSchema,
  addPlaceToCollectionSchema,
  updateCollectionSchema,
} from "./collection.validation.js";

const router = Router();

router.get("/my", authenticate, getMine);
router.get("/:id", authenticate, getById);
router.post(
  "/:collectionId/places",
  authenticate,
  validate(addPlaceToCollectionSchema),
  addPlace,
);
router.patch(
  "/:collectionId",
  authenticate,
  validate(updateCollectionSchema),
  update,
);

router.delete("/:collectionId", authenticate, remove);
router.delete("/:collectionId/places/:placeId", authenticate, removePlace);
router.post("/", authenticate, validate(createCollectionSchema), create);

export default router;
