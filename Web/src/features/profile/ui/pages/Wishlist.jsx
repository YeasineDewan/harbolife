import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { useGetSavedProductsQuery } from "../../../products/api/productsApi";
import ProductCard from "../../../products/ui/ProductCard/ProductCard";
import GlobalLoader from "../../../../components/ui/GlobalLoader";

export default function Wishlist() {
  const {
    data: savedProductsRes,
    isLoading,
    isError,
  } = useGetSavedProductsQuery();

  const rawData = savedProductsRes?.data;
  const wishlistItems = Array.isArray(rawData) ? rawData : [];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <GlobalLoader
          width="w-10"
          height="h-10"
          text="text-green-600"
          animate-spin
        />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center text-(--color-danger-500) font-bold mt-10">
        Failed to load wishlist items. Please try again later.
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-300">
      <div className="mb-8 border-b border-gray-200 dark:border-gray-800 pb-6">
        <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-2 flex items-center gap-3">
          <Heart className="w-8 h-8 text-green-600 dark:text-green-500 fill-current" />
          Saved Items
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          Products you've saved to review or purchase later.
        </p>
      </div>

      {wishlistItems.length === 0 ? (
        <div className="bg-gray-50 dark:bg-[#252525] rounded-3xl border border-gray-100 dark:border-gray-800 p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
          <div className="w-24 h-24 bg-white dark:bg-[#1e1e1e] rounded-full flex items-center justify-center shadow-sm mb-6">
            <Heart className="w-12 h-12 text-gray-300 dark:text-gray-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Your wishlist is empty
          </h3>
          <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-8">
            You haven't saved any items yet. Browse our categories and click the
            heart icon to save items you love.
          </p>
          <Link
            to="/category/diabetes-care"
            className="flex items-center justify-center gap-2 bg-green-700 hover:bg-green-800 text-white font-bold py-3.5 px-8 rounded-xl active:scale-95 shadow-md transition-transform"
          >
            Explore Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {wishlistItems.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
