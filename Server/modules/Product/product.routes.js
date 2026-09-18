import { Router } from "express";
import { validate } from "../../middleware/validate.middleware.js";
import { checkRole } from "../../middleware/check_roles.middleware.js";
import { authMiddleware } from "../../middleware/auth.middlware.js";
import { uploadSingle } from "../../middleware/upload.middleware.js";
import {
  CreateProductSchema,
  UpdateProductSchema,
} from "./product.validation.js";
import {
  createProductController,
  DeleteProductController,
  GetAllProductsController,
  GetOneProductController,
  updateProductController,
  GetSavedProductsController,
  ToggleSavedProductController,
} from "./product.controller.js";

const router = Router();

router.post(
  "/",
  authMiddleware,
  checkRole(["admin", "super_admin"]),
  uploadSingle("image"),
  validate(CreateProductSchema),
  createProductController,
);

router.delete(
  "/:id",
  authMiddleware,
  checkRole(["admin", "super_admin"]),
  DeleteProductController,
);

router.patch(
  "/:id",
  authMiddleware,
  checkRole(["admin", "super_admin"]),
  uploadSingle("image"),
  validate(UpdateProductSchema),
  updateProductController,
);

router.get("/", GetAllProductsController);
router.get("/saved-items", authMiddleware, GetSavedProductsController);
router.post(
  "/saved-items/:productId",
  authMiddleware,
  ToggleSavedProductController,
);
router.get("/:id", GetOneProductController);

export { router as ProductRouter };
