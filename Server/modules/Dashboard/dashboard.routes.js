import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middlware.js";
import { checkRole } from "../../middleware/check_roles.middleware.js";
import {
  GetDashboardStatsController,
  GetRevenueForecastController,
  GetCustomerSegmentsController,
  GetProductBundlesController,
  GetInventoryVelocityController,
} from "./dashboard.controller.js";

const router = Router();

router.use(authMiddleware);
router.use(checkRole(["admin", "super_admin"]));

router.get("/stats", GetDashboardStatsController);
router.get("/revenue-forecast", GetRevenueForecastController);
router.get("/customer-segments", GetCustomerSegmentsController);
router.get("/product-bundles", GetProductBundlesController);
router.get("/inventory-analysis", GetInventoryVelocityController);

export { router as DashboardRouter };
