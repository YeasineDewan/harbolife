import { Link } from "react-router-dom";
import { useGetCategoriesQuery } from "../../features/admin/categories/api/categoriesApi";

export default function SubNavbar() {
  const { data, isLoading } = useGetCategoriesQuery();
  const categories = data?.data || [];

  return (
    <nav className="fixed top-16 w-full z-40 bg-(--color-surface-page) dark:bg-(--color-panel-dark) border-b border-(--color-border-base) dark:border-(--color-border-subtle) shadow-sm">
      <div className="w-full px-2 sm:px-6 lg:px-8 py-3 flex flex-col md:flex-row justify-between items-center gap-3">
        <div className="flex justify-start gap-2 w-full overflow-x-auto pb-1 md:pb-0 scrollbar-hide">
          {isLoading ? (
            <div className="flex gap-4 animate-pulse">
              <div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
              <div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
              <div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
            </div>
          ) : (
            categories.map((category) => (
              <Link
                key={category._id}
                to={`/category/${category.slug}`}
                className="px-2 md:px-4 whitespace-nowrap py-1.5 rounded-md text-sm md:text-base font-medium text-gray-900 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 capitalize transition-colors"
              >
                {category.name}
              </Link>
            ))
          )}
        </div>

        <div className="hidden md:block bg-(--color-primary-700) dark:bg-(--color-primary-800) text-white px-5 py-2 rounded-lg text-sm font-bold whitespace-nowrap shadow-sm w-full md:w-auto text-center border border-(--color-primary-600)">
          Free Shipping Order By August
        </div>
      </div>
    </nav>
  );
}
