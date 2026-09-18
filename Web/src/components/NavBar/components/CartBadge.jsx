import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { ShoppingCart } from "lucide-react";
import { useGetCartQuery } from "../../../features/cart/store/cartApi";

export default function CartBadge() {
  const { isAuthenticated } = useSelector((state) => state.auth);

  const { data: cartData } = useGetCartQuery(undefined, {
    skip: !isAuthenticated,
  });

  const cartItems = cartData?.data?.items || [];
  const cartCount = cartItems.length;

  return (
    <Link
      to="/cart"
      aria-label={`View Cart, ${cartCount} items`}
      className="relative text-white hover:text-(--color-primary-200) transition-colors flex items-center"
    >
      <ShoppingCart className="w-6 h-6" aria-hidden="true" />
      {cartCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-(--color-danger-600) text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-(--color-primary-700)">
          {cartCount}
        </span>
      )}
    </Link>
  );
}