import { OrderService } from "../Order/order.service.js";
import { ProductService } from "../Product/product.service.js";
import { UserService } from "../User/user.service.js";
import {
  performLinearRegression,
  performKMeans,
  performApriori,
} from "../../services/ai.service.js";

export const DashboardService = {
  getDashboardStats: async () => {
    const orderStats = await OrderService.getDashboardOrderStats();
    const totalRevenue = orderStats[0]?.totalRevenue || 0;
    const totalOrders = orderStats[0]?.count || 0;

    const totalProducts = await ProductService.countProducts({
      is_deleted: false,
    });

    const totalUsers = await UserService.countUsers({
      is_deleted: false,
    });

    const lowStockCount = await ProductService.countProducts({
      is_deleted: false,
      stock: { $lt: 10 },
    });

    const pendingOrdersCount = await OrderService.countOrders({
      is_deleted: false,
      status: "pending",
    });

    return {
      totalRevenue: parseFloat(totalRevenue.toFixed(2)),
      totalOrders,
      totalProducts,
      totalUsers,
      lowStockCount,
      pendingOrdersCount,
    };
  },

  getRevenueForecast: async () => {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);

    const dailyStats = await OrderService.getDailyRevenue(startDate);
    const statsMap = new Map(dailyStats.map((item) => [item._id, item]));
    const historical = [];
    const points = [];

    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];
      const stat = statsMap.get(dateStr) || { revenue: 0, ordersCount: 0 };

      historical.push({
        date: dateStr,
        revenue: parseFloat(stat.revenue.toFixed(2)),
        ordersCount: stat.ordersCount,
      });

      points.push({
        x: 29 - i,
        y: stat.revenue,
        dateStr,
      });
    }

    const regressionResult = performLinearRegression(points, 7);

    return {
      historical,
      forecast: regressionResult.forecast,
      trend: {
        slope: regressionResult.slope,
        intercept: regressionResult.intercept,
        correlation: regressionResult.correlation,
        trendType: regressionResult.trendType,
      },
    };
  },

  getCustomerSegments: async () => {
    const userStats = await OrderService.getUserRFMStats();

    if (userStats.length < 3) {
      return {
        clusters: [],
        userAssignments: [],
      };
    }

    const now = new Date();
    const data = userStats.map((u) => {
      const recencyMs = now - new Date(u.lastOrderDate);
      const recencyDays = Math.max(
        0,
        Math.floor(recencyMs / (1000 * 60 * 60 * 24)),
      );
      return {
        id: u._id.toString(),
        features: [recencyDays, u.orderCount, u.totalSpend],
      };
    });

    const { clusters, userAssignments } = performKMeans(data, 3);

    const userIds = userAssignments.map((ua) => ua.userId);
    const users = await UserService.getUsersByIds(userIds, "name email");
    const userMap = new Map(users.map((u) => [u._id.toString(), u]));

    const populatedAssignments = userAssignments.map((ua) => ({
      ...ua,
      user: userMap.get(ua.userId) || {
        name: "Unknown User",
        email: "Unknown Email",
      },
    }));

    return {
      clusters,
      userAssignments: populatedAssignments,
    };
  },

  getProductBundles: async () => {
    const orders = await OrderService.getOrdersBaskets();
    const baskets = orders.map((order) =>
      order.items.map((item) => item.product.toString()),
    );

    const rules = performApriori(baskets, 0.01, 0.1);

    if (rules.length === 0) {
      return [];
    }

    const productIds = Array.from(
      new Set(rules.flatMap((r) => [r.antecedent, r.consequent])),
    );

    const products = await ProductService.getProductsByIds(
      productIds,
      "name price image category",
    );
    const productMap = new Map(products.map((p) => [p._id.toString(), p]));

    const populatedRules = rules
      .map((r) => ({
        ...r,
        antecedentProduct: productMap.get(r.antecedent),
        consequentProduct: productMap.get(r.consequent),
      }))
      .filter((r) => r.antecedentProduct && r.consequentProduct);

    return populatedRules.slice(0, 15);
  },

  getInventoryVelocity: async () => {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);

    const salesAggregation = await OrderService.getSalesAggregation(startDate);
    const salesMap = new Map(
      salesAggregation.map((s) => [s._id.toString(), s.unitsSold]),
    );

    const products = await ProductService.getActiveProducts(
      "name stock price image",
    );

    const analysis = products.map((prod) => {
      const unitsSold = salesMap.get(prod._id.toString()) || 0;
      const dailyVelocity = parseFloat((unitsSold / 30).toFixed(4));

      let daysRemaining = Infinity;
      let status = "Healthy";

      if (dailyVelocity > 0) {
        daysRemaining = parseFloat((prod.stock / dailyVelocity).toFixed(1));
        if (daysRemaining <= 7) {
          status = "Immediate Reorder";
        } else if (daysRemaining <= 15) {
          status = "Warning";
        }
      } else if (prod.stock === 0) {
        daysRemaining = 0;
        status = "Out of Stock";
      }

      return {
        productId: prod._id,
        name: prod.name,
        stock: prod.stock,
        price: prod.price,
        image: prod.image,
        unitsSoldLast30Days: unitsSold,
        dailyVelocity,
        daysRemaining,
        status,
      };
    });

    analysis.sort((a, b) => {
      if (a.status === "Out of Stock" && b.status !== "Out of Stock") return -1;
      if (b.status === "Out of Stock" && a.status !== "Out of Stock") return 1;
      return a.daysRemaining - b.daysRemaining;
    });

    return analysis;
  },
};
