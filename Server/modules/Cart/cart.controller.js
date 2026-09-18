import { CartService } from "./cart.service.js";

export const GetUserCartController = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const cart = await CartService.getUserCart(userId);
    return res
      .status(200)
      .json({ message: "Cart found successfully", data: cart });
  } catch (error) {
    next(error);
  }
};

export const AddToCartController = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { productId, quantity, unit = "box" } = req.body;

    const cart = await CartService.addToCart(userId, productId, quantity, unit);
    return res
      .status(201)
      .json({ message: "Added to cart successfully", data: cart });
  } catch (error) {
    next(error);
  }
};

export const RemoveFromCartController = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { productId } = req.params;
    const { unit = "box" } = req.body;

    const cart = await CartService.removeFromCart(userId, productId, unit);
    return res.status(200).json({ message: "Product removed", data: cart });
  } catch (error) {
    next(error);
  }
};

export const ClearCartController = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const cart = await CartService.clearCart(userId);
    return res.status(200).json({ message: "Cart cleared", data: cart });
  } catch (error) {
    next(error);
  }
};

export const UpdateCartQuantityController = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { productId } = req.params;
    const { quantity, unit = "box" } = req.body;

    const cart = await CartService.updateCartQuantity(
      userId,
      productId,
      quantity,
      unit,
    );
    return res
      .status(200)
      .json({ message: "Cart updated successfully", data: cart });
  } catch (error) {
    next(error);
  }
};
