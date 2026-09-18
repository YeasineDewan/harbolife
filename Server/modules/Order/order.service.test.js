import { describe, it, expect, vi, beforeEach } from "vitest";
import mongoose from "mongoose";
import { OrderService } from "./order.service.js";
import { OrderRepository } from "./order.repository.js";
import { ProductService } from "../Product/product.service.js";
import { UserService } from "../User/user.service.js";
import { CartService } from "../Cart/cart.service.js";
import { NotificationService } from "../Notification/notification.service.js";
import {
  authenticatePaymob,
  createPaymobOrder,
  generatePaymentKey,
} from "../../services/paymob.service.js";
import {
  BadRequestError,
  NotFoundError,
  ConflictError,
} from "../../utils/errors.js";

vi.mock("./order.repository.js");
vi.mock("../Product/product.service.js");
vi.mock("../User/user.service.js");
vi.mock("../Cart/cart.service.js");
vi.mock("../Notification/notification.service.js");
vi.mock("../../services/email.service.js");
vi.mock("../../services/paymob.service.js");

describe("OrderService", () => {
  const mockUserId = new mongoose.Types.ObjectId().toString();
  const mockOrderId = new mongoose.Types.ObjectId().toString();
  const mockProductId = new mongoose.Types.ObjectId().toString();
  const mockAddress = {
    street: "123 Main St",
    city: "Cairo",
    phone: "01000000000",
  };

  const mockSession = {
    startTransaction: vi.fn(),
    commitTransaction: vi.fn(),
    abortTransaction: vi.fn(),
    endSession: vi.fn(),
    inTransaction: vi.fn().mockReturnValue(true),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(mongoose, "startSession").mockResolvedValue(mockSession);
    NotificationService.checkAndNotifyLowStock.mockResolvedValue();
  });

  describe("createOrder", () => {
    it("should throw NotFoundError if some products are missing", async () => {
      ProductService.getProductsByIds.mockResolvedValue([]);

      await expect(
        OrderService.createOrder(
          mockUserId,
          [{ product: mockProductId, quantity: 1, unit: "box" }],
          mockAddress,
          "COD",
        ),
      ).rejects.toThrow(NotFoundError);
    });

    it("should throw ConflictError if insufficient stock for strip items", async () => {
      const mockProduct = {
        _id: mockProductId,
        name: "Aspirin",
        price: 30,
        has_strips: true,
        strips_per_box: 3,
        stock: 0,
        strip_count: 1,
        save: vi.fn(),
      };

      ProductService.getProductsByIds.mockResolvedValue([mockProduct]);
      ProductService.getProductByIdForTransaction.mockResolvedValue(
        mockProduct,
      );

      await expect(
        OrderService.createOrder(
          mockUserId,
          [{ product: mockProductId, quantity: 2, unit: "strip" }],
          mockAddress,
          "COD",
        ),
      ).rejects.toThrow(ConflictError);

      expect(mockSession.abortTransaction).toHaveBeenCalled();
    });

    it("should create COD order successfully and deduct stock correctly", async () => {
      const mockProduct = {
        _id: mockProductId,
        name: "Panadol",
        price: 30,
        has_strips: true,
        strips_per_box: 3,
        stock: 2,
        strip_count: 1,
        save: vi.fn().mockResolvedValue(true),
      };

      ProductService.getProductsByIds.mockResolvedValue([mockProduct]);
      ProductService.getProductByIdForTransaction.mockResolvedValue(
        mockProduct,
      );

      const createdOrder = {
        _id: mockOrderId,
        user: mockUserId,
        total: 10,
        status: "pending",
        paymentMethod: "COD",
      };
      OrderRepository.createOrder.mockResolvedValue([createdOrder]);
      OrderRepository.findOrderByIdAndPopulate.mockResolvedValue(createdOrder);
      UserService.getUserById.mockResolvedValue({
        _id: mockUserId,
        email: "user@test.com",
        name: "John Doe",
      });

      const result = await OrderService.createOrder(
        mockUserId,
        [{ product: mockProductId, quantity: 1, unit: "strip" }],
        mockAddress,
        "COD",
      );

      expect(mockProduct.stock).toBe(2);
      expect(mockProduct.strip_count).toBe(0);
      expect(mockProduct.save).toHaveBeenCalledWith({ session: mockSession });
      expect(CartService.clearCart).toHaveBeenCalledWith(
        mockUserId,
        mockSession,
      );
      expect(mockSession.commitTransaction).toHaveBeenCalled();
      expect(result.order).toEqual(createdOrder);
    });

    it("should handle online card payment and return checkoutUrl", async () => {
      const mockProduct = {
        _id: mockProductId,
        name: "Vitamin C",
        price: 50,
        has_strips: false,
        stock: 10,
        save: vi.fn().mockResolvedValue(true),
      };

      ProductService.getProductsByIds.mockResolvedValue([mockProduct]);
      ProductService.getProductByIdForTransaction.mockResolvedValue(
        mockProduct,
      );

      const createdOrder = {
        _id: mockOrderId,
        user: mockUserId,
        total: 50,
        status: "pending",
        paymentMethod: "card",
      };
      OrderRepository.createOrder.mockResolvedValue([createdOrder]);
      UserService.getUserById.mockResolvedValue({
        _id: mockUserId,
        email: "user@test.com",
        name: "John Doe",
        phone: "01000000000",
      });

      authenticatePaymob.mockResolvedValue("mock_token");
      createPaymobOrder.mockResolvedValue(99999);
      generatePaymentKey.mockResolvedValue("mock_pay_key");

      const result = await OrderService.createOrder(
        mockUserId,
        [{ product: mockProductId, quantity: 1, unit: "box" }],
        mockAddress,
        "card",
      );

      expect(createdOrder.paymobOrderId).toBe("99999");
      expect(OrderRepository.saveOrder).toHaveBeenCalledWith(createdOrder);
      expect(result.checkoutUrl).toContain("mock_pay_key");
    });
  });

  describe("cancelOrder", () => {
    it("should throw NotFoundError if order not found", async () => {
      OrderRepository.findOrderByIdAndUser.mockResolvedValue(null);

      await expect(
        OrderService.cancelOrder(mockOrderId, mockUserId),
      ).rejects.toThrow(NotFoundError);
    });

    it("should throw BadRequestError if order already canceled", async () => {
      OrderRepository.findOrderByIdAndUser.mockResolvedValue({
        _id: mockOrderId,
        status: "canceled",
      });

      await expect(
        OrderService.cancelOrder(mockOrderId, mockUserId),
      ).rejects.toThrow(BadRequestError);
    });

    it("should cancel order and restore stock successfully", async () => {
      const mockOrder = {
        _id: mockOrderId,
        status: "pending",
        items: [{ product: mockProductId, quantity: 2 }],
        save: vi.fn(),
        populate: vi
          .fn()
          .mockResolvedValue({ _id: mockOrderId, status: "canceled" }),
      };

      OrderRepository.findOrderByIdAndUser.mockResolvedValue(mockOrder);

      const result = await OrderService.cancelOrder(mockOrderId, mockUserId);

      expect(ProductService.updateProductStock).toHaveBeenCalledWith(
        mockProductId,
        2,
        mockSession,
      );
      expect(mockOrder.status).toBe("canceled");
      expect(mockOrder.is_deleted).toBe(true);
      expect(OrderRepository.saveOrder).toHaveBeenCalledWith(
        mockOrder,
        mockSession,
      );
      expect(mockSession.commitTransaction).toHaveBeenCalled();
      expect(result.status).toBe("canceled");
    });
  });

  describe("updateOrderStatus", () => {
    it("should throw NotFoundError if courier tries to access unassigned order", async () => {
      const mockOrder = {
        _id: mockOrderId,
        courier: new mongoose.Types.ObjectId().toString(),
      };
      OrderRepository.findOrderById.mockResolvedValue(mockOrder);

      await expect(
        OrderService.updateOrderStatus(
          mockOrderId,
          "shipped",
          "differentCourierId",
          "courier",
        ),
      ).rejects.toThrow(NotFoundError);
    });

    it("should throw BadRequestError if updating already canceled order", async () => {
      OrderRepository.findOrderById.mockResolvedValue({
        _id: mockOrderId,
        status: "canceled",
      });

      await expect(
        OrderService.updateOrderStatus(
          mockOrderId,
          "shipped",
          mockUserId,
          "admin",
        ),
      ).rejects.toThrow(BadRequestError);
    });

    it("should update order to delivered and set timestamp", async () => {
      const mockOrder = {
        _id: mockOrderId,
        status: "shipped",
        items: [],
        populate: vi.fn().mockResolvedValue(true),
      };
      OrderRepository.findOrderById.mockResolvedValue(mockOrder);

      await OrderService.updateOrderStatus(
        mockOrderId,
        "delivered",
        mockUserId,
        "admin",
      );

      expect(mockOrder.status).toBe("delivered");
      expect(mockOrder.deliveredAt).toBeInstanceOf(Date);
      expect(OrderRepository.saveOrder).toHaveBeenCalledWith(
        mockOrder,
        mockSession,
      );
      expect(mockSession.commitTransaction).toHaveBeenCalled();
    });

    it("should restore stock if status updated to canceled", async () => {
      const mockOrder = {
        _id: mockOrderId,
        status: "pending",
        items: [{ product: mockProductId, quantity: 3 }],
        populate: vi.fn().mockResolvedValue(true),
      };
      OrderRepository.findOrderById.mockResolvedValue(mockOrder);

      await OrderService.updateOrderStatus(
        mockOrderId,
        "canceled",
        mockUserId,
        "admin",
      );

      expect(ProductService.updateProductStock).toHaveBeenCalledWith(
        mockProductId,
        3,
        mockSession,
      );
      expect(mockOrder.status).toBe("canceled");
      expect(mockOrder.canceledAt).toBeInstanceOf(Date);
    });
  });

  describe("handlePaymobWebhook", () => {
    it("should throw BadRequestError on missing payload arguments", async () => {
      await expect(OrderService.handlePaymobWebhook(null, {})).rejects.toThrow(
        BadRequestError,
      );
      await expect(
        OrderService.handlePaymobWebhook("hmac", null),
      ).rejects.toThrow(BadRequestError);
    });

    it("should mark order as paid, clear cart, send email, and create notification on successful payment", async () => {
      const mockOrder = {
        _id: mockOrderId,
        user: mockUserId,
        total: 100,
        paymentStatus: "pending",
        status: "pending",
      };

      OrderRepository.findOrderByIdOrPaymob.mockResolvedValue(mockOrder);
      OrderRepository.findOrderByIdAndPopulate.mockResolvedValue(mockOrder);
      UserService.getUserById.mockResolvedValue({
        _id: mockUserId,
        email: "user@test.com",
        name: "Jane",
      });

      const webhookObj = {
        success: true,
        pending: false,
        order: { id: "paymob_123" },
      };

      await OrderService.handlePaymobWebhook("valid_hmac", webhookObj);

      expect(mockOrder.paymentStatus).toBe("paid");
      expect(OrderRepository.saveOrder).toHaveBeenCalledWith(mockOrder);
      expect(CartService.clearCart).toHaveBeenCalledWith(mockUserId);
      expect(NotificationService.createNotification).toHaveBeenCalledWith(
        expect.objectContaining({
          type: "order",
          recipientRole: "admin",
        }),
      );
    });

    it("should cancel order, restore stock, and notify user on failed payment", async () => {
      const mockOrder = {
        _id: mockOrderId,
        user: mockUserId,
        total: 100,
        paymentStatus: "pending",
        status: "pending",
        items: [{ product: mockProductId, quantity: 2 }],
      };

      OrderRepository.findOrderByIdOrPaymob.mockResolvedValue(mockOrder);

      const webhookObj = {
        success: false,
        pending: false,
        order: { id: "paymob_123" },
      };

      await OrderService.handlePaymobWebhook("valid_hmac", webhookObj);

      expect(mockOrder.paymentStatus).toBe("failed");
      expect(mockOrder.status).toBe("canceled");
      expect(ProductService.updateProductStock).toHaveBeenCalledWith(
        mockProductId,
        2,
      );
      expect(NotificationService.createNotification).toHaveBeenCalledWith(
        expect.objectContaining({
          recipient: mockUserId,
        }),
      );
    });
  });

  describe("assignOrderToCourier", () => {
    it("should throw NotFoundError if courier invalid", async () => {
      OrderRepository.findOrderById.mockResolvedValue({ _id: mockOrderId });
      UserService.findCourierById.mockResolvedValue(null);

      await expect(
        OrderService.assignOrderToCourier(mockOrderId, "invalidCourier"),
      ).rejects.toThrow(NotFoundError);
    });

    it("should assign courier to order successfully", async () => {
      const mockOrder = { _id: mockOrderId, courier: null };
      OrderRepository.findOrderById.mockResolvedValue(mockOrder);
      UserService.findCourierById.mockResolvedValue({ _id: "courier123" });

      const result = await OrderService.assignOrderToCourier(
        mockOrderId,
        "courier123",
      );

      expect(mockOrder.courier).toBe("courier123");
      expect(OrderRepository.saveOrder).toHaveBeenCalledWith(mockOrder);
      expect(result.courier).toBe("courier123");
    });
  });

  describe("deleteOrderAdmin", () => {
    it("should delete order and restore stock if not previously canceled", async () => {
      const mockOrder = {
        _id: mockOrderId,
        status: "pending",
        items: [{ product: mockProductId, quantity: 1 }],
      };

      OrderRepository.findOrderById.mockResolvedValue(mockOrder);

      await OrderService.deleteOrderAdmin(mockOrderId);

      expect(ProductService.updateProductStock).toHaveBeenCalledWith(
        mockProductId,
        1,
        mockSession,
      );
      expect(mockOrder.is_deleted).toBe(true);
      expect(OrderRepository.saveOrder).toHaveBeenCalledWith(
        mockOrder,
        mockSession,
      );
      expect(mockSession.commitTransaction).toHaveBeenCalled();
    });
  });

  describe("getAllOrdersAdmin", () => {
    it("should return paginated admin orders with applied filters", async () => {
      OrderRepository.countAdminOrders.mockResolvedValue(10);
      OrderRepository.findAdminOrders.mockResolvedValue([{ _id: mockOrderId }]);

      const result = await OrderService.getAllOrdersAdmin(
        { status: "pending" },
        { page: 1, limit: 5 },
      );

      expect(result.orders).toHaveLength(1);
      expect(result.pagination).toEqual({
        totalOrders: 10,
        totalPages: 2,
        currentPage: 1,
        limit: 5,
      });
    });
  });
});
