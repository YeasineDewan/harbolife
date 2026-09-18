import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middlware.js";
import { checkRole } from "../../middleware/check_roles.middleware.js";
import {
  GetUserProfileController,
  UpdateAvatarController,
  UpdateUserController,
  CreateUserController,
  GetAllUsersController,
  DeleteUserController,
  ToggleUserActiveController,
  GetUserByIdController,
  UpdateUserRoleController,
  GetCouriersListController,
} from "./user.controller.js";
import {
  processImage,
  uploadSingle,
} from "../../middleware/upload.middleware.js";
import {
  updateProfileSchema,
  createUserSchema,
  toggleActiveSchema,
} from "./user.validations.js";
import { validate } from "../../middleware/validate.middleware.js";

const router = Router();

router.use(authMiddleware);

router.get("/me", GetUserProfileController);

router.patch(
  "/update-profile/:id",
  validate(updateProfileSchema),
  UpdateUserController,
);

router.patch(
  "/update-avatar",
  uploadSingle("avatar"),
  processImage({ width: 300, height: 300 }),
  UpdateAvatarController,
);

router.post(
  "/create",
  checkRole("super_admin", "admin"),
  validate(createUserSchema),
  CreateUserController,
);

router.get(
  "/couriers/list",
  checkRole(["admin", "super_admin"]),
  GetCouriersListController,
);

router.get("/:id", checkRole("super_admin", "admin"), GetUserByIdController);

router.get("/", checkRole("super_admin", "admin"), GetAllUsersController);

router.delete("/:id", checkRole("super_admin", "admin"), DeleteUserController);

router.patch(
  "/:id/status",
  checkRole("super_admin", "admin"),
  validate(toggleActiveSchema),
  ToggleUserActiveController,
);

router.patch(
  "/:id/role",
  checkRole("super_admin", "admin"),
  UpdateUserRoleController,
);

export { router as UserRouter };
