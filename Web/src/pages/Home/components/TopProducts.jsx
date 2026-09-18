import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useGetProductsQuery } from "../../../features/products/api/productsApi";
import ProductCard from "../../../features/products/ui/ProductCard/ProductCard";
import GlobalLoader from "../../../components/ui/GlobalLoader";

export default function TopProducts() {
  const { data: productsData, isLoading } = useGetProductsQuery({
    limit: 12,
    top_selling: true,
  });

  const productsToShow = productsData?.data || [];
  const scrollContainerRef = useRef(null);

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const { current } = scrollContainerRef;
      const scrollAmount = current.clientWidth * 0.8;
      current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="w-full px-4 sm:px-8 lg:px-12 py-16">
      <h3 className="text-3xl font-bold text-center text-(--color-text-primary) dark:text-white mb-10">
        Top Selling Products
      </h3>

      {isLoading ? (
        <GlobalLoader />
      ) : (
        <div className="relative group">
          {productsToShow.length > 0 && (
            <>
              <button
                onClick={() => scroll("left")}
                className="absolute -left-2 sm:-left-4 top-1/2 -translate-y-1/2 z-10 hidden sm:flex items-center justify-center w-10 h-10 md:w-12 md:h-12 bg-white dark:bg-(--color-surface-card) border border-(--color-border-base) rounded-full shadow-lg text-(--color-text-primary) dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 hover:scale-110 transition-all opacity-0 group-hover:opacity-100"
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <button
                onClick={() => scroll("right")}
                className="absolute -right-2 sm:-right-4 top-1/2 -translate-y-1/2 z-10 hidden sm:flex items-center justify-center w-10 h-10 md:w-12 md:h-12 bg-white dark:bg-(--color-surface-card) border border-(--color-border-base) rounded-full shadow-lg text-(--color-text-primary) dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 hover:scale-110 transition-all opacity-0 group-hover:opacity-100"
                aria-label="Scroll right"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          <div
            ref={scrollContainerRef}
            className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 scroll-smooth
                       [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          >
            {productsToShow.length > 0 ? (
              productsToShow.map((product) => (
                <div
                  key={product._id}
                  className="snap-start shrink-0 w-[75%] sm:w-[45%] md:w-[30%] lg:w-[20%]"
                >
                  <ProductCard
                    product={product}
                    className="w-full h-full mx-auto"
                  />
                </div>
              ))
            ) : (
              <div className="w-full text-center text-(--color-text-secondary) py-10 text-xl font-semibold">
                No products found.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
