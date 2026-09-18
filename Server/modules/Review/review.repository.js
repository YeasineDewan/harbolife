import Review from "./review.model.js";

export const ReviewRepository = {
  findTopReviews: async () => {
    return await Review.find({ isTopReview: true })
      .populate("user", "name avatar")
      .limit(6)
      .sort({ createdAt: -1 });
  },

  findReviewByUserAndProduct: async (userId, productId) => {
    return await Review.findOne({
      product: productId,
      user: userId,
    });
  },

  createReview: async (reviewData) => {
    const review = new Review(reviewData);
    return await review.save();
  },

  findAllReviewsByProduct: async (productId) => {
    return await Review.find({ product: productId });
  },

  countReviews: async (filters) => {
    return await Review.countDocuments(filters);
  },

  findReviewsPaginated: async (filters, skip, limitNumber) => {
    return await Review.find(filters)
      .skip(skip)
      .limit(limitNumber)
      .populate("user", "name avatar")
      .populate("product", "name image")
      .sort({ createdAt: -1 });
  },

  findReviewById: async (id) => {
    return await Review.findById(id)
      .populate("user", "name avatar")
      .populate("product", "name image");
  },

  findReviewByIdForUpdate: async (id) => {
    return await Review.findById(id);
  },

  saveReview: async (reviewDoc) => {
    return await reviewDoc.save();
  },

  deleteReviewById: async (id) => {
    return await Review.findByIdAndDelete(id);
  },
};