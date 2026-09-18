import { useState } from "react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import {
  useGetCartQuery,
  useRemoveFromCartMutation,
  useClearCartMutation,
  useAddToCartMutation,
  useUpdateCartItemMutation,
} from "../store/cartApi";
import { useCreateOrderMutation } from "../../orders/store/ordersApi";
import emailjs from '@emailjs/browser';

export const useCartLogic = () => {
  const { isAuthenticated ,user } = useSelector((state) => state.auth);

  const { data: cartData, isLoading: isCartLoading } = useGetCartQuery(
    undefined,
    {
      skip: !isAuthenticated,
    },
  );

  const [removeFromCart] = useRemoveFromCartMutation();
  const [clearCart, { isLoading: isClearingCart }] = useClearCartMutation();
  const [createOrder, { isLoading: isOrdering }] = useCreateOrderMutation();
  const [addToCart] = useAddToCartMutation();
  const [updateCartItem] = useUpdateCartItemMutation();

  const [activeAction, setActiveAction] = useState({ id: null, type: null });

  const cartItems = cartData?.data?.items || [];

  const cartTotal = cartItems.reduce((acc, item) => {
    const price = Number(item.price ?? item.product?.price ?? 0);
    const qty = item.quantity ?? item.NOI ?? 1;

    const stripsPerBox =
      item.product?.strips_per_box ||
      item.product?.strip_count ||
      item.product?.stripsPerBox ||
      0;
    const hasStrips = item.product?.has_strips || stripsPerBox > 0;

    const unitPrice =
      hasStrips && stripsPerBox > 0 ? price / stripsPerBox : price;

    return acc + unitPrice * qty;
  }, 0);

  const handleCreateOrder = async (checkoutFormData) => {
    const formattedItems = cartItems.map((item) => ({
      product: item.product?._id || item._id,
      quantity: item.quantity ?? item.NOI ?? 1,
      name: item.product?.name || "Product",
      price: item.price || 0
    }));

    const payload = {
      items: formattedItems,
      address: {
        street: checkoutFormData.street,
        city: checkoutFormData.city,
        phone: checkoutFormData.phone,
      },
      paymentMethod: checkoutFormData.paymentMethod,
    };

    try {
      const response = await createOrder(payload).unwrap();

      if (response.checkoutUrl) {
        toast.loading("Redirecting to secure payment...", { duration: 1500 });
        setTimeout(() => {
          window.location.href = response.checkoutUrl;
        }, 800);
      } else {
        toast.success("Order created successfully!");
        clearCart();
        
        try {
          const itemsHtml = formattedItems.map(
            item => `<tr>
                      <td style="padding:8px 0; border-bottom:1px solid #eee;">${item.name}</td>
                      <td style="padding:8px 0; text-align:center; border-bottom:1px solid #eee;">${item.quantity}</td>
                    </tr>`
          ).join('');

          await emailjs.send(
            'service_noarme9',
            'template_2utqjlm', 
            {
              user_name: user?.name || "Customer",      
              user_email: user?.email || "test@test.com",
              order_id: response.order?._id || "N/A",   
              cost_total: response.order?.total || 0,   
              items_html: itemsHtml                     
            },
            'j-3XGK0Gpytzm5UwR'         
          );
        } catch (emailErr) {
          console.error("Failed to send order email:", emailErr);
        }
      }
    } catch (error) {
      console.error("Create Order Error:", error);
      toast.error(
        error?.data?.message || "Failed to create order. Please try again.",
      );
    }
};

  const handleIncrement = async (item, isStripItem, stripsPerBox) => {
    const id = item.product?._id || item._id;

    const addQty = isStripItem ? 1 : stripsPerBox > 0 ? stripsPerBox : 1;

    setActiveAction({ id, type: "inc" });
    try {
      await addToCart({ productId: id, quantity: addQty }).unwrap();
      toast.success("Quantity updated");
    } catch (err) {
      toast.error("Failed to increase quantity", err);
    } finally {
      setActiveAction({ id: null, type: null });
    }
  };

  const handleDecrement = async (item, isStripItem, stripsPerBox) => {
    const id = item.product?._id || item._id;
    const currentQty = item.quantity ?? item.NOI ?? 1;

    const subQty = isStripItem ? 1 : stripsPerBox > 0 ? stripsPerBox : 1;
    const newQty = currentQty - subQty;

    setActiveAction({ id, type: "dec" });
    try {
      if (newQty < 1) {
        await removeFromCart(id).unwrap();
        toast.success("Item removed from cart");
      } else {
        await updateCartItem({ productId: id, quantity: newQty }).unwrap();
        toast.success("Quantity updated");
      }
    } catch (err) {
      toast.error("Failed to decrease quantity", err);
    } finally {
      setActiveAction({ id: null, type: null });
    }
  };

  const handleRemove = async (id) => {
    setActiveAction({ id, type: "rem" });
    try {
      await removeFromCart(id).unwrap();
      toast.success("Item removed");
    } catch (err) {
      toast.error("Failed to remove item", err);
    } finally {
      setActiveAction({ id: null, type: null });
    }
  };

  const handleClearCart = async () => {
    try {
      await clearCart().unwrap();
      toast.success("Cart cleared");
    } catch (e) {
      toast.error("Failed to clear cart", e);
    }
  };

  return {
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
  };
};
