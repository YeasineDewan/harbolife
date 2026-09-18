import { ShoppingCart } from "lucide-react";
import stripImage from "../../../../../assets/strip.webp";
import Button from "../../../../../components/ui/Button";

export default function ProductActions({
  productName,
  outOfStock,
  isRoshetta,
  hasStrips,
  isAdding,
  addingUnit,
  handleAddToCart,
  navigate,
}) {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="flex flex-1 gap-3">
        <Button
          variant="solid"
          size="lg"
          aria-label={`Add one box of ${productName} to cart`}
          className="flex-1 bg-(--color-primary-700) hover:bg-(--color-primary-800) disabled:bg-gray-400 disabled:cursor-not-allowed py-4 rounded-xl text-lg shadow-md"
          onClick={() => handleAddToCart("box")}
          disabled={outOfStock || isAdding || isRoshetta}
          isLoading={isAdding && addingUnit === "box"}
        >
          {!(isAdding && addingUnit === "box") && (
            <>
              <ShoppingCart className="w-12 h-12" aria-hidden="true" />
              <span className="hidden sm:inline">Add Box</span>
              <span className="sm:hidden">Box</span>
            </>
          )}
        </Button>

        {hasStrips && (
          <Button
            variant="outline"
            size="lg"
            aria-label={`Add one strip of ${productName} to cart`}
            className="flex-1 bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-900/50 disabled:opacity-50 disabled:cursor-not-allowed py-4 rounded-xl text-lg border border-green-200 dark:border-green-800 shadow-sm"
            onClick={() => handleAddToCart("strip")}
            disabled={outOfStock || isAdding || isRoshetta}
            isLoading={isAdding && addingUnit === "strip"}
          >
            {!(isAdding && addingUnit === "strip") && (
              <>
                <img
                  src={stripImage}
                  alt="strip icon"
                  className="w-12 h-12 object-contain"
                />
                <span className="hidden sm:inline">Add Strip</span>
                <span className="sm:hidden">Strip</span>
              </>
            )}
          </Button>
        )}
      </div>

      <Button
        variant="outline"
        size="lg"
        className="px-8 py-4 border-2 border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 font-bold rounded-xl transition-colors text-lg"
        onClick={() => navigate(-1)}
      >
        Back
      </Button>
    </div>
  );
}
