import { X, Star, Award } from "lucide-react";
import {
  useGetReviewByIdQuery,
  useUpdateReviewMutation,
} from "../api/reviewsApi";
import toast from "react-hot-toast";
import Button from "../../../../components/ui/Button";
import GlobalLoader from "../../../../components/ui/GlobalLoader";

export default function ReviewDetailsModal({ isOpen, onClose, reviewId }) {
  const { data, isLoading } = useGetReviewByIdQuery(reviewId, {
    skip: !reviewId,
  });

  const [updateReview, { isLoading: isUpdating }] = useUpdateReviewMutation();

  if (!isOpen) return null;

  const review = data?.data;

  const handleToggleTop = async () => {
    try {
      await updateReview({
        id: reviewId,
        isTopReview: !review.isTopReview,
      }).unwrap();
      toast.success(
        review.isTopReview
          ? "Removed from top reviews"
          : "Added to top reviews",
      );
    } catch (error) {
      toast.error(error?.data?.message || "Failed to update status");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-(--color-surface-card) dark:bg-(--color-panel-dark) rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col border border-(--color-border-base) dark:border-gray-800">
        <div className="flex items-center justify-between p-5 border-b border-(--color-border-base) dark:border-gray-800">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-(--color-text-primary) dark:text-white">
              Review Details
            </h2>
            {review?.isTopReview && (
              <span className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 px-2 py-0.5 rounded text-xs font-bold flex items-center gap-1">
                <Award className="w-3 h-3" /> Top
              </span>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="hover:bg-gray-100 dark:hover:bg-gray-800"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="p-6 overflow-y-auto">
          {isLoading ? (
            <div className="flex justify-center items-center py-10">
              <GlobalLoader width="w-8" height="h-8" animate-spin text="(--color-primary-600)" />
            </div>
          ) : !review ? (
            <div className="text-center py-10 text-(--color-text-secondary)">
              Review not found.
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center gap-4 p-4 bg-(--color-surface-page) dark:bg-[#252525] rounded-xl">
                <img
                  src={review.product.image}
                  alt={review.product.name}
                  className="w-16 h-16 object-cover rounded-lg border border-(--color-border-base) dark:border-gray-700"
                />
                <div>
                  <p className="text-xs text-(--color-text-secondary) dark:text-gray-400 mb-1">
                    Product
                  </p>
                  <h3 className="font-semibold text-(--color-text-primary) dark:text-white">
                    {review.product.name}
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <img
                  src={review.user.avatar || null}
                  alt={review.user.name}
                  className="w-12 h-12 object-cover rounded-full border-2 border-(--color-border-base) dark:border-gray-700"
                />
                <div>
                  <h4 className="font-medium text-(--color-text-primary) dark:text-white">
                    {review.user.name}
                  </h4>
                  <p className="text-xs text-(--color-text-secondary)">
                    {new Date(review.createdAt).toLocaleString("en-GB")}
                  </p>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < review.rating
                          ? "fill-amber-500 text-amber-500"
                          : "fill-gray-200 text-gray-200 dark:fill-gray-700 dark:text-gray-700"
                      }`}
                    />
                  ))}
                </div>
                <div className="p-4 bg-(--color-surface-page) dark:bg-[#252525] rounded-xl">
                  <p className="text-(--color-text-body) dark:text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
                    {review.comment}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-5 border-t border-(--color-border-base) dark:border-gray-800 flex justify-between items-center bg-(--color-surface-page)/50 dark:bg-[#252525]/50">
          {review && (
            <Button
              variant="outline"
              size="md"
              onClick={handleToggleTop}
              isLoading={isUpdating}
              className={`text-sm font-medium ${
                review.isTopReview
                  ? "bg-amber-100 text-amber-700 hover:bg-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:hover:bg-amber-900/50 border-amber-300"
                  : "bg-(--color-surface-card) border-(--color-border-base) text-(--color-text-primary) hover:bg-gray-50 dark:bg-[#1e1e1e] dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
              }`}
            >
              <Award className="w-4 h-4" />
              {review.isTopReview ? "Remove from Top" : "Make Top Review"}
            </Button>
          )}
          <Button
            variant="ghost"
            size="md"
            onClick={onClose}
            className="text-(--color-text-primary) bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 ml-auto"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
