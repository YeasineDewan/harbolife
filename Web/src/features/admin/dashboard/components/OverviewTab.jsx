import {
  Coins,
  ShoppingBag,
  Package,
  Users,
  AlertTriangle,
} from "lucide-react";
import StatsCard from "../../components/StatsCard";
import RevenueChart from "./RevenueChart";

export default function OverviewTab({ stats, historical, forecast, trend }) {
  return (
    <div className="space-y-6">
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatsCard
          title="Total Revenue"
          value={`${stats.totalRevenue?.toLocaleString()} EGP`}
          icon={Coins}
          color="brand"
        />
        <StatsCard
          title="Total Orders"
          value={stats.totalOrders}
          icon={ShoppingBag}
          color="brand"
        />
        <StatsCard
          title="Total Products"
          value={stats.totalProducts}
          icon={Package}
          color="brand"
        />
        <StatsCard
          title="Total Customers"
          value={stats.totalUsers}
          icon={Users}
          color="brand"
        />
      </div>

      {/* Quick Alert bar */}
      {(stats.lowStockCount > 0 || stats.pendingOrdersCount > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {stats.lowStockCount > 0 && (
            <div className="flex items-center gap-3 p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 rounded-xl">
              <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
              <div>
                <span className="text-sm font-bold text-amber-800 dark:text-amber-300">
                  Low Stock Alert:
                </span>{" "}
                <span className="text-sm text-amber-700 dark:text-amber-400">
                  {stats.lowStockCount} items have less than 10 units remaining.
                  Check the Inventory tab.
                </span>
              </div>
            </div>
          )}
          {stats.pendingOrdersCount > 0 && (
            <div className="flex items-center gap-3 p-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/50 rounded-xl">
              <ShoppingBag className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <div>
                <span className="text-sm font-bold text-emerald-800 dark:text-emerald-300">
                  Pending Orders:
                </span>{" "}
                <span className="text-sm text-emerald-700 dark:text-emerald-400">
                  {stats.pendingOrdersCount} orders are waiting to be processed.
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Revenue History & AI Forecast Chart */}
      <RevenueChart historical={historical} forecast={forecast} trend={trend} />
    </div>
  );
}
