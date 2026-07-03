import { Router } from "express";
import { create, getAll, getById, update, remove } from "./category.controller.js";
import { validate } from "../../middlewares/validate.middleware.js";
import {
  createCategorySchema,
  updateCategorySchema,
} from "./category.validation.js";

const router = Router();

router.post("/",validate(createCategorySchema), create);
router.get("/", getAll);
router.get("/:id", getById);
router.patch("/:id",validate(updateCategorySchema), update);
router.delete("/:id", remove);

export default router;
