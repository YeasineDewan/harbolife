import { describe, it, expect, vi, beforeEach } from "vitest";
import { ReviewService } from "./review.service.js";
import { ReviewRepository } from "./review.repository.js";
import { ProductService } from "../Product/product.service.js";
import { UserService } from "../User/user.service.js";
import {
  BadRequestError,
  NotFoundError,
  ForbiddenError,
  ConflictError,
} from "../../utils/errors.js";

vi.mock("./review.repository.js");
vi.mock("../Product/product.service.js");
vi.mock("../User/user.service.js");

describe("ReviewService", () => {
  const mockUserId = "user123";
  const mockAdminId = "admin123";
  const mockProductId = "prod123";
  const mockReviewId = "rev123";

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getTopReviews", () => {
    it("should return top reviews", async () => {
      const mockReviews = [{ _id: "1", rating: 5 }];
      ReviewRepository.findTopReviews.mockResolvedValue(mockReviews);

      const result = await ReviewService.getTopReviews();
      expect(result).toEqual(mockReviews);
      expect(ReviewRepository.findTopReviews).toHaveBeenCalled();
    });
  });

  describe("createReview", () => {
    it("should throw NotFoundError if product does not exist or is inactive", async () => {
      ProductService.findProductByIdAndActive.mockResolvedValue(null);

      await expect(
        ReviewService.createReview(mockUserId, mockProductId, 5, "Great"),
      ).rejects.toThrow(NotFoundError);
    });

    it("should throw ConflictError if user already reviewed the product", async () => {
      ProductService.findProductByIdAndActive.mockResolvedValue({
        is_active: true,
        is_deleted: false,
      });
      ReviewRepository.findReviewByUserAndProduct.mockResolvedValue({
        _id: "existing",
      });

      await expect(
        ReviewService.createReview(mockUserId, mockProductId, 5, "Great"),
      ).rejects.toThrow(ConflictError);
    });

    it("should create review, update product rating, and return populated review", async () => {
      ProductService.findProductByIdAndActive.mockResolvedValue({
        is_active: true,
        is_deleted: false,
      });
      ReviewRepository.findReviewByUserAndProduct.mockResolvedValue(null);

      const mockPopulatedReview = {
        _id: mockReviewId,
        product: mockProductId,
        rating: 4,
      };

      mockPopulatedReview.populate = vi
        .fn()
        .mockResolvedValue(mockPopulatedReview);

      ReviewRepository.createReview.mockResolvedValue(mockPopulatedReview);
      ReviewRepository.findAllReviewsByProduct.mockResolvedValue([
        { rating: 4 },
        { rating: 5 },
      ]);

      const result = await ReviewService.createReview(
        mockUserId,
        mockProductId,
        4,
        "Good",
      );

      expect(ReviewRepository.createReview).toHaveBeenCalledWith({
        product: mockProductId,
        user: mockUserId,
        rating: 4,
        comment: "Good",
      });
      expect(ProductService.updateProductStats).toHaveBeenCalledWith(
        mockProductId,
        4.5,
        2,
      );
      expect(mockPopulatedReview.populate).toHaveBeenCalledWith(
        "user",
        "name avatar",
      );
      expect(result._id).toBe(mockReviewId);
    });
  });

  describe("getAllReviews", () => {
    it("should throw BadRequestError for invalid pagination", async () => {
      await expect(ReviewService.getAllReviews({ page: -1 })).rejects.toThrow(
        BadRequestError,
      );
      await expect(ReviewService.getAllReviews({ limit: 150 })).rejects.toThrow(
        BadRequestError,
      );
    });

    it("should apply product, user, and rating filters", async () => {
      ReviewRepository.countReviews.mockResolvedValue(10);
      ReviewRepository.findReviewsPaginated.mockResolvedValue([]);

      await ReviewService.getAllReviews({
        product: mockProductId,
        user: mockUserId,
        rating: 4,
      });

      expect(ReviewRepository.findReviewsPaginated).toHaveBeenCalledWith(
        { product: mockProductId, user: mockUserId, rating: 4 },
        0,
        10,
      );
    });

    it("should handle productName and userName search filters", async () => {
      ReviewRepository.countReviews.mockResolvedValue(5);
      ReviewRepository.findReviewsPaginated.mockResolvedValue([]);

      ProductService.searchProductsIdsByName.mockResolvedValue([{ _id: "p1" }]);
      UserService.searchUsersIdsByName.mockResolvedValue([{ _id: "u1" }]);

      await ReviewService.getAllReviews({
        productName: "Panadol",
        userName: "Ahmed",
      });

      expect(ProductService.searchProductsIdsByName).toHaveBeenCalled();
      expect(UserService.searchUsersIdsByName).toHaveBeenCalled();
      expect(ReviewRepository.findReviewsPaginated).toHaveBeenCalledWith(
        { product: { $in: ["p1"] }, user: { $in: ["u1"] } },
        0,
        10,
      );
    });

    it("should handle general search keyword", async () => {
      ReviewRepository.countReviews.mockResolvedValue(2);
      ReviewRepository.findReviewsPaginated.mockResolvedValue([]);

      ProductService.searchProductsIdsByName.mockResolvedValue([{ _id: "p1" }]);
      UserService.searchUsersIdsByName.mockResolvedValue([{ _id: "u1" }]);

      await ReviewService.getAllReviews({ search: "Great" });

      expect(ReviewRepository.findReviewsPaginated).toHaveBeenCalledWith(
        {
          $or: [
            { comment: { $regex: "Great", $options: "i" } },
            { product: { $in: ["p1"] } },
            { user: { $in: ["u1"] } },
          ],
        },
        0,
        10,
      );
    });
  });

  describe("getOneReview", () => {
    it("should throw NotFoundError if review not found", async () => {
      ReviewRepository.findReviewById.mockResolvedValue(null);
      await expect(ReviewService.getOneReview(mockReviewId)).rejects.toThrow(
        NotFoundError,
      );
    });

    it("should return review if found", async () => {
      ReviewRepository.findReviewById.mockResolvedValue({ _id: mockReviewId });
      const result = await ReviewService.getOneReview(mockReviewId);
      expect(result._id).toBe(mockReviewId);
    });
  });

  describe("updateReview", () => {
    it("should throw NotFoundError if review does not exist", async () => {
      ReviewRepository.findReviewByIdForUpdate.mockResolvedValue(null);
      await expect(
        ReviewService.updateReview(mockReviewId, mockUserId, "user", {}),
      ).rejects.toThrow(NotFoundError);
    });

    it("should throw ForbiddenError if user is neither owner nor admin", async () => {
      ReviewRepository.findReviewByIdForUpdate.mockResolvedValue({
        _id: mockReviewId,
        user: "differentUser",
      });
      await expect(
        ReviewService.updateReview(mockReviewId, mockUserId, "user", {}),
      ).rejects.toThrow(ForbiddenError);
    });

    it("should allow owner to update rating and comment and update product stats", async () => {
      const mockReview = {
        _id: mockReviewId,
        user: mockUserId,
        product: mockProductId,
        rating: 3,
        comment: "Old",
      };
      mockReview.populate = vi.fn().mockResolvedValue(mockReview);

      ReviewRepository.findReviewByIdForUpdate.mockResolvedValue(mockReview);
      ReviewRepository.findAllReviewsByProduct.mockResolvedValue([
        { rating: 5 },
      ]);

      const result = await ReviewService.updateReview(
        mockReviewId,
        mockUserId,
        "user",
        { rating: 5, comment: "New", isTopReview: true },
      );

      expect(mockReview.rating).toBe(5);
      expect(mockReview.comment).toBe("New");
      expect(mockReview.isTopReview).toBeUndefined();
      expect(ReviewRepository.saveReview).toHaveBeenCalledWith(mockReview);
      expect(ProductService.updateProductStats).toHaveBeenCalledWith(
        mockProductId,
        5,
        1,
      );
      expect(mockReview.populate).toHaveBeenCalledTimes(2);
      expect(result.rating).toBe(5);
    });

    it("should allow admin to update isTopReview but not comment", async () => {
      const mockReview = {
        _id: mockReviewId,
        user: "differentUser",
        product: mockProductId,
        isTopReview: false,
      };

      mockReview.populate = vi.fn().mockResolvedValue(mockReview);

      ReviewRepository.findReviewByIdForUpdate.mockResolvedValue(mockReview);
      ReviewRepository.findAllReviewsByProduct.mockResolvedValue([]);

      await ReviewService.updateReview(mockReviewId, mockAdminId, "admin", {
        comment: "Hacked",
        isTopReview: true,
      });

      expect(mockReview.comment).toBeUndefined();
      expect(mockReview.isTopReview).toBe(true);
    });
  });

  describe("deleteReview", () => {
    it("should throw NotFoundError if review does not exist", async () => {
      ReviewRepository.findReviewByIdForUpdate.mockResolvedValue(null);
      await expect(
        ReviewService.deleteReview(mockReviewId, mockUserId, "user"),
      ).rejects.toThrow(NotFoundError);
    });

    it("should throw ForbiddenError if unauthorized", async () => {
      ReviewRepository.findReviewByIdForUpdate.mockResolvedValue({
        _id: mockReviewId,
        user: "differentUser",
      });
      await expect(
        ReviewService.deleteReview(mockReviewId, mockUserId, "user"),
      ).rejects.toThrow(ForbiddenError);
    });

    it("should delete review and update product stats for owner", async () => {
      ReviewRepository.findReviewByIdForUpdate.mockResolvedValue({
        _id: mockReviewId,
        user: mockUserId,
        product: mockProductId,
      });
      ReviewRepository.findAllReviewsByProduct.mockResolvedValue([]);

      await ReviewService.deleteReview(mockReviewId, mockUserId, "user");

      expect(ReviewRepository.deleteReviewById).toHaveBeenCalledWith(
        mockReviewId,
      );
      expect(ProductService.updateProductStats).toHaveBeenCalledWith(
        mockProductId,
        0,
        0,
      );
    });

    it("should delete review and update product stats for admin", async () => {
      ReviewRepository.findReviewByIdForUpdate.mockResolvedValue({
        _id: mockReviewId,
        user: "differentUser",
        product: mockProductId,
      });
      ReviewRepository.findAllReviewsByProduct.mockResolvedValue([]);

      await ReviewService.deleteReview(mockReviewId, mockAdminId, "admin");

      expect(ReviewRepository.deleteReviewById).toHaveBeenCalledWith(
        mockReviewId,
      );
    });
  });

  describe("getReviewsForProduct", () => {
    it("should return reviews for a product", async () => {
      ReviewRepository.findAllReviewsByProduct.mockResolvedValue([
        { _id: "1" },
      ]);
      const result = await ReviewService.getReviewsForProduct(mockProductId);
      expect(result).toHaveLength(1);
      expect(ReviewRepository.findAllReviewsByProduct).toHaveBeenCalledWith(
        mockProductId,
      );
    });
  });
});
