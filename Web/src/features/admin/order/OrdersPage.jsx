import { useState } from "react";
import { Search, Filter, ShoppingBag, Trash2 } from "lucide-react";
import DynamicTable from "../components/DynamicTable";
import { useDebounce } from "../../../hooks/useDebounce";
import {
  useGetOrdersQuery,
  useUpdateOrderStatusMutation,
  useGetCouriersListQuery,
  useAssignOrderToCourierMutation,
  useDeleteOrderMutation,
} from "./api/ordersApi";
import toast from "react-hot-toast";
import OrderDetailsModal from "./components/OrderDetailsModal";
import Input from "../../../components/ui/Input";

export default function OrdersPage() {
  const [page, setPage] = useState(1);
  const limit = 10;

  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 500);
  const [statusFilter, setStatusFilter] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [selectedOrderId, setSelectedOrderId] = useState(null);

  const { data, isLoading } = useGetOrdersQuery({
    page,
    limit,
    search: debouncedSearch,
    status: statusFilter,
    startDate,
    endDate,
  });

  const { data: couriersData } = useGetCouriersListQuery();
  const couriersList = couriersData?.data || [];

  const [updateOrderStatus, { isLoading: isUpdatingStatus }] =
    useUpdateOrderStatusMutation();

  const [assignOrder, { isLoading: isAssigning }] =
    useAssignOrderToCourierMutation();

  const [deleteOrder, { isLoading: isDeleting }] = useDeleteOrderMutation();

  const ordersData = data?.data?.orders || [];
  const pagination = data?.data?.pagination || { totalPages: 1 };

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

  const handleAssignCourier = async (e, orderId) => {
    e.stopPropagation();
    const courierId = e.target.value;
    if (!courierId) return;

    try {
      await assignOrder({ orderId, courierId }).unwrap();
      toast.success("Order assigned to courier successfully");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to assign courier");
    }
  };

  const handleDeleteOrder = async (e, id) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this order?")) {
      try {
        await deleteOrder(id).unwrap();
        toast.success("Order deleted successfully");
      } catch (error) {
        toast.error(error?.data?.message || "Failed to delete order");
      }
    }
  };

  const statusColors = {
    pending:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500",
    shipped: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-500",
    delivered:
      "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500",
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
      label: "Customer",
      render: (_, row) => (
        <div className="flex flex-col">
          <span className="font-semibold text-(--color-text-primary) dark:text-white">
            {row.user?.name || "Unknown User"}
          </span>
          <span className="text-xs text-(--color-text-secondary)">
            {row.user?.email || "No email"}
          </span>
        </div>
      ),
    },
    {
      key: "total",
      label: "Total Amount",
      render: (val) => (
        <span className="font-semibold text-(--color-text-primary) dark:text-white">
          ${val?.toFixed(2)}
        </span>
      ),
    },
    {
      key: "courier",
      label: "Courier",
      render: (val, row) => (
        <div onClick={(e) => e.stopPropagation()}>
          <select
            value={val || ""}
            onChange={(e) => handleAssignCourier(e, row._id)}
            disabled={
              isAssigning ||
              row.status === "canceled" ||
              row.status === "delivered"
            }
            className="text-xs px-2 py-1.5 rounded-lg border border-(--color-border-input) dark:border-gray-700 bg-(--color-surface-input) dark:bg-[#252525] text-(--color-text-primary) dark:text-white outline-none cursor-pointer"
          >
            <option value="" disabled>
              Assign...
            </option>
            {couriersList.map((courier) => (
              <option key={courier._id} value={courier._id}>
                {courier.name}
              </option>
            ))}
          </select>
        </div>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (val, row) => (
        <div onClick={(e) => e.stopPropagation()}>
          <select
            value={val}
            onChange={(e) => handleStatusChange(e, row._id)}
            disabled={isUpdatingStatus || val === "canceled"}
            className={`text-xs font-bold px-3 py-1.5 rounded-lg border-none outline-none cursor-pointer appearance-none text-center ${statusColors[val] || ""}`}
          >
            <option value="pending">Pending</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="canceled">Canceled</option>
          </select>
        </div>
      ),
    },
    {
      key: "createdAt",
      label: "Date",
      render: (val) => new Date(val).toLocaleDateString("en-GB"),
    },
    {
      key: "actions",
      label: "Actions",
      render: (_, row) => (
        <button
          onClick={(e) => handleDeleteOrder(e, row._id)}
          disabled={isDeleting}
          className="p-2 text-gray-400 hover:text-red-500 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
          title="Delete Order"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-(--color-text-primary) dark:text-white">
            Orders Management
          </h1>
          <p className="text-sm text-(--color-text-secondary) dark:text-gray-400 mt-1">
            Track, update, and manage customer orders.
          </p>
        </div>
      </div>

      <div className="bg-(--color-surface-card) dark:bg-(--color-panel-dark) p-4 rounded-xl shadow-sm border border-(--color-border-base) dark:border-gray-800 flex flex-col lg:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Input
            type="text"
            placeholder="Search orders, customers..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            icon={<Search className="w-4 h-4 text-(--color-text-muted)" />}
            className="border-(--color-border-input) dark:border-gray-700 bg-(--color-surface-input) dark:bg-[#252525]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          <div className="relative flex-1 sm:w-36">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-(--color-text-muted) z-10 pointer-events-none" />
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-(--color-border-input) dark:border-gray-700 bg-(--color-surface-input) dark:bg-[#252525] text-(--color-text-primary) dark:text-white focus:ring-2 focus:ring-(--color-primary-500) outline-none transition-all cursor-pointer appearance-none text-sm"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="canceled">Canceled</option>
            </select>
          </div>

          <div className="flex items-center gap-2 flex-1 sm:w-auto">
            <input
              type="date"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2.5 text-sm rounded-xl border border-(--color-border-input) dark:border-gray-700 bg-(--color-surface-input) dark:bg-[#252525] text-(--color-text-primary) dark:text-white outline-none focus:ring-2 focus:ring-(--color-primary-500)"
            />
            <span className="text-(--color-text-muted)">-</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2.5 text-sm rounded-xl border border-(--color-border-input) dark:border-gray-700 bg-(--color-surface-input) dark:bg-[#252525] text-(--color-text-primary) dark:text-white outline-none focus:ring-2 focus:ring-(--color-primary-500)"
            />
          </div>
        </div>
      </div>

      <DynamicTable
        columns={columns}
        data={ordersData}
        rowKey="_id"
        isLoading={isLoading}
        currentPage={page}
        totalPages={pagination.totalPages}
        onPageChange={setPage}
        emptyMessage="No orders found."
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
