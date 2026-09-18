import Notification from "./notification.model.js";

export const NotificationRepository = {
  findPaginated: async (query, skip, limit) => {
    return await Notification.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
  },

  countDocuments: async (query) => {
    return await Notification.countDocuments(query);
  },

  findById: async (id) => {
    return await Notification.findById(id);
  },

  updateMany: async (query, updateData) => {
    return await Notification.updateMany(query, updateData);
  },

  saveNotification: async (notificationDoc) => {
    return await notificationDoc.save();
  },

  createNotification: async (notificationData) => {
    const notification = new Notification(notificationData);
    return await notification.save();
  },

  findExistingLowStockAlert: async (productId, stockLevel) => {
    return await Notification.findOne({
      type: "low_stock",
      "metadata.productId": productId.toString(),
      "metadata.stock": stockLevel,
    });
  },
};
