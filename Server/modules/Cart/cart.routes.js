import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middlware.js";
import {
  AddToCartController,
  ClearCartController,
  GetUserCartController,
  RemoveFromCartController,
  UpdateCartQuantityController,
} from "./cart.controller.js";

const router = Router();

router.use(authMiddleware);

router.get("/get-user-cart", GetUserCartController);
router.post("/add-to-cart", AddToCartController);
router.delete("/clear-cart", ClearCartController);
router.delete("/:productId", RemoveFromCartController);
router.patch("/:productId", UpdateCartQuantityController);

export { router as CartRouter };
