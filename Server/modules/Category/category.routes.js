import { Router } from "express";
import { checkRole } from "../../middleware/check_roles.middleware.js";
import { authMiddleware } from "../../middleware/auth.middlware.js";
import {
  createCategoryController,
  deleteCategoryController,
  getAllCategoriesController,
  getOneCategoryController,
  updateCategoryController,
  getCategoryBySlugController,
} from "./category.controller.js";
import {
  processImage,
  uploadSingle,
} from "../../middleware/upload.middleware.js";
import { validate } from "../../middleware/validate.middleware.js";
import {
  createCategorySchema,
  updateCategorySchema,
} from "./category.validation.js";

const router = Router();

router.post(
  "/",
  authMiddleware,
  checkRole(["admin", "super_admin"]),
  uploadSingle("img"),
  processImage({}),
  validate(createCategorySchema),
  createCategoryController,
);

router.delete(
  "/:id",
  authMiddleware,
  checkRole(["admin", "super_admin"]),
  deleteCategoryController,
);

router.patch(
  "/:id",
  authMiddleware,
  checkRole(["admin", "super_admin"]),
  uploadSingle("img"),
  processImage({}),
  validate(updateCategorySchema),
  updateCategoryController,
);

router.get("/", getAllCategoriesController);
router.get("/slug/:slug", getCategoryBySlugController);
router.get("/:id", getOneCategoryController);

export { router as CategoryRouter };
