import { Boxes } from "lucide-react";

export default function InventoryTab({ products }) {
  const getBadgeStyles = (status) => {
    switch (status) {
      case "Immediate Reorder":
        return "bg-rose-100 dark:bg-rose-950/30 text-rose-700 dark:text-rose-400 border-rose-200";
      case "Warning":
        return "bg-amber-100 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border-amber-200";
      case "Healthy":
        return "bg-green-100 dark:bg-green-950/30 text-green-700 dark:text-green-400 border-green-200";
      case "Out of Stock":
        return "bg-red-150 dark:bg-red-950/40 text-red-700 dark:text-red-400 border-red-300";
      default:
        return "bg-gray-100 dark:bg-gray-850 text-gray-700 dark:text-gray-400 border-gray-200";
    }
  };

  return (
    <div className="bg-(--color-surface-card) dark:bg-(--color-panel-dark) border border-(--color-border-base) dark:border-gray-800 rounded-xl p-5 shadow-sm">
      <div className="mb-5">
        <h3 className="text-lg font-bold text-(--color-text-primary) dark:text-white flex items-center gap-2">
          <Boxes className="w-5 h-5 text-(--color-primary-700)" />
          Inventory Runout Analysis & Demand Forecasting
        </h3>
        <p className="text-xs text-(--color-text-secondary)">
          Calculates sales velocity (average units sold per day in last 30 days)
          and estimates remaining days before inventory depletion
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-(--color-surface-page) dark:bg-[#2c2c2c] text-(--color-text-secondary) dark:text-gray-400 font-semibold border-b border-(--color-border-base) dark:border-gray-800">
            <tr>
              <th className="p-3 pl-4">Product Name</th>
              <th className="p-3">Current Stock</th>
              <th className="p-3">Sold (Last 30d)</th>
              <th className="p-3">Daily Velocity</th>
              <th className="p-3">Est. Days Remaining</th>
              <th className="p-3 pr-4 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-(--color-border-base) dark:divide-gray-800 text-(--color-text-body) dark:text-gray-300">
            {products.map((prod) => (
              <tr
                key={prod.productId}
                className="hover:bg-gray-50/50 dark:hover:bg-gray-850/10"
              >
                <td className="p-3 pl-4 font-semibold text-(--color-text-primary) dark:text-white max-w-[280px] truncate">
                  {prod.name}
                </td>
                <td className="p-3 font-medium">{prod.stock} units</td>
                <td className="p-3">{prod.unitsSoldLast30Days} units</td>
                <td className="p-3 text-xs">{prod.dailyVelocity} units/day</td>
                <td className="p-3">
                  {prod.daysRemaining === Infinity ? (
                    <span className="text-(--color-text-muted) italic">
                      No Sales
                    </span>
                  ) : (
                    <span
                      className={
                        prod.daysRemaining <= 7
                          ? "text-(--color-danger-500) font-bold"
                          : "font-semibold"
                      }
                    >
                      {prod.daysRemaining} days
                    </span>
                  )}
                </td>
                <td className="p-3 pr-4 text-right">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${getBadgeStyles(prod.status)}`}
                  >
                    {prod.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
