import { Cart } from "./cart.model.js";

export const CartRepository = {
  findCartByUserId: async (userId, session = null) => {
    let query = Cart.findOne({ user: userId, is_deleted: false });
    if (session) query = query.session(session);
    return await query;
  },

  findCartAndPopulate: async (userId) => {
    return await Cart.findOne({ user: userId, is_deleted: false }).populate(
      "items.product",
    );
  },

  createCart: async (cartData, session = null) => {
    const cart = new Cart(cartData);
    return await cart.save({ session });
  },

  saveCart: async (cartDoc, session = null) => {
    return await cartDoc.save({ session });
  },
};
