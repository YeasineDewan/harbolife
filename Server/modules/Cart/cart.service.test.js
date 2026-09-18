import { describe, it, expect, vi, beforeEach } from "vitest";
import mongoose from "mongoose";
import { CartService } from "./cart.service.js";
import { CartRepository } from "./cart.repository.js";
import { ProductService } from "../Product/product.service.js";
import { BadRequestError } from "../../utils/errors.js";


vi.mock("./cart.repository.js");
vi.mock("../Product/product.service.js");

describe("CartService", () => {
  const mockUserId = "user123";
  const mockProductId = "prod456";

  beforeEach(() => {
    vi.clearAllMocks();

    vi.spyOn(mongoose, "startSession").mockResolvedValue({
      startTransaction: vi.fn(),
      commitTransaction: vi.fn(),
      abortTransaction: vi.fn(),
      endSession: vi.fn(),
    });
  });

  describe("getUserCart", () => {
    it("should return existing cart", async () => {
      const fakeCart = { user: mockUserId, items: [] };
      CartRepository.findCartAndPopulate.mockResolvedValue(fakeCart);

      const result = await CartService.getUserCart(mockUserId);

      expect(result).toEqual(fakeCart);
      expect(CartRepository.findCartAndPopulate).toHaveBeenCalledWith(
        mockUserId,
      );
    });

    it("should create new cart if it does not exist", async () => {
      CartRepository.findCartAndPopulate
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce({ user: mockUserId, items: [] });
      CartRepository.createCart.mockResolvedValue(true);

      const result = await CartService.getUserCart(mockUserId);

      expect(CartRepository.createCart).toHaveBeenCalled();
      expect(result.user).toBe(mockUserId);
    });
  });

  describe("addToCart", () => {
    const fakeProduct = {
      _id: mockProductId,
      price: 100,
      stock: 10,
      has_strips: true,
      strips_per_box: 3,
      strip_count: 5,
    };

    it("should throw BadRequestError for invalid unit", async () => {
      await expect(
        CartService.addToCart(mockUserId, mockProductId, 1, "invalid_unit"),
      ).rejects.toThrow(BadRequestError);
    });

    it("should throw BadRequestError if product not found", async () => {
      ProductService.getProductByIdForTransaction.mockResolvedValue(null);

      await expect(
        CartService.addToCart(mockUserId, mockProductId, 1, "box"),
      ).rejects.toThrow(BadRequestError);
    });

    it("should add new item to existing cart and commit transaction", async () => {
      ProductService.getProductByIdForTransaction.mockResolvedValue(
        fakeProduct,
      );

      const fakeCart = {
        user: mockUserId,
        items: [],
        total_price: 0,
        populate: vi.fn().mockResolvedValue(true),
      };
      CartRepository.findCartByUserId.mockResolvedValue(fakeCart);

      await CartService.addToCart(mockUserId, mockProductId, 2, "box");

      expect(fakeCart.items.length).toBe(1);
      expect(fakeCart.items[0].quantity).toBe(2);
      expect(fakeCart.total_price).toBe(200);
      expect(CartRepository.saveCart).toHaveBeenCalled();
    });

    it("should update quantity if item already exists in cart", async () => {
      ProductService.getProductByIdForTransaction.mockResolvedValue(
        fakeProduct,
      );

      const fakeCart = {
        user: mockUserId,
        items: [
          { product: mockProductId, unit: "box", quantity: 1, price: 100 },
        ],
        total_price: 100,
        populate: vi.fn().mockResolvedValue(true),
      };
      CartRepository.findCartByUserId.mockResolvedValue(fakeCart);

      await CartService.addToCart(mockUserId, mockProductId, 2, "box");

      expect(fakeCart.items[0].quantity).toBe(3);
      expect(fakeCart.total_price).toBe(300);
    });
  });

  describe("removeFromCart", () => {
    it("should remove item and update total_price", async () => {
      const fakeCart = {
        user: mockUserId,
        items: [
          { product: mockProductId, unit: "box", quantity: 2, price: 100 },
          { product: "prod789", unit: "strip", quantity: 1, price: 50 },
        ],
        total_price: 250,
        populate: vi.fn().mockResolvedValue(true),
      };

      CartRepository.findCartByUserId.mockResolvedValue(fakeCart);

      await CartService.removeFromCart(mockUserId, mockProductId, "box");

      expect(fakeCart.items.length).toBe(1);
      expect(fakeCart.items[0].product).toBe("prod789");
      expect(fakeCart.total_price).toBe(50);
    });

    it("should throw error if product not in cart", async () => {
      const fakeCart = {
        user: mockUserId,
        items: [{ product: "prod999", unit: "box", quantity: 1, price: 100 }],
      };
      CartRepository.findCartByUserId.mockResolvedValue(fakeCart);

      await expect(
        CartService.removeFromCart(mockUserId, mockProductId, "box"),
      ).rejects.toThrow(BadRequestError);
    });
  });

  describe("clearCart", () => {
    it("should clear all items and reset total_price", async () => {
      const fakeCart = {
        user: mockUserId,
        items: [{ product: mockProductId, quantity: 1, price: 100 }],
        total_price: 100,
      };
      CartRepository.findCartByUserId.mockResolvedValue(fakeCart);

      await CartService.clearCart(mockUserId);

      expect(fakeCart.items.length).toBe(0);
      expect(fakeCart.total_price).toBe(0);
      expect(CartRepository.saveCart).toHaveBeenCalled();
    });
  });

  describe("updateCartQuantity", () => {
    const fakeProduct = {
      _id: mockProductId,
      price: 100,
      stock: 10,
      strip_count: 5,
      strips_per_box: 3,
    };

    it("should throw error if quantity is less than 1", async () => {
      await expect(
        CartService.updateCartQuantity(mockUserId, mockProductId, 0, "box"),
      ).rejects.toThrow(BadRequestError);
    });

    it("should throw error if not enough stock", async () => {
      const fakeCart = {
        user: mockUserId,
        items: [
          { product: mockProductId, unit: "box", quantity: 1, price: 100 },
        ],
      };
      CartRepository.findCartByUserId.mockResolvedValue(fakeCart);
      ProductService.getProductByIdForTransaction.mockResolvedValue(
        fakeProduct,
      );

      await expect(
        CartService.updateCartQuantity(mockUserId, mockProductId, 20, "box"),
      ).rejects.toThrow(BadRequestError);
    });

    it("should update quantity successfully", async () => {
      const fakeCart = {
        user: mockUserId,
        items: [
          { product: mockProductId, unit: "box", quantity: 1, price: 100 },
        ],
        total_price: 100,
        populate: vi.fn().mockResolvedValue(true),
      };
      CartRepository.findCartByUserId.mockResolvedValue(fakeCart);
      ProductService.getProductByIdForTransaction.mockResolvedValue(
        fakeProduct,
      );

      await CartService.updateCartQuantity(mockUserId, mockProductId, 5, "box");

      expect(fakeCart.items[0].quantity).toBe(5);
      expect(fakeCart.total_price).toBe(500);
      expect(CartRepository.saveCart).toHaveBeenCalled();
    });
  });
});
