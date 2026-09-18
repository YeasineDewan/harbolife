import { Calendar, DollarSign, Package, XCircle } from "lucide-react";
import GlobalLoader from "../../../../components/ui/GlobalLoader";

export default function OrderCard({ order, cancellingId, onCancel }) {
  const total =
    order.total ??
    order.items?.reduce(
      (s, it) => s + (it.price ?? 0) * (it.quantity ?? it.NOI ?? 0),
      0
    );
  const isCancellingThis = cancellingId === order._id;

  const formatPrice = (n) =>
    (Math.round(Number(n || 0) * 100) / 100).toFixed(2);
  const formatQty = (n) =>
    Number.isInteger(Number(n)) ? String(n) : Number(n).toFixed(2);

  return (
    <div className="bg-white dark:bg-[#252525] border border-gray-200 dark:border-gray-700 rounded-2xl p-6 hover:shadow-md">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 border-b border-gray-100 dark:border-gray-800 pb-4">
        <div>
          <span className="text-sm font-bold text-gray-500 uppercase tracking-wider block mb-1">
            Order #{String(order._id).slice(-6).toUpperCase()}
          </span>
          <div className="flex items-center gap-2 text-gray-900 dark:text-white font-semibold">
            <Calendar className="w-4 h-4 text-green-600" />
            {new Date(order.createdAt || order.date).toLocaleDateString(
              "en-GB",
              {
                day: "numeric",
                month: "long",
                year: "numeric",
              }
            )}
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center justify-end gap-1 text-2xl font-black text-green-600 dark:text-green-400">
            <DollarSign className="w-5 h-5 -mr-1" />
            {formatPrice(total)}
          </div>
          <span
            className={`text-xs font-bold px-2 py-1 rounded-md uppercase ${
              order.status === "delivered"
                ? "bg-green-100 text-green-700"
                : order.status === "canceled"
                ? "bg-red-100 text-red-700"
                : "bg-yellow-100 text-yellow-700"
            }`}
          >
            {order.status || "Pending"}
          </span>
        </div>
      </div>

      <div className="mb-4">
        <ul className="divide-y divide-gray-100 dark:divide-gray-800">
          {(order.items || []).map((item, i) => (
            <li key={i} className="py-3 flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-50 dark:bg-gray-800 rounded-lg flex items-center justify-center shrink-0">
                <Package className="w-6 h-6 text-gray-400" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-gray-900 dark:text-white line-clamp-1">
                  {item.product?.name || item.name || "Product"}
                </p>
                <p className="text-sm font-medium text-gray-500">
                  Qty: {formatQty(item.quantity ?? item.NOI ?? 0)}
                </p>
              </div>
              <div className="font-bold text-gray-700 dark:text-gray-300">
                ${formatPrice(item.price)}
              </div>
            </li>
          ))}
        </ul>
      </div>

      {order.status !== "canceled" && order.status !== "delivered" && (
        <div className="flex justify-end pt-4">
          <button
            onClick={() => onCancel(order._id)}
            disabled={isCancellingThis}
            className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg font-bold disabled:opacity-50"
          >
            {isCancellingThis ? (
              <GlobalLoader width="w-5" height="h-5" animate-spin text="text-red-600" />
            ) : (
              <XCircle className="w-5 h-5" />
            )}
            Cancel Order
          </button>
        </div>
      )}
    </div>
  );
}
