import { Link } from "react-router-dom";
import { ShoppingCart, ArrowLeft } from "lucide-react";
import Button from "../../../components/ui/Button";

export default function EmptyCart() {
  return (
    <div className="bg-(--color-surface-card) dark:bg-(--color-panel-dark) rounded-2xl p-12 text-center shadow-sm border border-(--color-border-base) dark:border-gray-700 max-w-2xl mx-auto">
      <ShoppingCart
        className="w-20 h-20 text-(--color-text-muted) dark:text-gray-600 mx-auto mb-6"
        aria-hidden="true"
      />
      <h2 className="text-2xl font-bold text-(--color-text-primary) dark:text-white mb-4">
        Your cart is empty
      </h2>
      <p className="text-(--color-text-secondary) dark:text-gray-400 mb-8">
        Browse products and add them to your cart.
      </p>
      <Button
        as={Link}
        to="/category/pain-relief"
        variant="solid"
        size="lg"
        className="inline-flex items-center gap-2 bg-(--color-primary-700) hover:bg-(--color-primary-800)"
      >
        <ArrowLeft className="w-5 h-5" aria-hidden="true" />
        Continue Shopping
      </Button>
    </div>
  );
}
