import { ReviewRepository } from "./review.repository.js";
import { ProductService } from "../Product/product.service.js"; 
import { UserService } from "../User/user.service.js"; 
import {
  BadRequestError,
  NotFoundError,
  ForbiddenError,
  ConflictError,
} from "../../utils/errors.js";

const updateProductRating = async (productId) => {
  const reviews = await ReviewRepository.findAllReviewsByProduct(productId);
  const numReviews = reviews.length;
  const avgRating =
    numReviews > 0
      ? Number(
          (reviews.reduce((sum, r) => sum + r.rating, 0) / numReviews).toFixed(
            1,
          ),
        )
      : 0;

  await ProductService.updateProductStats(productId, avgRating, numReviews);
};

export const ReviewService = {
  getTopReviews: async () => {
    return await ReviewRepository.findTopReviews();
  },

  createReview: async (userId, product, rating, comment) => {
    const productExists =
      await ProductService.findProductByIdAndActive(product);
    if (
      !productExists ||
      productExists.is_deleted ||
      !productExists.is_active
    ) {
      throw new NotFoundError("Product not found or inactive");
    }

    const existingReview = await ReviewRepository.findReviewByUserAndProduct(
      userId,
      product,
    );
    if (existingReview) {
      throw new ConflictError("You have already reviewed this product");
    }

    const newReview = await ReviewRepository.createReview({
      product,
      user: userId,
      rating,
      comment,
    });

    await updateProductRating(product);
    return await newReview.populate("user", "name avatar");
  },

  getAllReviews: async (queryParams) => {
    const {
      product,
      user,
      productName,
      userName,
      search,
      rating,
      page = 1,
      limit = 10,
    } = queryParams;
    const filters = {};

    if (product) filters.product = product;
    if (user) filters.user = user;

    if (rating !== undefined) {
      const ratingNum = Number(rating);
      if (!isNaN(ratingNum) && ratingNum >= 1 && ratingNum <= 5) {
        filters.rating = ratingNum;
      }
    }

    if (productName) {
      const matchingProducts = await ProductService.searchProductsIdsByName({
        $regex: productName,
        $options: "i",
      });
      const productIds = matchingProducts.map((p) => p._id);
      filters.product = filters.product
        ? { $and: [filters.product, { $in: productIds }] }
        : { $in: productIds };
    }

    if (userName) {
      const matchingUsers = await UserService.searchUsersIdsByName({
        $regex: userName,
        $options: "i",
      });
      const userIds = matchingUsers.map((u) => u._id);
      filters.user = filters.user
        ? { $and: [filters.user, { $in: userIds }] }
        : { $in: userIds };
    }

    if (search) {
      const regex = { $regex: search, $options: "i" };

      const matchingProducts =
        await ProductService.searchProductsIdsByName(regex);
      const productIds = matchingProducts.map((p) => p._id);

      const matchingUsers = await UserService.searchUsersIdsByName(regex);
      const userIds = matchingUsers.map((u) => u._id);

      filters.$or = [
        { comment: regex },
        { product: { $in: productIds } },
        { user: { $in: userIds } },
      ];
    }

    const pageNumber = parseInt(page) || 1;
    const limitNumber = parseInt(limit) || 10;
    const skip = (pageNumber - 1) * limitNumber;

    if (isNaN(pageNumber) || pageNumber < 1)
      throw new BadRequestError("Invalid page number");
    if (isNaN(limitNumber) || limitNumber < 1 || limitNumber > 100)
      throw new BadRequestError("Limit must be between 1 and 100");

    const totalItems = await ReviewRepository.countReviews(filters);
    const totalPages = Math.ceil(totalItems / limitNumber);

    const reviews = await ReviewRepository.findReviewsPaginated(
      filters,
      skip,
      limitNumber,
    );

    return {
      reviews,
      pagination: {
        totalItems,
        totalPages,
        currentPage: pageNumber,
        limit: limitNumber,
      },
    };
  },

  getOneReview: async (id) => {
    const review = await ReviewRepository.findReviewById(id);
    if (!review) throw new NotFoundError("Review not found");
    return review;
  },

  updateReview: async (id, userId, userRole, updateData) => {
    const { rating, comment, isTopReview } = updateData;
    const review = await ReviewRepository.findReviewByIdForUpdate(id);

    if (!review) throw new NotFoundError("Review not found");

    const isOwner = review.user.toString() === userId.toString();
    const isAdmin = ["admin", "super_admin"].includes(userRole);

    if (!isOwner && !isAdmin) {
      throw new ForbiddenError("You are not authorized to update this review");
    }

    if (isOwner) {
      if (rating !== undefined) review.rating = rating;
      if (comment !== undefined) review.comment = comment;
    }

    if (isAdmin && isTopReview !== undefined) {
      review.isTopReview = isTopReview;
    }

    await ReviewRepository.saveReview(review);
    await updateProductRating(review.product);

    await review.populate("user", "name avatar");
    await review.populate("product", "name image");

    return review;
  },

  deleteReview: async (id, userId, userRole) => {
    const review = await ReviewRepository.findReviewByIdForUpdate(id);
    if (!review) throw new NotFoundError("Review not found");

    const isOwner = review.user.toString() === userId.toString();
    const isAdmin = ["admin", "super_admin"].includes(userRole);

    if (!isOwner && !isAdmin) {
      throw new ForbiddenError("You are not authorized to delete this review");
    }

    const productId = review.product;
    await ReviewRepository.deleteReviewById(id);
    await updateProductRating(productId);
  },
  
  getReviewsForProduct: async (productId) => {
    return await ReviewRepository.findAllReviewsByProduct(productId);
  },
};
