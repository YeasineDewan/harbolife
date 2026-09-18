import { Link } from "react-router-dom";
import { ShoppingCart, Trash2 } from "lucide-react";
import { useCartLogic } from "../hooks/useCartLogic";
import EmptyCart from "./EmptyCart";
import CartItem from "./CartItem";
import CartSummary from "./CartSummary";
import Button from "../../../components/ui/Button";
import GlobalLoader from "../../../components/ui/GlobalLoader";

export default function Cart() {
  const {
    isCartLoading,
    cartItems,
    cartTotal,
    activeAction,
    isClearingCart,
    isOrdering,
    handleCreateOrder,
    handleIncrement,
    handleDecrement,
    handleRemove,
    handleClearCart,
  } = useCartLogic();

  if (isCartLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <GlobalLoader width="w-12" height="h-12" animate-spin text="(--color-primary-600)" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-(--color-surface-page) dark:bg-(--color-surface-page) py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-(--color-text-primary) dark:text-white mb-8 text-center flex justify-center items-center gap-3">
          <ShoppingCart
            className="w-8 h-8 text-(--color-primary-600)"
            aria-hidden="true"
          />
          Your Shopping Cart
        </h1>

        {cartItems.length === 0 ? (
          <EmptyCart />
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-grow w-full lg:w-2/3">
              <div className="bg-(--color-surface-card) dark:bg-(--color-panel-dark) rounded-2xl shadow-sm border border-(--color-border-base) dark:border-gray-700 overflow-hidden">
                {cartItems.map((item) => {
                  const id = item.product?._id || item._id;
                  return (
                    <CartItem
                      key={id}
                      item={item}
                      activeAction={activeAction}
                      onIncrement={handleIncrement}
                      onDecrement={handleDecrement}
                      onRemove={handleRemove}
                    />
                  );
                })}
              </div>

              <div className="flex justify-between items-center mt-6">
                <Button
                  variant="danger-ghost"
                  size="sm"
                  aria-label="Clear all items from cart"
                  disabled={isClearingCart}
                  isLoading={isClearingCart}
                  onClick={handleClearCart}
                  className="flex items-center gap-2 text-(--color-danger-600) hover:text-(--color-danger-700) font-semibold px-4 py-2 rounded-lg hover:bg-(--color-danger-50) dark:hover:bg-(--color-danger-900) transition-colors"
                >
                  {!isClearingCart && (
                    <Trash2 className="w-4 h-4" aria-hidden="true" />
                  )}
                  Clear Cart
                </Button>
                <Link
                  to="/category/pain-relief"
                  className="text-(--color-text-secondary) dark:text-gray-400 hover:text-(--color-text-primary) dark:hover:text-white font-semibold transition-colors"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>

            <div className="w-full lg:w-1/3">
              <CartSummary
                cartItems={cartItems}
                cartTotal={cartTotal}
                onCreateOrder={handleCreateOrder}
                isOrdering={isOrdering}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
