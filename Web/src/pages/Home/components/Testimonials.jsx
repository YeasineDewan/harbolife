import { Star } from "lucide-react";
import { useGetTopReviewsQuery } from "../../../features/admin/reviews/api/reviewsApi";
import GlobalLoader from "../../../components/ui/GlobalLoader";
import defaultAvatar from "../../../assets/Home/default-avatar.webp";

export default function Testimonials() {
  const { data: response, isLoading, isError } = useGetTopReviewsQuery();

  const reviews = response?.data || [];

  if (isLoading) {
    return (
      <div className="w-full bg-gray-100 dark:bg-[#1a1a1a] py-32 flex justify-center items-center">
        <GlobalLoader
          width="w-10"
          height="h-10"
          animate-spin
          text="text-(--color-primary-600)"
        />
      </div>
    );
  }

  if (isError || reviews.length === 0) {
    return null;
  }

  return (
    <div className="w-full bg-gray-100 dark:bg-[#1a1a1a] py-16 transition-colors duration-300">
      <div className="w-full max-w-7xl mx-auto">
        <h3 className="text-3xl font-bold text-center text-(--color-text-primary) dark:text-white mb-4 px-4">
          What Our Clients Say
        </h3>

        <div className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-12 pt-16 px-4 sm:px-8 lg:px-12 scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {reviews.map((review) => (
            <div
              key={review._id}
              className="flex-none w-[85%] sm:w-[350px] snap-center bg-(--color-surface-card) dark:bg-[#252525] p-8 rounded-2xl text-center shadow-sm border border-(--color-border-base) dark:border-gray-800 relative pt-14 mt-12 flex flex-col h-auto"
            >
              <img
                src={review.user?.avatar || defaultAvatar}
                alt={`Client ${review.user?.name}`}
                loading="lazy"
                className="w-24 h-24 rounded-full object-cover absolute -top-12 left-1/2 transform -translate-x-1/2 border-4 border-white dark:border-[#252525] shadow-md bg-(--color-surface-card) dark:bg-[#252525]"
              />
              <h4 className="font-bold text-lg text-(--color-text-primary) dark:text-white mb-3">
                {review.user?.name || "Anonymous User"}
              </h4>
              <p className="text-(--color-text-secondary) dark:text-gray-400 italic mb-4 leading-relaxed flex-grow line-clamp-4">
                "{review.comment}"
              </p>
              <div
                className="flex justify-center text-yellow-400 mt-auto"
                role="img"
                aria-label={`Rating: ${review.rating} out of 5 stars`}
              >
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < review.rating
                        ? "fill-current"
                        : "text-gray-300 dark:text-gray-600"
                    }`}
                    aria-hidden="true"
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
