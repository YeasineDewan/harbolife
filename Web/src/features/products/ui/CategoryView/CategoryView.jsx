import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { SlidersHorizontal } from "lucide-react";
import toast from "react-hot-toast";
import { useGetCategoryBySlugQuery } from "../../../admin/categories/api/categoriesApi";
import { useGetProductsQuery } from "../../api/productsApi";
import ProductList from "../ProductList/ProductList";
import Pagination from "../../../../components/ui/Pagination";
import { setSearchTerm } from "../../../uiSlice/uiSlice";
import GlobalLoader from "../../../../components/ui/GlobalLoader";

export default function CategoryView() {
  const { slug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();

  const { searchTerm } = useSelector((state) => state.ui);
  const [hasShownToast, setHasShownToast] = useState(false);

  useEffect(() => {
    dispatch(setSearchTerm(""));
  }, [slug, dispatch]);

  const currentPage = parseInt(searchParams.get("page")) || 1;
  const sortPrice = searchParams.get("sortPrice") || "";
  const minRating = searchParams.get("minRating") || "";
  const requires_prescription = searchParams.get("requires_prescription") || "";
  const inStock = searchParams.get("inStock") || "";
  const has_strips = searchParams.get("has_strips") || "";
  const ITEMS_PER_PAGE = 20;

  const {
    data: categoryResponse,
    isLoading: isCategoryLoading,
    isError: isCategoryError,
  } = useGetCategoryBySlugQuery(slug);
  const currentCategory = categoryResponse?.data;

  const {
    data: productsResponse,
    isLoading: isProductsLoading,
    isError: isProductsError,
    isFetching,
  } = useGetProductsQuery(
    {
      limit: ITEMS_PER_PAGE,
      page: currentPage,
      categoryName: currentCategory?.name,
      search: searchTerm,
      sortPrice,
      minRating,
      requires_prescription,
      inStock,
      has_strips,
    },
    { skip: !currentCategory },
  );

  const products = productsResponse?.data || [];
  const totalPages = productsResponse?.pagination?.totalPages || 1;

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      const newParams = new URLSearchParams(searchParams);
      newParams.set("page", page.toString());
      setSearchParams(newParams);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleFilterChange = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    newParams.set("page", "1");
    setSearchParams(newParams);
  };

  const handleFilterInteraction = () => {
    if (!hasShownToast) {
      toast(
        "Please search for a specific disease or medicine to filter on them",
        {
          icon: "💡",
          duration: 5000,
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        },
      );
      setHasShownToast(true);
    }
  };

  if (isCategoryLoading) {
    return (
      <div className="flex justify-center items-center h-screen text-(--color-primary-600)">
          <GlobalLoader width="w-10" height="h-10" />
      </div>
    );
  }

  if (isCategoryError || !currentCategory) {
    return (
      <div className="text-center mt-24 text-(--color-danger-600) font-bold text-xl">
        Category not found!
      </div>
    );
  }

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 mt-6 md:mt-10 mb-12 max-w-screen-2xl mx-auto">
      {/* Category Header */}
      <div className="mb-6 md:mb-8 pb-4 md:pb-6 border-b border-(--color-border-base) dark:border-gray-800">
        <h2 className="font-bold text-2xl md:text-4xl mb-2 md:mb-3 capitalize text-(--color-text-primary) dark:text-white border-l-4 border-(--color-primary-500) pl-3 md:pl-4">
          {currentCategory.name}
        </h2>
        <p className="text-(--color-text-secondary) dark:text-gray-400 text-sm md:text-lg max-w-3xl pl-3 md:pl-4">
          {currentCategory.description}
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 md:gap-8">
        <aside className="w-full md:w-50 lg:w-64 shrink-0">
          <div
            className="bg-(--color-surface-card) dark:bg-[#2c2c2c] p-3 md:p-6 rounded-xl md:rounded-2xl shadow-sm border border-(--color-border-base) dark:border-gray-800 md:sticky md:top-35"
            onClick={handleFilterInteraction}
          >
            <div className="hidden md:flex items-center gap-2 mb-6 pb-4 border-b border-(--color-border-base) dark:border-gray-700">
              <SlidersHorizontal className="w-5 h-5 text-(--color-primary-600) dark:text-green-400" />
              <h3 className="font-bold text-lg text-(--color-text-primary) dark:text-white">
                Filters
              </h3>
            </div>            <div className="flex flex-row md:flex-col items-center md:items-stretch gap-2.5 md:gap-6 flex-wrap md:flex-nowrap">
              <div className="md:hidden flex items-center justify-center p-2.5 bg-(--color-surface-muted) dark:bg-gray-800 rounded-lg border border-(--color-border-base) dark:border-gray-700 text-(--color-text-secondary)">
                <SlidersHorizontal className="w-4 h-4" />
              </div>
 
              <div className="flex-1 min-w-[120px] space-y-0 md:space-y-3">
                <label className="hidden md:block text-sm font-bold text-(--color-text-primary) dark:text-gray-200 uppercase tracking-wider">
                  Sort By Price
                </label>
                <select
                  value={sortPrice}
                  onChange={(e) =>
                    handleFilterChange("sortPrice", e.target.value)
                  }
                  className="w-full px-2 md:px-4 py-2 md:py-3 rounded-lg md:rounded-xl text-xs md:text-sm font-medium border border-(--color-border-input) dark:border-gray-700 bg-(--color-surface-input) dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-(--color-primary-500) cursor-pointer text-(--color-text-body) dark:text-gray-200"
                >
                  <option value="">Sort: Relevance</option>
                  <option value="asc">Price: Low to High</option>
                  <option value="desc">Price: High to Low</option>
                </select>
              </div>
 
              <div className="flex-1 min-w-[120px] space-y-0 md:space-y-3">
                <label className="hidden md:block text-sm font-bold text-(--color-text-primary) dark:text-gray-200 uppercase tracking-wider">
                  Minimum Rating
                </label>
                <select
                  value={minRating}
                  onChange={(e) =>
                    handleFilterChange("minRating", e.target.value)
                  }
                  className="w-full px-2 md:px-4 py-2 md:py-3 rounded-lg md:rounded-xl text-xs md:text-sm font-medium border border-(--color-border-input) dark:border-gray-700 bg-(--color-surface-input) dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-(--color-primary-500) cursor-pointer text-(--color-text-body) dark:text-gray-200"
                >
                  <option value="">Rating: All</option>
                  <option value="4">4+ Stars</option>
                  <option value="3">3+ Stars</option>
                </select>
              </div>

              <div className="flex-1 min-w-[120px] space-y-0 md:space-y-3">
                <label className="hidden md:block text-sm font-bold text-(--color-text-primary) dark:text-gray-200 uppercase tracking-wider">
                  Prescription
                </label>
                <select
                  value={requires_prescription}
                  onChange={(e) =>
                    handleFilterChange("requires_prescription", e.target.value)
                  }
                  className="w-full px-2 md:px-4 py-2 md:py-3 rounded-lg md:rounded-xl text-xs md:text-sm font-medium border border-(--color-border-input) dark:border-gray-700 bg-(--color-surface-input) dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-(--color-primary-500) cursor-pointer text-(--color-text-body) dark:text-gray-200"
                >
                  <option value="">Prescription: All</option>
                  <option value="true">Prescription Required</option>
                  <option value="false">No Prescription</option>
                </select>
              </div>

              <div className="flex-1 min-w-[120px] space-y-0 md:space-y-3">
                <label className="hidden md:block text-sm font-bold text-(--color-text-primary) dark:text-gray-200 uppercase tracking-wider">
                  Stock Availability
                </label>
                <select
                  value={inStock}
                  onChange={(e) =>
                    handleFilterChange("inStock", e.target.value)
                  }
                  className="w-full px-2 md:px-4 py-2 md:py-3 rounded-lg md:rounded-xl text-xs md:text-sm font-medium border border-(--color-border-input) dark:border-gray-700 bg-(--color-surface-input) dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-(--color-primary-500) cursor-pointer text-(--color-text-body) dark:text-gray-200"
                >
                  <option value="">Stock: All</option>
                  <option value="true">In Stock</option>
                  <option value="false">Out of Stock</option>
                </select>
              </div>

              <div className="flex-1 min-w-[120px] space-y-0 md:space-y-3">
                <label className="hidden md:block text-sm font-bold text-(--color-text-primary) dark:text-gray-200 uppercase tracking-wider">
                  Pack Form
                </label>
                <select
                  value={has_strips}
                  onChange={(e) =>
                    handleFilterChange("has_strips", e.target.value)
                  }
                  className="w-full px-2 md:px-4 py-2 md:py-3 rounded-lg md:rounded-xl text-xs md:text-sm font-medium border border-(--color-border-input) dark:border-gray-700 bg-(--color-surface-input) dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-(--color-primary-500) cursor-pointer text-(--color-text-body) dark:text-gray-200"
                >
                  <option value="">Pack: All</option>
                  <option value="true">Box of Strips</option>
                  <option value="false">Standard Unit</option>
                </select>
              </div>
            </div>
          </div>
        </aside>

        <main className="flex-1">
          {isProductsLoading ? <GlobalLoader/> : isProductsError ? (
            <div className="text-(--color-danger-600) text-center mt-10 text-xl font-bold bg-(--color-danger-50) dark:bg-red-900/20 p-6 rounded-2xl">
              Error loading products. Please try again later.
            </div>
          ) : (
            <div
              className={`transition-opacity duration-300 ${
                isFetching ? "opacity-50 pointer-events-none" : "opacity-100"
              }`}
            >
              <div className="mb-4 md:mb-6 text-xs md:text-sm text-(--color-text-secondary) dark:text-gray-400 px-1">
                Showing {products.length} products
              </div>
              <ProductList products={products} />

              {totalPages > 1 && (
                <div className="mt-10 flex justify-center">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
