export default function OrderFilters({
  statusFilter,
  setStatusFilter,
  timeFilter,
  setTimeFilter,
}) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-8">
      <div className="flex-1">
        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
          Show
        </label>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full bg-white dark:bg-[#252525] border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg p-3 outline-none focus:border-green-600 font-medium appearance-none"
        >
          <option value="all">All orders</option>
          <option value="pending">Pending orders</option>
          <option value="shipped">Shipped orders</option>
          <option value="delivered">Delivered orders</option>
          <option value="canceled">Canceled orders</option>
        </select>
      </div>
      <div className="flex-1">
        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
          From
        </label>
        <select
          value={timeFilter}
          onChange={(e) => setTimeFilter(e.target.value)}
          className="w-full bg-white dark:bg-[#252525] border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg p-3 outline-none focus:border-green-600 font-medium appearance-none"
        >
          <option value="30_days">Last 30 days</option>
          <option value="6_months">Last 6 months</option>
          <option value="all_time">All time</option>
        </select>
      </div>
    </div>
  );
}
