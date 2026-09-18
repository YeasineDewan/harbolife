import { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { ShoppingCart, Star, Heart } from "lucide-react";
import toast from "react-hot-toast";

import { useAddToCartMutation } from "../../../cart/store/cartApi";
import {
  useToggleSavedProductMutation,
  useGetSavedProductsQuery,
} from "../../api/productsApi";

import stripImage from "../../../../assets/strip.webp";
import { optimizeCloudinaryUrl } from "../../../../utils/productUtils";
import Button from "../../../../components/ui/Button";
import GlobalLoader from "../../../../components/ui/GlobalLoader";

export default function ProductCard({ product, priority, className = "" }) {
  const { isAuthenticated } = useSelector((state) => state.auth);

  const [addToCart, { isLoading: isAdding }] = useAddToCartMutation();
  const [addingUnit, setAddingUnit] = useState(null);

  const { data: savedProductsRes } = useGetSavedProductsQuery(undefined, {
    skip: !isAuthenticated,
  });
  const [toggleSave, { isLoading: isTogglingSave }] =
    useToggleSavedProductMutation();

  const rawData = savedProductsRes?.data;
  const savedItemsList = Array.isArray(rawData) ? rawData : [];

  const isSavedByMe = savedItemsList.some(
    (item) => (typeof item === "string" ? item : item._id) === product._id,
  );

  const baseStock =
    product.stock !== undefined ? product.stock : product.pieces || 0;
  const description = product.description || product.desc || "";
  const hasStrips = product.has_strips || product.stripsPerBox > 0;
  const stripsPerBox =
    product.strips_per_box || product.strip_count || product.stripsPerBox || 1;
  const outOfStock = baseStock === 0;

  const rating = product.rating || product.ratingsAverage || 0;
  const reviewsCount = product.ratingsQuantity || product.numReviews || 0;

  let displayStock = `${baseStock} items`;
  if (hasStrips && stripsPerBox > 0) {
    const boxes = Math.floor(baseStock / stripsPerBox);
    const remainingStrips = baseStock % stripsPerBox;
    displayStock =
      remainingStrips > 0
        ? `${boxes} Boxes & ${remainingStrips} Strips`
        : `${boxes} Boxes`;
  }

  const optimizedImage =
    optimizeCloudinaryUrl(product.image) || "/placeholder.png";

  const handleAddToCart = async (unit) => {
    if (!isAuthenticated) {
      toast.error("Please login to add items");
      return;
    }
    setAddingUnit(unit);

    let qtyToSend = 1;
    if (hasStrips && stripsPerBox > 0) {
      qtyToSend = unit === "box" ? stripsPerBox : 1;
    }

    try {
      await addToCart({ productId: product._id, quantity: qtyToSend }).unwrap();
      toast.success("Item added to cart!");
    } catch (err) {
      toast.error(err.data?.message || "Failed to add item");
    } finally {
      setAddingUnit(null);
    }
  };

  const handleToggleSave = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.error("Please login to save items");
      return;
    }

    try {
      const response = await toggleSave(product._id).unwrap();

      toast.success(
        response.isSaved ? "Added to wishlist" : "Removed from wishlist",
      );
    } catch (err) {
      toast.error(err.data?.message || "Failed to update saved items");
    }
  };

  return (
    <div
      className={`flex flex-col justify-between h-full p-3 rounded-xl duration-300 bg-white dark:bg-(--color-surface-card) shadow-sm hover:shadow-lg ${
        product.requires_prescription || product.IsRoshetta
          ? "border border-(--color-danger-500) shadow-[0_0_4px_rgba(220,53,69,0.5)]"
          : "border border-(--color-border-base)"
      } ${className}`}
    >
      <div className="relative h-32 sm:h-36 mb-3">
        <Link
          to={`/product/${product._id}`}
          className="w-full h-full p-2 rounded-lg bg-white dark:bg-(--color-surface-card) border border-(--color-border-base) flex justify-center items-center overflow-hidden"
        >
          <img
            src={optimizedImage}
            alt={product.name}
            className="max-w-full max-h-full object-contain"
            loading={priority ? "eager" : "lazy"}
            fetchPriority={priority ? "high" : "auto"}
            decoding="async"
          />
        </Link>

        <button
          onClick={handleToggleSave}
          disabled={isTogglingSave}
          title={isSavedByMe ? "Remove from saved" : "Save this item"}
          className="absolute top-2 right-2 z-10 flex items-center gap-1 bg-white/90 dark:bg-(--color-panel-dark)/90 backdrop-blur-sm px-2 py-1 rounded-full shadow-sm hover:scale-105 transition-all disabled:opacity-50"
        >
          <Heart
            className={`w-3.5 h-3.5 md:w-4 md:h-4 transition-colors ${
              isSavedByMe
                ? "fill-(--color-danger-500) text-(--color-danger-500)"
                : "text-(--color-text-secondary)"
            }`}
          />
          <span className="text-[10px] md:text-xs font-bold text-(--color-text-primary)">
            {product.save_count || 0}
          </span>
        </button>
      </div>

      <div className="flex flex-col grow justify-center">
        <p className="text-[11px] text-(--color-text-secondary) mb-1 font-medium">
          {displayStock} in stock
        </p>

        <h4 className="font-bold text-sm text-(--color-text-primary) mb-1 line-clamp-2 hover:text-(--color-primary-600) transition-colors">
          <Link to={`/product/${product._id}`}>{product.name}</Link>
        </h4>

        <div className="flex items-center gap-1 mb-1">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-3 h-3 ${
                  star <= rating
                    ? "text-(--color-warning-400) fill-(--color-warning-400)"
                    : "text-(--color-border-input) dark:text-(--color-border-base)"
                }`}
              />
            ))}
          </div>
          <span className="text-[10px] text-(--color-text-secondary)">
            ({reviewsCount})
          </span>
        </div>

        <p className="text-[11px] text-(--color-text-secondary) mb-2 line-clamp-1">
          {description}
        </p>

        {(product.requires_prescription || product.IsRoshetta) && (
          <p className="text-(--color-danger-600) dark:text-(--color-danger-400) text-[11px] font-bold mb-2">
            Needs Prescription
          </p>
        )}

        <div className="flex justify-between items-center mt-auto pt-2 border-t border-(--color-border-base) gap-1">
          <p className="text-md font-black text-(--color-text-primary)">
            ${product.price}
          </p>

          <div className="flex gap-1">
            {hasStrips && (
              <Button
                variant="solid"
                size="icon"
                aria-label={`Add one strip of ${product.name} to cart`}
                className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-(--color-primary-700) hover:bg-(--color-primary-800) disabled:bg-(--color-text-muted) flex justify-center items-center transition-transform active:scale-95 text-white"
                disabled={
                  outOfStock ||
                  isAdding ||
                  product.requires_prescription ||
                  product.IsRoshetta ||
                  baseStock < 1
                }
                onClick={() => handleAddToCart("strip")}
              >
                {isAdding && addingUnit === "strip" ? (
                  <GlobalLoader
                    width="w-4"
                    height="h-4"
                    text="text-white"
                    animate-spin
                    aria-hidden="true"
                  />
                ) : (
                  <img
                    src={stripImage}
                    alt="strip icon"
                    className="w-5 h-5 md:w-7 md:h-7 object-contain"
                  />
                )}
              </Button>
            )}
            <Button
              variant="outline"
              size="icon"
              aria-label={`Add one box of ${product.name} to cart`}
              className="w-8 h-8 md:w-9 md:h-9 rounded-full border-2 border-(--color-primary-700) text-(--color-primary-700) hover:bg-(--color-primary-700) hover:text-white disabled:border-(--color-text-muted) disabled:text-(--color-text-muted) active:scale-95 flex justify-center items-center transition-colors"
              disabled={
                outOfStock ||
                isAdding ||
                product.requires_prescription ||
                product.IsRoshetta ||
                (hasStrips ? baseStock < stripsPerBox : baseStock < 1)
              }
              onClick={() => handleAddToCart("box")}
            >
              {isAdding && addingUnit === "box" ? (
                <GlobalLoader
                  width="w-4"
                  height="h-4"
                  animate-spin
                  text="text-white"
                  aria-hidden="true"
                />
              ) : (
                <ShoppingCart
                  className="w-4 h-4 md:w-5 md:h-5"
                  aria-hidden="true"
                />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
