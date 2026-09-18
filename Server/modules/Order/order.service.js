import mongoose from "mongoose";
import { OrderRepository } from "./order.repository.js";
import { ProductService } from "../Product/product.service.js";
import { UserService } from "../User/user.service.js";
import { CartService } from "../Cart/cart.service.js";
import {
  BadRequestError,
  NotFoundError,
  ConflictError,
} from "../../utils/errors.js";
import { NotificationService } from "../Notification/notification.service.js";
import {
  authenticatePaymob,
  createPaymobOrder,
  generatePaymentKey,
} from "../../services/paymob.service.js";

export const OrderService = {
  createOrder: async (userId, items, address, paymentMethod) => {
    const session = await mongoose.startSession();
    try {
      const productIds = items.map((item) => item.product);
      const uniqueProductIds = [
        ...new Set(productIds.map((id) => id.toString())),
      ];

      const products = await ProductService.getProductsByIds(uniqueProductIds);
      if (products.length !== uniqueProductIds.length) {
        throw new NotFoundError("One or more products not found");
      }

      const requiredQuantities = {};
      let total = 0;
      const orderItems = [];

      for (const item of items) {
        const product = products.find(
          (p) => p._id.toString() === item.product.toString(),
        );
        const unit = item.unit || "box";
        const qty = item.quantity;

        if (!requiredQuantities[product._id]) {
          requiredQuantities[product._id] = { boxes: 0, strips: 0 };
        }

        if (unit === "box") {
          requiredQuantities[product._id].boxes += qty;
        } else {
          requiredQuantities[product._id].strips += qty;
        }

        let itemPrice = product.price;
        if (unit === "strip") {
          itemPrice = Number(
            (product.price / (product.strips_per_box || 1)).toFixed(2),
          );
        }

        total += itemPrice * qty;
        orderItems.push({
          product: product._id,
          quantity: qty,
          unit: unit,
          price: itemPrice,
        });
      }

      session.startTransaction();

      const updatedProducts = [];
      for (const prodId in requiredQuantities) {
        const reqData = requiredQuantities[prodId];
        const productDoc = await ProductService.getProductByIdForTransaction(
          prodId,
          session,
        );

        if (productDoc.has_strips && productDoc.strips_per_box > 0) {
          const totalRequestedStrips =
            reqData.boxes * productDoc.strips_per_box + reqData.strips;
          const totalAvailableStrips =
            productDoc.stock * productDoc.strips_per_box +
            productDoc.strip_count;

          if (totalAvailableStrips < totalRequestedStrips) {
            throw new ConflictError(
              `Stock insufficient for product: ${productDoc.name}`,
            );
          }

          const newTotalStrips = totalAvailableStrips - totalRequestedStrips;
          productDoc.stock = Math.floor(
            newTotalStrips / productDoc.strips_per_box,
          );
          productDoc.strip_count = newTotalStrips % productDoc.strips_per_box;
        } else {
          if (productDoc.stock < reqData.boxes) {
            throw new ConflictError(
              `Stock insufficient for product: ${productDoc.name}`,
            );
          }
          productDoc.stock -= reqData.boxes;
        }

        await productDoc.save({ session });
        updatedProducts.push(productDoc);
      }

      const [newOrder] = await OrderRepository.createOrder(
        {
          user: userId,
          items: orderItems,
          total,
          address,
          status: "pending",
          paymentMethod,
          paymentStatus: "pending",
        },
        session,
      );

      if (paymentMethod === "COD") {
        await CartService.clearCart(userId, session);
      }

      await session.commitTransaction();
      session.endSession();

      for (const prod of updatedProducts) {
       NotificationService.checkAndNotifyLowStock(prod).catch((err) =>
          console.error(
            "Low stock check error from order placement:",
            err.message,
          ),
        );
      }

      const user = await UserService.getUserById(userId);

      if (paymentMethod === "COD") {
        return { message: "Order created successfully", order: newOrder };
      } else {
        if (!user) throw new NotFoundError("User not found");

        const authToken = await authenticatePaymob();
        const populatedItems = orderItems.map((item) => {
          const product = products.find(
            (p) => p._id.toString() === item.product.toString(),
          );
          const nameSuffix = item.unit === "strip" ? " (Strip)" : " (Box)";
          return {
            name: (product?.name || "Product") + nameSuffix,
            price: item.price,
            quantity: item.quantity,
          };
        });

        const totalCents = Math.round(total * 100);
        const paymobOrderId = await createPaymobOrder(
          authToken,
          totalCents,
          newOrder._id,
          populatedItems,
        );

        const names = user.name.split(" ");
        const billingData = {
          first_name: names[0] || "Guest",
          last_name: names.slice(1).join(" ") || "Customer",
          email: user.email || "no-email@rochetta.com",
          phone_number: address.phone || user.phone || "01000000000",
          street: address.street || "NA",
          building: "NA",
          apartment: "NA",
          floor: "NA",
          city: address.city || "NA",
          country: "EG",
          postal_code: address.postalCode || "NA",
        };

        const paymentKey = await generatePaymentKey(
          authToken,
          totalCents,
          paymobOrderId,
          billingData,
        );

        newOrder.paymobOrderId = paymobOrderId.toString();
        await OrderRepository.saveOrder(newOrder);

        const checkoutUrl = `https://accept.paymob.com/api/acceptance/iframes/${process.env.PAYMOB_IFRAME_ID}?payment_token=${paymentKey}`;

        return {
          message: "Order created successfully. Redirecting to payment...",
          order: newOrder,
          checkoutUrl,
        };
      }
    } catch (error) {
      if (session.inTransaction()) {
        await session.abortTransaction();
      }
      session.endSession();
      if (error.statusCode && error.statusCode !== 500) throw error;
      throw new BadRequestError(
        "Failed to initiate online payment: " + error.message,
      );
    }
  },

  getUserOrders: async (userId) => {
    return await OrderRepository.findUserOrders(userId);
  },

  cancelOrder: async (orderId, userId) => {
    const session = await mongoose.startSession();
    try {
      session.startTransaction();

      const order = await OrderRepository.findOrderByIdAndUser(
        orderId,
        userId,
        session,
      );
      if (!order) throw new NotFoundError("Order not found");
      if (order.status === "canceled")
        throw new BadRequestError("Order already canceled");

      for (const it of order.items) {
        const prodId = it.product?._id ? it.product._id : it.product;
        if (!prodId) continue;
        await ProductService.updateProductStock(
          prodId,
          it.quantity || 0,
          session,
        );
      }

      order.status = "canceled";
      order.is_deleted = true;
      await OrderRepository.saveOrder(order, session);

      await session.commitTransaction();
      session.endSession();

      return await order.populate(
        "items.product",
        "name price stock stripsPerBox",
      );
    } catch (error) {
      if (session.inTransaction()) {
        await session.abortTransaction();
      }
      session.endSession();
      throw error;
    }
  },

  getAllOrdersAdmin: async (filters, pagination) => {
    const { status, minTotal, maxTotal, startDate, endDate, search } = filters;
    const { page, limit } = pagination;
    const skip = (page - 1) * limit;

    let query = { is_deleted: false };

    if (status) query.status = status;

    if (minTotal || maxTotal) {
      query.total = {};
      if (minTotal) query.total.$gte = parseFloat(minTotal);
      if (maxTotal) query.total.$lte = parseFloat(maxTotal);
    }

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    if (search) {
      const searchOrConditions = [];
      if (mongoose.Types.ObjectId.isValid(search)) {
        searchOrConditions.push({ _id: search });
      }

      const searchRegex = { $regex: search, $options: "i" };
      const matchedUsers = await UserService.searchUsersIdsByName(searchRegex);
      if (matchedUsers.length > 0) {
        searchOrConditions.push({
          user: { $in: matchedUsers.map((u) => u._id) },
        });
      }

      const matchedProducts =
        await ProductService.searchProductsIdsByName(searchRegex);
      if (matchedProducts.length > 0) {
        searchOrConditions.push({
          "items.product": { $in: matchedProducts.map((p) => p._id) },
        });
      }

      searchOrConditions.push(
        { "address.street": searchRegex },
        { "address.city": searchRegex },
      );

      query.$or = searchOrConditions;
    }

    const totalOrders = await OrderRepository.countAdminOrders(query);
    const orders = await OrderRepository.findAdminOrders(query, skip, limit);

    return {
      orders,
      pagination: {
        totalOrders,
        totalPages: Math.ceil(totalOrders / limit),
        currentPage: page,
        limit,
      },
    };
  },

  getOrderByIdAdmin: async (orderId) => {
    const order = await OrderRepository.findOrderByIdAdmin(orderId);
    if (!order) throw new NotFoundError("Order not found");
    return order;
  },

  updateOrderStatus: async (orderId, status, userId, userRole) => {
    const session = await mongoose.startSession();
    try {
      session.startTransaction();

      const query = { _id: orderId, is_deleted: false };
      if (userRole !== "admin" && userRole !== "super_admin") {
        query.courier = userId;
      }

      let order = await OrderRepository.findOrderById(query._id, session);
      if (
        query.courier &&
        order.courier.toString() !== query.courier.toString()
      )
        order = null;

      if (!order)
        throw new NotFoundError(
          "Order not found or you don't have permission to update it",
        );
      if (order.status === "canceled")
        throw new BadRequestError("Cannot update status of a canceled order");
      if (order.status === status)
        throw new BadRequestError(`Order status is already ${status}`);

      if (status === "canceled") {
        for (const it of order.items) {
          const prodId = it.product?._id ? it.product._id : it.product;
          if (!prodId) continue;
          await ProductService.updateProductStock(
            prodId,
            it.quantity || 0,
            session,
          );
        }
        order.canceledAt = new Date();
      } else if (status === "shipped") {
        order.shippedAt = new Date();
      } else if (status === "delivered") {
        order.deliveredAt = new Date();
      }

      order.status = status;
      await OrderRepository.saveOrder(order, session);

      await session.commitTransaction();
      session.endSession();

      await order.populate("user", "name phone email");
      await order.populate("items.product", "name image price");

      return order;
    } catch (error) {
      if (session.inTransaction()) {
        await session.abortTransaction();
      }
      session.endSession();
      throw error;
    }
  },

  handlePaymobWebhook: async (hmac, obj) => {
    if (!hmac || !obj)
      throw new BadRequestError("Missing hmac or transaction object");

    const merchantOrderId = obj.order?.merchant_order_id;
    const paymobOrderId = obj.order?.id || obj.order;

    if (!merchantOrderId && !paymobOrderId) {
      throw new BadRequestError("Missing merchant_order_id and order ID");
    }

    const orderIdToSearch = mongoose.Types.ObjectId.isValid(merchantOrderId)
      ? merchantOrderId
      : null;
    const order = await OrderRepository.findOrderByIdOrPaymob(
      orderIdToSearch,
      paymobOrderId,
    );

    if (!order) throw new NotFoundError("Order not found");

    const success = obj.success === true || obj.success === "true";
    const pending = obj.pending === true || obj.pending === "true";

    if (success && !pending) {
      if (order.paymentStatus !== "paid") {
        order.paymentStatus = "paid";
        order.status = "pending";
        await OrderRepository.saveOrder(order);

        await CartService.clearCart(order.user);

        await NotificationService.createNotification({
          title: "New Online Payment Received 💳",
          message: `Payment of EGP ${order.total} successful for Order #${order._id}.`,
          type: "order",
          recipientRole: "admin",
          metadata: { orderId: order._id, total: order.total },
        });
      }
    } else if (!pending) {
      if (order.paymentStatus !== "failed" && order.status !== "canceled") {
        order.paymentStatus = "failed";
        order.status = "canceled";
        order.canceledAt = new Date();
        await OrderRepository.saveOrder(order);

        for (const item of order.items) {
          const prodId = item.product?._id || item.product;
          if (prodId) {
            await ProductService.updateProductStock(prodId, item.quantity || 0);
          }
        }

        await NotificationService.createNotification({
          title: "Payment Failed ❌",
          message: `We were unable to process your payment for Order #${order._id}. The order has been canceled.`,
          type: "order",
          recipient: order.user,
          metadata: { orderId: order._id },
        });
      }
    }
  },

  assignOrderToCourier: async (orderId, courierId) => {
    const order = await OrderRepository.findOrderById(orderId);
    if (!order) throw new NotFoundError("Order not found");

    const courier = await UserService.findCourierById(courierId);
    if (!courier) throw new NotFoundError("Courier not found or invalid");

    order.courier = courierId;
    await OrderRepository.saveOrder(order);

    return order;
  },

  getCourierOrders: async (courierId, status) => {
    const query = { courier: courierId, is_deleted: false };
    if (status) query.status = status;

    return await OrderRepository.findCourierOrders(query);
  },

  deleteOrderAdmin: async (orderId) => {
    const session = await mongoose.startSession();
    try {
      session.startTransaction();

      const order = await OrderRepository.findOrderById(orderId, session);
      if (!order) throw new NotFoundError("Order not found or already deleted");

      if (order.status !== "canceled") {
        for (const it of order.items) {
          const prodId = it.product?._id ? it.product._id : it.product;
          if (!prodId) continue;
          await ProductService.updateProductStock(
            prodId,
            it.quantity || 0,
            session,
          );
        }
      }

      order.is_deleted = true;
      await OrderRepository.saveOrder(order, session);

      await session.commitTransaction();
      session.endSession();
    } catch (error) {
      if (session.inTransaction()) {
        await session.abortTransaction();
      }
      session.endSession();
      throw error;
    }
  },
  getDashboardOrderStats: async () =>
    await OrderRepository.getDashboardOrderStats(),

  countOrders: async (query) => await OrderRepository.countOrders(query),

  getDailyRevenue: async (startDate) =>
    await OrderRepository.getDailyRevenue(startDate),

  getUserRFMStats: async () => await OrderRepository.getUserRFMStats(),

  getOrdersBaskets: async () => await OrderRepository.getOrdersBaskets(),

  getSalesAggregation: async (startDate) =>
    await OrderRepository.getSalesAggregation(startDate),
};
