import { useGetCourierOrdersQuery } from "../../api/courierApi";
import { Package, Truck, CheckCircle, XCircle } from "lucide-react";
import GlobalLoader from "../../../../components/ui/GlobalLoader";

export default function CourierOverview() {
  const { data, isLoading } = useGetCourierOrdersQuery();

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <GlobalLoader />
      </div>
    );
  }

  const orders = data?.data || [];

  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    shipped: orders.filter((o) => o.status === "shipped").length,
    delivered: orders.filter((o) => o.status === "delivered").length,
    canceled: orders.filter((o) => o.status === "canceled").length,
  };

  const statCards = [
    {
      label: "Active Deliveries",
      value: stats.pending + stats.shipped,
      icon: Truck,
      color: "text-blue-500",
      bg: "bg-blue-100 dark:bg-blue-900/20",
    },
    {
      label: "Completed",
      value: stats.delivered,
      icon: CheckCircle,
      color: "text-green-500",
      bg: "bg-green-100 dark:bg-green-900/20",
    },
    {
      label: "Canceled",
      value: stats.canceled,
      icon: XCircle,
      color: "text-red-500",
      bg: "bg-red-100 dark:bg-red-900/20",
    },
    {
      label: "Total Assigned",
      value: stats.total,
      icon: Package,
      color: "text-purple-500",
      bg: "bg-purple-100 dark:bg-purple-900/20",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-(--color-text-primary) dark:text-white">
          Courier Overview
        </h1>
        <p className="text-sm text-(--color-text-secondary) dark:text-gray-400 mt-1">
          Summary of your assigned deliveries.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-(--color-surface-card) dark:bg-[#1e1e1e] p-6 rounded-2xl border border-(--color-border-base) dark:border-gray-800 flex items-center gap-4"
            >
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center ${stat.bg} ${stat.color}`}
              >
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-(--color-text-secondary) dark:text-gray-400">
                  {stat.label}
                </p>
                <h3 className="text-2xl font-bold text-(--color-text-primary) dark:text-white mt-1">
                  {stat.value}
                </h3>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
