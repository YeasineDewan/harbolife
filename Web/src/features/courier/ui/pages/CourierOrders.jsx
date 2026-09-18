import { useState, useMemo } from "react";
import { Search, Filter, ShoppingBag } from "lucide-react";
import DynamicTable from "../../../admin/components/DynamicTable";
import { useDebounce } from "../../../../hooks/useDebounce";
import {
  useGetCourierOrdersQuery,
} from "../../api/courierApi";
import { useUpdateOrderStatusMutation } from "../../../admin/order/api/ordersApi";
import toast from "react-hot-toast";
import OrderDetailsModal from "../../../admin/order/components/OrderDetailsModal";
import Input from "../../../../components/ui/Input";

export default function CourierOrders() {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 500);
  const [statusFilter, setStatusFilter] = useState("");

  const [selectedOrderId, setSelectedOrderId] = useState(null);

  const { data, isLoading } = useGetCourierOrdersQuery({
    status: statusFilter,
  });

  const [updateOrderStatus, { isLoading: isUpdatingStatus }] =
    useUpdateOrderStatusMutation();

  const activeOrders = useMemo(() => {
    let orders = data?.data || [];

    orders = orders.filter((order) => order.status !== "delivered");

    if (debouncedSearch) {
      const lowerQuery = debouncedSearch.toLowerCase();
      orders = orders.filter(
        (o) =>
          o._id.toLowerCase().includes(lowerQuery) ||
          o.user?.name?.toLowerCase().includes(lowerQuery) ||
          o.user?.phone?.includes(lowerQuery),
      );
    }
    return orders;
  }, [data, debouncedSearch]);

  const handleStatusChange = async (e, id) => {
    e.stopPropagation();
    const newStatus = e.target.value;
    try {
      await updateOrderStatus({ id, status: newStatus }).unwrap();
      toast.success("Order status updated successfully");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to update status");
    }
  };

  const statusColors = {
    pending:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500",
    shipped: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-500",
    canceled: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-500",
  };

  const columns = [
    {
      key: "id",
      label: "Order ID",
      render: (_, row) => (
        <span className="font-mono text-sm text-(--color-text-secondary) dark:text-gray-400">
          #{row._id.slice(-6).toUpperCase()}
        </span>
      ),
    },
    {
      key: "user",
      label: "Customer Info",
      render: (_, row) => (
        <div className="flex flex-col">
          <span className="font-semibold text-(--color-text-primary) dark:text-white">
            {row.user?.name || "Unknown User"}
          </span>
          <span className="text-xs text-(--color-text-secondary)">
            {row.user?.phone || "No phone"}
          </span>
        </div>
      ),
    },
    {
      key: "address",
      label: "Area",
      render: (_, row) => (
        <span className="text-sm text-(--color-text-primary) dark:text-white">
          {row.address?.city || row.address || "N/A"}
        </span>
      ),
    },
    {
      key: "total",
      label: "Amount to Collect",
      render: (val, row) => (
        <span className="font-semibold text-(--color-text-primary) dark:text-white">
          {row.paymentMethod === "COD" ? `$${val?.toFixed(2)}` : "Paid Online"}
        </span>
      ),
    },
    {
      key: "status",
      label: "Update Status",
      render: (val, row) => (
        <div onClick={(e) => e.stopPropagation()}>
          <select
            value={val}
            onChange={(e) => handleStatusChange(e, row._id)}
            disabled={isUpdatingStatus || val === "canceled"}
            className={`text-xs font-bold px-3 py-1.5 rounded-lg border-none outline-none cursor-pointer appearance-none text-center ${statusColors[val] || ""}`}
          >
            <option value="pending">Pending</option>
            <option value="shipped">Out for Delivery</option>
            <option value="delivered">Delivered</option>
            <option value="canceled">Canceled</option>
          </select>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-(--color-text-primary) dark:text-white">
            My Deliveries
          </h1>
          <p className="text-sm text-(--color-text-secondary) dark:text-gray-400 mt-1">
            Manage and update your assigned orders.
          </p>
        </div>
      </div>

      <div className="bg-(--color-surface-card) dark:bg-(--color-panel-dark) p-4 rounded-xl shadow-sm border border-(--color-border-base) dark:border-gray-800 flex flex-col sm:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Input
            type="text"
            placeholder="Search by ID, name or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={<Search className="w-4 h-4 text-(--color-text-muted)" />}
            className="border-(--color-border-input) dark:border-gray-700 bg-(--color-surface-input) dark:bg-[#252525]"
          />
        </div>

        <div className="relative w-full sm:w-48 shrink-0">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-(--color-text-muted) z-10 pointer-events-none" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-(--color-border-input) dark:border-gray-700 bg-(--color-surface-input) dark:bg-[#252525] text-(--color-text-primary) dark:text-white focus:ring-2 focus:ring-(--color-primary-500) outline-none transition-all cursor-pointer appearance-none text-sm"
          >
            <option value="">All Active</option>
            <option value="pending">Pending</option>
            <option value="shipped">Out for Delivery</option>
          </select>
        </div>
      </div>

      <DynamicTable
        columns={columns}
        data={activeOrders}
        rowKey="_id"
        isLoading={isLoading}
        currentPage={page}
        totalPages={1}
        onPageChange={setPage}
        emptyMessage="No active deliveries found."
        emptyIcon={ShoppingBag}
        onRowClick={(row) => setSelectedOrderId(row._id)}
      />

      {selectedOrderId && (
        <OrderDetailsModal
          isOpen={!!selectedOrderId}
          onClose={() => setSelectedOrderId(null)}
          orderId={selectedOrderId}
        />
      )}
    </div>
  );
}
