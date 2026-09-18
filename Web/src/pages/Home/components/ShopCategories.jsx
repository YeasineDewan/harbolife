import { Link } from "react-router-dom";
import { useGetCategoriesQuery } from "../../../features/admin/categories/api/categoriesApi";
import GlobalLoader from "../../../components/ui/GlobalLoader";

export default function ShopCategories() {
  const {
    data: response,
    isLoading,
    isError,
  } = useGetCategoriesQuery({
    limit: 12,
  });

  const categories = response?.data || [];

  if (isLoading) {
    return (
      <div className="py-12 flex justify-center items-center">
        <GlobalLoader width="w-10" height="h-10" animate-spin text="text-(--color-primary-600)" />
      </div>
    );
  }

  if (isError || categories.length === 0) return null;

  return (
    <section className="py-12 px-4 md:px-8 max-w-screen-2xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-2xl md:text-3xl font-bold text-(--color-text-primary) dark:text-white capitalize">
          Shop by Category
        </h2>
      </div>

      <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 md:gap-6 pb-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {categories.map((category) => (
          <Link
            key={category._id}
            to={`/category/${category.slug}`}
            className="group block snap-start shrink-0 w-[65%] sm:w-[40%] md:w-[28%] lg:w-[22%] cursor-pointer"
          >
            <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-(--color-surface-card) dark:bg-[#1e1e1e] border border-(--color-border-base) dark:border-gray-800 mb-4 flex items-center justify-center p-4 shadow-sm transition-all duration-300 group-hover:shadow-md group-hover:-translate-y-1">
              <img
                src={category.image}
                alt={category.name}
                className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />

              {/* Hover Description Overlay */}
              <div className="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-5 backdrop-blur-sm">
                <p className="text-white text-sm md:text-base text-center leading-relaxed line-clamp-5">
                  {category.description}
                </p>
              </div>
            </div>

            <h3 className="text-center font-bold text-base md:text-lg text-(--color-text-body) dark:text-gray-100 transition-colors group-hover:text-(--color-primary-600) capitalize">
              {category.name}
            </h3>
          </Link>
        ))}
      </div>
    </section>
  );
}
