import { Order } from "./order.model.js";

export const OrderRepository = {
  createOrder: async (orderData, session) => {
    return await Order.create([orderData], { session });
  },

  findOrderByIdAndPopulate: async (orderId) => {
    return await Order.findById(orderId).populate(
      "items.product",
      "name price",
    );
  },

  findUserOrders: async (userId) => {
    return await Order.find({ user: userId, is_deleted: false })
      .populate("items.product", "name price stock stripsPerBox")
      .sort({ createdAt: -1 });
  },

  findOrderByIdAndUser: async (orderId, userId, session) => {
    return await Order.findOne({
      _id: orderId,
      user: userId,
      is_deleted: false,
    }).session(session);
  },

  findOrderById: async (orderId, session = null) => {
    let query = Order.findOne({ _id: orderId, is_deleted: false });
    if (session) query = query.session(session);
    return await query;
  },

  findOrderByIdOrPaymob: async (merchantId, paymobId) => {
    const queryConditions = [];
    if (merchantId) queryConditions.push({ _id: merchantId });
    if (paymobId) queryConditions.push({ paymobOrderId: paymobId.toString() });

    return await Order.findOne({ $or: queryConditions, is_deleted: false });
  },

  countAdminOrders: async (query) => {
    return await Order.countDocuments(query);
  },

  findAdminOrders: async (query, skip, limit) => {
    return await Order.find(query)
      .populate("user", "name email")
      .populate("items.product", "name price stock stripsPerBox")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
  },

  findOrderByIdAdmin: async (orderId) => {
    return await Order.findOne({ _id: orderId, is_deleted: false })
      .populate("user", "name email")
      .populate("items.product", "name price stock stripsPerBox");
  },

  findCourierOrders: async (query) => {
    return await Order.find(query)
      .populate("user", "name phone email")
      .populate("items.product", "name image price")
      .sort({ createdAt: -1 })
      .lean();
  },

  saveOrder: async (orderDoc, session = null) => {
    return await orderDoc.save({ session, validateBeforeSave: false });
  },

  getDashboardOrderStats: async () => {
    return await Order.aggregate([
      { $match: { is_deleted: false, status: { $ne: "canceled" } } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$total" },
          count: { $sum: 1 },
        },
      },
    ]);
  },

  countOrders: async (query) => {
    return await Order.countDocuments(query);
  },

  getDailyRevenue: async (startDate) => {
    return await Order.aggregate([
      {
        $match: {
          is_deleted: false,
          status: { $ne: "canceled" },
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          revenue: { $sum: "$total" },
          ordersCount: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);
  },

  getUserRFMStats: async () => {
    return await Order.aggregate([
      { $match: { is_deleted: false, status: { $ne: "canceled" } } },
      {
        $group: {
          _id: "$user",
          totalSpend: { $sum: "$total" },
          orderCount: { $sum: 1 },
          lastOrderDate: { $max: "$createdAt" },
        },
      },
    ]);
  },

  getOrdersBaskets: async () => {
    return await Order.find({
      is_deleted: false,
      status: { $ne: "canceled" },
    }).select("items.product");
  },

  getSalesAggregation: async (startDate) => {
    return await Order.aggregate([
      {
        $match: {
          is_deleted: false,
          status: { $ne: "canceled" },
          createdAt: { $gte: startDate },
        },
      },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.product",
          unitsSold: { $sum: "$items.quantity" },
        },
      },
    ]);
  },
};
