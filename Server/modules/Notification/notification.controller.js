import { NotificationService } from "./notification.service.js";
import { validateObjectId } from "../../utils/validateObjectId.js";

export const getUserNotifications = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const userRole = req.user.role;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;

    const result = await NotificationService.getUserNotifications(
      userId,
      userRole,
      page,
      limit,
    );

    res.status(200).json({
      message: "Notifications fetched successfully",
      data: result.notifications,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
};

export const markNotificationAsRead = async (req, res, next) => {
  try {
    const { id } = req.params;
    validateObjectId(id, "notification id");

    const userId = req.user._id;
    const userRole = req.user.role;

    const notification = await NotificationService.markAsRead(
      id,
      userId,
      userRole,
    );

    res.status(200).json({
      message: "Notification marked as read",
      data: notification,
    });
  } catch (error) {
    next(error);
  }
};

export const markAllNotificationsAsRead = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const userRole = req.user.role;

    await NotificationService.markAllAsRead(userId, userRole);

    res.status(200).json({
      message: "All notifications marked as read",
    });
  } catch (error) {
    next(error);
  }
};

export const getUnreadNotificationsCount = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const userRole = req.user.role;

    const unreadCount = await NotificationService.getUnreadCount(
      userId,
      userRole,
    );

    res.status(200).json({
      message: "Unread notifications count fetched successfully",
      unreadCount,
    });
  } catch (error) {
    next(error);
  }
};
