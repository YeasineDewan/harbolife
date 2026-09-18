import { Router } from "express";
import { AuthRouter } from "../modules/Auth/auth.routes.js";
import { CartRouter } from "../modules/Cart/cart.routes.js";
import { CategoryRouter } from "../modules/Category/category.routes.js";
import { ChatRouter } from "../modules/Chat/chat.routes.js";
import { DashboardRouter } from "../modules/Dashboard/dashboard.routes.js";
import { NotificationRouter } from "../modules/Notification/notification.routes.js";
import { OrderRouter } from "../modules/Order/order.routes.js";
import { ProductRouter } from "../modules/Product/product.routes.js";
import { ReviewRouter } from "../modules/Review/review.routes.js";
import { UserRouter } from "../modules/User/user.routes.js";

const router = Router();

router.use("/auth", AuthRouter);
router.use("/cart", CartRouter);
router.use("/categories", CategoryRouter);
router.use("/chat", ChatRouter);
router.use("/dashboard", DashboardRouter);
router.use("/notifications", NotificationRouter);
router.use("/order", OrderRouter);
router.use("/products", ProductRouter);
router.use("/reviews", ReviewRouter);
router.use("/user", UserRouter);

export { router as ApiRouter };
