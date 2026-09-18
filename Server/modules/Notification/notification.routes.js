import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middlware.js";
import {
  getUserNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  getUnreadNotificationsCount,
} from "./notification.controller.js";

const router = Router();

router.use(authMiddleware);

router.get("/", getUserNotifications);
router.get("/unread-count", getUnreadNotificationsCount);
router.patch("/read-all", markAllNotificationsAsRead);
router.patch("/:id/read", markNotificationAsRead);

export { router as NotificationRouter };
