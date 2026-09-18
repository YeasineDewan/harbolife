import { useProductDetailsLogic } from "../../hooks/useProductDetailsLogic";
import ProductGallery from "./components/ProductGallery";
import ProductInfo from "./components/ProductInfo";
import ProductActions from "./components/ProductActions";
import ReviewsSection from "./components/ReviewsSection";
import Button from "../../../../components/ui/Button";
import GlobalLoader from "../../../../components/ui/GlobalLoader";

export default function ProductDetails() {
  const {
    product,
    isFetching,
    isError,
    stock,
    description,
    outOfStock,
    isRoshetta,
    hasStrips,
    optimizedImage,
    isAdding,
    addingUnit,
    handleAddToCart,
    navigate,
  } = useProductDetailsLogic();

  if (isFetching) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <GlobalLoader width="w-12" height="h-12" animate-spin text="text-(--color-primary-700)" />
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="mt-40 text-center dark:text-white">
        <p className="text-2xl mb-4 font-semibold">Product not found</p>
        <Button
          variant="solid"
          size="md"
          className="bg-gray-600 hover:bg-gray-700 text-white"
          onClick={() => navigate(-1)}
        >
          Go back
        </Button>
      </div>
    );
  }

  const currentProductId = product?._id;

  return (
    <div className="max-w-6xl mx-auto mt-28 px-4 sm:px-6 lg:px-8 mb-20 text-(--color-text-primary) dark:text-white transition-colors duration-300">
      <div className="flex flex-col md:flex-row gap-10 bg-(--color-surface-card) dark:bg-[#2c2c2c] p-8 rounded-3xl shadow-xl border border-(--color-border-base) dark:border-gray-800 mb-10">
        <ProductGallery
          optimizedImage={optimizedImage}
          productName={product.name}
        />

        <div className="w-full md:w-1/2 flex flex-col justify-center">
          <ProductInfo
            name={product.name}
            price={product.price}
            description={description}
            stock={stock}
            outOfStock={outOfStock}
            isRoshetta={isRoshetta}
          />

          <ProductActions
            productName={product.name}
            outOfStock={outOfStock}
            isRoshetta={isRoshetta}
            hasStrips={hasStrips}
            isAdding={isAdding}
            addingUnit={addingUnit}
            handleAddToCart={handleAddToCart}
            navigate={navigate}
          />
        </div>
      </div>

      <ReviewsSection productId={currentProductId} />
    </div>
  );
}
