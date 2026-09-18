import { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import {
  useGetOrdersQuery,
  useCancelOrderMutation,
} from "../../orders/store/ordersApi";

export function useOrderHistoryLogic() {
  const { user } = useSelector((state) => state.auth);
  const { data: response, isLoading } = useGetOrdersQuery(undefined, {
    skip: !user,
    refetchOnMountOrArgChange: true,
  });
  const [cancelOrderMutation] = useCancelOrderMutation();

  const [statusFilter, setStatusFilter] = useState("all");
  const [timeFilter, setTimeFilter] = useState("6_months");
  const [cancellingId, setCancellingId] = useState(null);

  const orders = response?.orders;

  const filteredOrders = useMemo(() => {
    let result = orders ? [...orders] : [];

    if (statusFilter !== "all") {
      result = result.filter((order) => order.status === statusFilter);
    }

    const now = new Date();
    if (timeFilter === "6_months") {
      const sixMonthsAgo = new Date(now.setMonth(now.getMonth() - 6));
      result = result.filter(
        (order) => new Date(order.createdAt || order.date) >= sixMonthsAgo
      );
    } else if (timeFilter === "30_days") {
      const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));
      result = result.filter(
        (order) => new Date(order.createdAt || order.date) >= thirtyDaysAgo
      );
    }

    return result.sort(
      (a, b) =>
        new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date)
    );
  }, [orders, statusFilter, timeFilter]);

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;
    setCancellingId(orderId);
    try {
      await cancelOrderMutation(orderId).unwrap();
      toast.success("Order cancelled successfully");
    } catch (err) {
      toast.error(err.data?.message || "Failed to cancel order");
    } finally {
      setCancellingId(null);
    }
  };

  const isEmpty = !isLoading && filteredOrders.length === 0;

  return {
    isLoading,
    isEmpty,
    filteredOrders,
    statusFilter,
    setStatusFilter,
    timeFilter,
    setTimeFilter,
    cancellingId,
    handleCancelOrder,
  };
}
