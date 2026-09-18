import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useGetProductByIdQuery } from "../api/productsApi";
import { useAddToCartMutation } from "../../cart/store/cartApi";
import { optimizeCloudinaryUrl } from "../../../utils/productUtils";

export function useProductDetailsLogic() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);

  const {
    data: response,
    isLoading: isFetching,
    isError,
  } = useGetProductByIdQuery(id);
  const [addToCart, { isLoading: isAdding }] = useAddToCartMutation();

  const [addingUnit, setAddingUnit] = useState(null);

  const product = response?.data;

  const baseStock =
    product?.stock !== undefined ? product.stock : product?.pieces || 0;
  const description = product?.description || product?.desc || "";
  const isRoshetta = product?.requires_prescription || product?.IsRoshetta;

  const hasStrips = product?.has_strips || product?.stripsPerBox > 0;
  const stripsPerBox =
    product?.strips_per_box ||
    product?.strip_count ||
    product?.stripsPerBox ||
    1;

  const outOfStock = baseStock === 0;

  let displayStock = `${baseStock} items`;
  if (hasStrips && stripsPerBox > 0) {
    const boxes = Math.floor(baseStock / stripsPerBox);
    const remainingStrips = baseStock % stripsPerBox;
    displayStock =
      remainingStrips > 0
        ? `${boxes} Boxes & ${remainingStrips} Strips`
        : `${boxes} Boxes`;
  }

  const optimizedImage = product
    ? optimizeCloudinaryUrl(product.image) || "/placeholder.png"
    : "/placeholder.png";

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

  return {
    product,
    isFetching,
    isError,
    stock: displayStock,
    description,
    outOfStock,
    isRoshetta,
    hasStrips,
    optimizedImage,
    isAdding,
    addingUnit,
    handleAddToCart,
    navigate,
  };
}
  