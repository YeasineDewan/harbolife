import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middlware.js";
import { checkRole } from "../../middleware/check_roles.middleware.js";
import {
  CreateOrderController,
  GetUserOrdersController,
  CancelOrderController,
  GetAllOrdersAdminController,
  GetOrderByIdAdminController,
  PaymobWebhookController,
  AssignOrderToCourierController,
  GetCourierOrdersController,
  UpdateOrderStatusController,
  DeleteOrderAdminController,
} from "./order.controller.js";
import { validate } from "../../middleware/validate.middleware.js";
import {
  CreateOrderSchema,
  UpdateOrderStatusSchema,
} from "./order.validation.js";

const router = Router();

router.post("/webhook/paymob", PaymobWebhookController);

router.use(authMiddleware);

router.post(
  "/create-order",
  validate(CreateOrderSchema),
  CreateOrderController,
);
router.get("/", GetUserOrdersController);
router.patch("/:id/cancel", CancelOrderController);

router.get(
  "/courier/my-orders",
  checkRole(["courier"]),
  GetCourierOrdersController,
);

router.patch(
  "/:id/assign",
  checkRole(["admin", "super_admin"]),
  AssignOrderToCourierController,
);

router.get(
  "/all-orders",
  checkRole(["admin", "super_admin"]),
  GetAllOrdersAdminController,
);
router.get(
  "/:id",
  checkRole(["admin", "super_admin", "courier"]),
  GetOrderByIdAdminController,
);
router.patch(
  "/:id/status",
  checkRole(["admin", "super_admin", "courier"]),
  validate(UpdateOrderStatusSchema),
  UpdateOrderStatusController,
);
router.delete(
  "/:id",
  checkRole(["admin", "super_admin"]),
  DeleteOrderAdminController,
);

export { router as OrderRouter };
