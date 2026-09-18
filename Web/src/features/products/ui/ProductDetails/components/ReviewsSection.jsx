import { useState } from "react";
import { useSelector } from "react-redux";
import { Star, User, Edit2, Trash2, X, Check } from "lucide-react";
import toast from "react-hot-toast";
import {
  useGetProductReviewsQuery,
  useAddReviewMutation,
  useUpdateReviewMutation,
  useDeleteReviewMutation,
} from "../../../../admin/reviews/api/reviewsApi";
import Button from "../../../../../components/ui/Button";
import GlobalLoader from "../../../../../components/ui/GlobalLoader";

export default function ReviewsSection({ productId }) {
  const { isAuthenticated, user: currentUser } = useSelector(
    (state) => state.auth,
  );

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [editRating, setEditRating] = useState(5);
  const [editComment, setEditComment] = useState("");

  const {
    data: reviewsResponse,
    isLoading,
    isError,
  } = useGetProductReviewsQuery(productId);

  const [addReview, { isLoading: isAdding }] = useAddReviewMutation();
  const [updateReview, { isLoading: isUpdating }] = useUpdateReviewMutation();
  const [deleteReview] = useDeleteReviewMutation();

  const reviews = reviewsResponse?.data || [];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      toast.error("Please write a comment");
      return;
    }

    try {
      await addReview({
        product: productId,
        rating,
        comment,
      }).unwrap();

      toast.success("Review added successfully");
      setComment("");
      setRating(5);
    } catch {
      toast.error("Failed to add review you have already submitted.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete your review?")) {
      try {
        await deleteReview(id).unwrap();
        toast.success("Review deleted successfully");
      } catch (error) {
        toast.error(error?.data?.message || "Failed to delete review");
      }
    }
  };

  const handleStartEdit = (review) => {
    setEditingId(review._id);
    setEditRating(review.rating);
    setEditComment(review.comment);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditRating(5);
    setEditComment("");
  };

  const handleUpdate = async (id) => {
    if (!editComment.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }
    try {
      await updateReview({
        id,
        data: { rating: editRating, comment: editComment },
      }).unwrap();
      toast.success("Review updated successfully");
      handleCancelEdit();
    } catch (error) {
      toast.error(error?.data?.message || "Failed to update review");
    }
  };

  return (
    <div className="bg-(--color-surface-card) dark:bg-[#2c2c2c] p-8 rounded-3xl shadow-xl border border-(--color-border-base) dark:border-gray-800">
      <h3 className="text-2xl font-bold mb-6 border-l-4 border-(--color-primary-500) pl-3 text-(--color-text-primary) dark:text-white">
        Customer Reviews
      </h3>

      {isAuthenticated ? (
        <form
          onSubmit={handleSubmit}
          className="mb-10 bg-(--color-surface-page) dark:bg-gray-800 p-6 rounded-2xl border border-(--color-border-base) dark:border-gray-700"
        >
          <h4 className="font-semibold mb-4 text-lg text-(--color-text-primary) dark:text-white">
            Write a Review
          </h4>

          <div className="flex items-center gap-2 mb-4">
            <span className="text-sm font-medium text-(--color-text-label) dark:text-gray-300">
              Rating:
            </span>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  className={`transition-colors ${
                    star <= rating
                      ? "text-yellow-400"
                      : "text-gray-300 dark:text-gray-600"
                  }`}
                >
                  <Star className="w-6 h-6 fill-current" />
                </button>
              ))}
            </div>
          </div>

          <textarea
            className="w-full p-4 rounded-xl border border-(--color-border-input) dark:border-gray-600 bg-(--color-surface-input) dark:bg-[#2c2c2c] text-(--color-text-primary) dark:text-white focus:ring-2 focus:ring-(--color-primary-500) focus:outline-none resize-none mb-4"
            rows="3"
            placeholder="Share your thoughts about this product..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          ></textarea>

          <Button
            type="submit"
            variant="solid"
            size="md"
            isLoading={isAdding}
            className="bg-(--color-primary-700) hover:bg-(--color-primary-800)"
          >
            Submit Review
          </Button>
        </form>
      ) : (
        <div className="mb-10 p-4 bg-amber-50 dark:bg-yellow-900/20 text-amber-800 dark:text-yellow-200 rounded-xl border border-amber-200 dark:border-yellow-800 text-center font-medium">
          Please login to share your review.
        </div>
      )}

      <div className="space-y-6">
        {isLoading ? (
          <div className="flex justify-center py-10">
            <GlobalLoader width="w-8" height="h-8" animate-spin text="text-(--color-primary-700)" />
          </div>
        ) : isError ? (
          <p className="text-(--color-danger-600) text-center py-10 font-medium">
            Failed to load reviews.
          </p>
        ) : reviews.length === 0 ? (
          <div className="text-center py-10 text-(--color-text-secondary) dark:text-gray-400">
            <p className="text-lg">No reviews yet.</p>
            <p className="text-sm">Be the first to review this product!</p>
          </div>
        ) : (
          reviews.map((review) => (
            <div
              key={review._id}
              className="border-b border-(--color-border-base) dark:border-gray-700 pb-6 last:border-0 last:pb-0"
            >
              <div className="flex items-start gap-4">
                {review.user?.avatar ? (
                  <img
                    src={review.user.avatar}
                    alt={review.user.name}
                    className="w-12 h-12 rounded-full object-cover border border-(--color-border-base)"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-(--color-surface-muted) dark:bg-gray-700 flex items-center justify-center shrink-0">
                    <User className="w-6 h-6 text-(--color-text-muted)" />
                  </div>
                )}

                <div className="flex-1 w-full">
                  <div className="flex justify-between items-start mb-1">
                    <h5 className="font-bold text-(--color-text-primary) dark:text-white">
                      {review.user?.name || "Unknown User"}
                    </h5>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-(--color-text-secondary)">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                      {currentUser?._id === review.user?._id &&
                        editingId !== review._id && (
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleStartEdit(review)}
                              className="text-(--color-text-muted) hover:text-(--color-info-600)"
                              aria-label="Edit review"
                            >
                              <Edit2 className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(review._id)}
                              className="text-(--color-text-muted) hover:text-(--color-danger-600)"
                              aria-label="Delete review"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        )}
                    </div>
                  </div>

                  {editingId === review._id ? (
                    <div className="mt-3 bg-(--color-surface-page) dark:bg-[#252525] p-4 rounded-xl border border-(--color-border-base) dark:border-gray-700">
                      <div className="flex items-center gap-1 mb-3">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            type="button"
                            key={star}
                            onClick={() => setEditRating(star)}
                            className={`transition-colors ${
                              star <= editRating
                                ? "text-yellow-400"
                                : "text-gray-300 dark:text-gray-600"
                            }`}
                          >
                            <Star className="w-5 h-5 fill-current" />
                          </button>
                        ))}
                      </div>
                      <textarea
                        className="w-full p-3 rounded-lg border border-(--color-border-input) dark:border-gray-600 bg-(--color-surface-input) dark:bg-[#1e1e1e] text-(--color-text-primary) dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none mb-3 text-sm"
                        rows="2"
                        value={editComment}
                        onChange={(e) => setEditComment(e.target.value)}
                      ></textarea>
                      <div className="flex items-center gap-2 justify-end">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={handleCancelEdit}
                          className="text-(--color-text-secondary) hover:bg-gray-200 dark:hover:bg-gray-700"
                          aria-label="Cancel editing"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="solid"
                          size="sm"
                          onClick={() => handleUpdate(review._id)}
                          isLoading={isUpdating}
                          className="bg-(--color-info-600) hover:bg-(--color-info-700) text-white"
                        >
                          {!isUpdating && <Check className="w-4 h-4" />}
                          Save
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex gap-1 mb-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-4 h-4 ${
                              star <= review.rating
                                ? "text-yellow-400 fill-yellow-400"
                                : "text-gray-300 dark:text-gray-600"
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-(--color-text-body) dark:text-gray-300 text-sm leading-relaxed">
                        {review.comment}
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
