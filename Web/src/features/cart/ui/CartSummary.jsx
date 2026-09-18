import { useState } from "react";
import { MapPin, CreditCard, Banknote } from "lucide-react";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";

export default function CartSummary({
  cartItems,
  cartTotal,
  onCreateOrder,
  isOrdering,
}) {
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);
  const [formData, setFormData] = useState({
    street: "",
    city: "",
    phone: "",
    paymentMethod: "COD",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleProceed = () => {
    setShowCheckoutForm(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreateOrder(formData);
  };

  return (
    <div className="bg-(--color-surface-card) dark:bg-(--color-panel-dark) rounded-2xl shadow-sm border border-(--color-border-base) dark:border-gray-700 p-6 sticky top-24">
      <h2 className="text-xl font-bold text-(--color-text-primary) dark:text-white mb-6">
        Order Summary
      </h2>

      <div className="flex justify-between items-center mb-4 text-(--color-text-secondary) dark:text-gray-400">
        <span>Total Items</span>
        <span className="font-semibold text-(--color-text-primary) dark:text-white">
          {cartItems.length} Unique
        </span>
      </div>

      <div className="flex justify-between items-center mb-6 pt-4 border-t border-(--color-border-base) dark:border-gray-700">
        <span className="text-lg font-bold text-(--color-text-primary) dark:text-white">
          Subtotal
        </span>
        <span className="text-2xl font-black text-(--color-primary-600) dark:text-green-400">
          ${cartTotal.toFixed(2)}
        </span>
      </div>

      {!showCheckoutForm ? (
        <Button
          variant="solid"
          size="lg"
          fullWidth
          onClick={handleProceed}
          className="bg-(--color-primary-700) hover:bg-(--color-primary-800)"
        >
          Proceed to Checkout
        </Button>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="space-y-4 border-t border-(--color-border-base) dark:border-gray-700 pt-4 mt-4"
        >
          <Input
            label="Street Address"
            type="text"
            name="street"
            required
            value={formData.street}
            onChange={handleChange}
            icon={<MapPin className="w-4 h-4 text-(--color-text-muted)" />}
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="City"
              type="text"
              name="city"
              required
              value={formData.city}
              onChange={handleChange}
            />
            <Input
              label="Phone"
              type="text"
              name="phone"
              required
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          <div className="pt-2">
            <label className="block text-sm font-medium text-(--color-text-label) dark:text-gray-300 mb-2">
              Payment Method
            </label>
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-3 p-3 border border-(--color-border-base) dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="COD"
                  checked={formData.paymentMethod === "COD"}
                  onChange={handleChange}
                  className="w-4 h-4 text-(--color-primary-600) focus:ring-(--color-primary-500)"
                />
                <Banknote className="w-5 h-5 text-(--color-text-muted)" />
                <span className="text-(--color-text-primary) dark:text-white font-medium text-sm">
                  Cash on Delivery
                </span>
              </label>

              <label className="flex items-center gap-3 p-3 border border-(--color-border-base) dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="card"
                  checked={formData.paymentMethod === "card"}
                  onChange={handleChange}
                  className="w-4 h-4 text-(--color-primary-600) focus:ring-(--color-primary-500)"
                />
                <CreditCard className="w-5 h-5 text-(--color-text-muted)" />
                <span className="text-(--color-text-primary) dark:text-white font-medium text-sm">
                  Credit Card (Paymob)
                </span>
              </label>
            </div>
          </div>

          <Button
            type="submit"
            variant="solid"
            size="lg"
            fullWidth
            isLoading={isOrdering}
            className="w-full mt-4 bg-(--color-primary-700) hover:bg-(--color-primary-800)"
          >
            Confirm Order
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            fullWidth
            onClick={() => setShowCheckoutForm(false)}
            className="w-full mt-2 py-2 text-sm text-(--color-text-secondary) dark:text-gray-400 hover:text-(--color-text-primary) dark:hover:text-white"
          >
            Back to Summary
          </Button>
        </form>
      )}

      <div className="mt-6 text-center text-sm text-(--color-text-secondary) dark:text-gray-400 flex flex-col gap-1">
        <span>Secure checkout</span>
        <span>2-days return policy</span>
      </div>
    </div>
  );
}
