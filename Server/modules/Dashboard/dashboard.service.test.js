import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { DashboardService } from "./dashboard.service.js";
import { OrderService } from "../Order/order.service.js";
import { ProductService } from "../Product/product.service.js";
import { UserService } from "../User/user.service.js";
import {
  performLinearRegression,
  performKMeans,
  performApriori,
} from "../../services/ai.service.js";

vi.mock("../Order/order.service.js");
vi.mock("../Product/product.service.js");
vi.mock("../User/user.service.js");
vi.mock("../../services/ai.service.js");

describe("DashboardService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-05-15T12:00:00Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("getDashboardStats", () => {
    it("should aggregate stats correctly with valid data", async () => {
      OrderService.getDashboardOrderStats.mockResolvedValue([
        { totalRevenue: 1500.555, count: 50 },
      ]);
      ProductService.countProducts
        .mockResolvedValueOnce(200)
        .mockResolvedValueOnce(15);
      UserService.countUsers.mockResolvedValue(100);
      OrderService.countOrders.mockResolvedValue(5);

      const result = await DashboardService.getDashboardStats();

      expect(result).toEqual({
        totalRevenue: 1500.56,
        totalOrders: 50,
        totalProducts: 200,
        totalUsers: 100,
        lowStockCount: 15,
        pendingOrdersCount: 5,
      });

      expect(OrderService.getDashboardOrderStats).toHaveBeenCalled();
      expect(ProductService.countProducts).toHaveBeenCalledTimes(2);
      expect(UserService.countUsers).toHaveBeenCalled();
      expect(OrderService.countOrders).toHaveBeenCalled();
    });

    it("should handle empty stats safely", async () => {
      OrderService.getDashboardOrderStats.mockResolvedValue([]);
      ProductService.countProducts.mockResolvedValue(0);
      UserService.countUsers.mockResolvedValue(0);
      OrderService.countOrders.mockResolvedValue(0);

      const result = await DashboardService.getDashboardStats();

      expect(result).toEqual({
        totalRevenue: 0,
        totalOrders: 0,
        totalProducts: 0,
        totalUsers: 0,
        lowStockCount: 0,
        pendingOrdersCount: 0,
      });
    });
  });

  describe("getRevenueForecast", () => {
    it("should generate historical data and return forecast", async () => {
      const mockDailyStats = [
        { _id: "2026-05-14", revenue: 500.123, ordersCount: 10 },
      ];
      OrderService.getDailyRevenue.mockResolvedValue(mockDailyStats);

      performLinearRegression.mockReturnValue({
        forecast: [550, 600],
        slope: 10,
        intercept: 50,
        correlation: 0.95,
        trendType: "Upward",
      });

      const result = await DashboardService.getRevenueForecast();

      expect(OrderService.getDailyRevenue).toHaveBeenCalled();
      expect(performLinearRegression).toHaveBeenCalled();
      expect(result.historical).toHaveLength(30);
      expect(result.forecast).toEqual([550, 600]);
      expect(result.trend.trendType).toBe("Upward");

      const yesterdayRecord = result.historical.find(
        (h) => h.date === "2026-05-14",
      );
      expect(yesterdayRecord).toEqual({
        date: "2026-05-14",
        revenue: 500.12,
        ordersCount: 10,
      });
    });
  });

  describe("getCustomerSegments", () => {
    it("should return empty clusters if users are less than 3", async () => {
      OrderService.getUserRFMStats.mockResolvedValue([
        { _id: "1", lastOrderDate: new Date(), orderCount: 1, totalSpend: 100 },
        { _id: "2", lastOrderDate: new Date(), orderCount: 2, totalSpend: 200 },
      ]);

      const result = await DashboardService.getCustomerSegments();

      expect(result).toEqual({ clusters: [], userAssignments: [] });
      expect(performKMeans).not.toHaveBeenCalled();
    });

    it("should perform segmentation and populate user data", async () => {
      const pastDate = new Date("2026-05-05T12:00:00Z");
      OrderService.getUserRFMStats.mockResolvedValue([
        { _id: "u1", lastOrderDate: pastDate, orderCount: 5, totalSpend: 500 },
        { _id: "u2", lastOrderDate: pastDate, orderCount: 1, totalSpend: 50 },
        {
          _id: "u3",
          lastOrderDate: pastDate,
          orderCount: 10,
          totalSpend: 1000,
        },
      ]);

      performKMeans.mockReturnValue({
        clusters: [{ id: 1 }, { id: 2 }, { id: 3 }],
        userAssignments: [
          { userId: "u1", cluster: 1 },
          { userId: "u2", cluster: 2 },
          { userId: "u3", cluster: 3 },
        ],
      });

      UserService.getUsersByIds.mockResolvedValue([
        { _id: "u1", name: "User 1", email: "u1@test.com" },
        { _id: "u3", name: "User 3", email: "u3@test.com" },
      ]);

      const result = await DashboardService.getCustomerSegments();

      expect(performKMeans).toHaveBeenCalled();
      expect(UserService.getUsersByIds).toHaveBeenCalledWith(
        ["u1", "u2", "u3"],
        "name email",
      );
      expect(result.clusters).toHaveLength(3);
      expect(result.userAssignments[0].user.name).toBe("User 1");
      expect(result.userAssignments[1].user.name).toBe("Unknown User");
    });
  });

  describe("getProductBundles", () => {
    it("should return empty array if no rules generated", async () => {
      OrderService.getOrdersBaskets.mockResolvedValue([
        { items: [{ product: "p1" }] },
      ]);
      performApriori.mockReturnValue([]);

      const result = await DashboardService.getProductBundles();

      expect(result).toEqual([]);
      expect(ProductService.getProductsByIds).not.toHaveBeenCalled();
    });

    it("should populate and filter valid product bundles", async () => {
      OrderService.getOrdersBaskets.mockResolvedValue([
        { items: [{ product: "p1" }, { product: "p2" }] },
      ]);

      performApriori.mockReturnValue([
        { antecedent: "p1", consequent: "p2", confidence: 0.8 },
        { antecedent: "p3", consequent: "p4", confidence: 0.5 },
      ]);

      ProductService.getProductsByIds.mockResolvedValue([
        { _id: "p1", name: "Product 1" },
        { _id: "p2", name: "Product 2" },
      ]);

      const result = await DashboardService.getProductBundles();

      expect(ProductService.getProductsByIds).toHaveBeenCalledWith(
        ["p1", "p2", "p3", "p4"],
        "name price image category",
      );
      expect(result).toHaveLength(1);
      expect(result[0].antecedentProduct.name).toBe("Product 1");
      expect(result[0].consequentProduct.name).toBe("Product 2");
    });
  });

  describe("getInventoryVelocity", () => {
    it("should calculate velocity and sort correctly", async () => {
      OrderService.getSalesAggregation.mockResolvedValue([
        { _id: "p1", unitsSold: 60 },
        { _id: "p2", unitsSold: 30 },
      ]);

      ProductService.getActiveProducts.mockResolvedValue([
        { _id: "p1", name: "P1", stock: 10, price: 100 },
        { _id: "p2", name: "P2", stock: 15, price: 200 },
        { _id: "p3", name: "P3", stock: 0, price: 50 },
        { _id: "p4", name: "P4", stock: 100, price: 300 },
      ]);

      const result = await DashboardService.getInventoryVelocity();

      expect(result).toHaveLength(4);

      const outOfStockItem = result[0];
      expect(outOfStockItem.productId).toBe("p3");
      expect(outOfStockItem.status).toBe("Out of Stock");
      expect(outOfStockItem.daysRemaining).toBe(0);

      const p1Data = result.find((r) => r.productId === "p1");
      expect(p1Data.dailyVelocity).toBe(2);
      expect(p1Data.daysRemaining).toBe(5);
      expect(p1Data.status).toBe("Immediate Reorder");

      const p2Data = result.find((r) => r.productId === "p2");
      expect(p2Data.dailyVelocity).toBe(1);
      expect(p2Data.daysRemaining).toBe(15);
      expect(p2Data.status).toBe("Warning");

      const p4Data = result.find((r) => r.productId === "p4");
      expect(p4Data.dailyVelocity).toBe(0);
      expect(p4Data.daysRemaining).toBe(Infinity);
      expect(p4Data.status).toBe("Healthy");
    });
  });
});
