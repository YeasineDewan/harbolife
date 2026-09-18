import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middlware.js";
import { checkRole } from "../../middleware/check_roles.middleware.js";
import {
  getChatHistory,
  sendMessage,
  clearChatHistory,
} from "./chat.controller.js";

const router = Router();

router.use(authMiddleware);
router.use(checkRole(["user"]));

router.get("/", getChatHistory);
router.post("/", sendMessage);
router.delete("/", clearChatHistory);

export { router as ChatRouter };
