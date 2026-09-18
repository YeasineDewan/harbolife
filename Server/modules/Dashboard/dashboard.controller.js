import { DashboardService } from "./dashboard.service.js";
import { InternalServerError } from "../../utils/errors.js";

export const GetDashboardStatsController = async (req, res, next) => {
  try {
    const stats = await DashboardService.getDashboardStats();
    res.status(200).json({
      message: "Dashboard summary stats fetched successfully",
      stats,
    });
  } catch (error) {
    next(
      new InternalServerError(
        "Failed to fetch dashboard stats: " + error.message,
      ),
    );
  }
};

export const GetRevenueForecastController = async (req, res, next) => {
  try {
    const result = await DashboardService.getRevenueForecast();
    res.status(200).json({
      message: "Revenue forecast generated successfully",
      ...result,
    });
  } catch (error) {
    next(
      new InternalServerError(
        "Failed to generate revenue forecast: " + error.message,
      ),
    );
  }
};

export const GetCustomerSegmentsController = async (req, res, next) => {
  try {
    const result = await DashboardService.getCustomerSegments();

    if (result.clusters.length === 0) {
      return res.status(200).json({
        message:
          "Insufficient customer data to run clustering (minimum 3 active customers required)",
        clusters: [],
        userAssignments: [],
      });
    }

    res.status(200).json({
      message: "Customer segmentation completed successfully",
      clusters: result.clusters,
      userAssignments: result.userAssignments,
    });
  } catch (error) {
    next(
      new InternalServerError("Failed to segment customers: " + error.message),
    );
  }
};

export const GetProductBundlesController = async (req, res, next) => {
  try {
    const rules = await DashboardService.getProductBundles();

    if (rules.length === 0) {
      return res.status(200).json({
        message: "No strong product association rules found.",
        rules: [],
      });
    }

    res.status(200).json({
      message: "Product bundles/association rules mined successfully",
      rules,
    });
  } catch (error) {
    next(
      new InternalServerError(
        "Failed to mine product bundles: " + error.message,
      ),
    );
  }
};

export const GetInventoryVelocityController = async (req, res, next) => {
  try {
    const products = await DashboardService.getInventoryVelocity();
    res.status(200).json({
      message: "Inventory velocity analysis completed successfully",
      products,
    });
  } catch (error) {
    next(
      new InternalServerError(
        "Failed to analyze inventory velocity: " + error.message,
      ),
    );
  }
};
