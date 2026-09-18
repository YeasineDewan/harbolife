/* eslint-disable no-unused-vars */
import { Package } from "lucide-react";
import Pagination from "../../../components/ui/Pagination";

export default function DynamicTable({
  columns = [],
  data = [],
  rowKey = "_id",
  isLoading = false,
  currentPage,
  totalPages,
  onPageChange,
  emptyMessage = "No records found.",
  emptyIcon: EmptyIcon = Package,
  onRowClick,
}) {
  const alignClass = (align) => {
    if (align === "center") return "text-center";
    if (align === "right") return "text-right";
    return "text-left";
  };

  return (
    <div className="w-full">
      <div className="overflow-x-auto rounded-xl border border-(--color-border-base) dark:border-(--color-border-subtle) bg-(--color-surface-card) dark:bg-(--color-panel-dark) shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-(--color-border-base) dark:border-(--color-border-subtle) bg-(--color-surface-page)/80 dark:bg-[#252525]">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-(--color-text-secondary) dark:text-gray-400 ${alignClass(col.align)}`}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100 dark:divide-gray-800/60">
            {isLoading ? (
              <SkeletonRows columns={columns} count={6} />
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="py-16">
                  <div className="flex flex-col items-center justify-center text-center">
                    <div className="w-14 h-14 rounded-2xl bg-(--color-surface-muted) dark:bg-gray-800 flex items-center justify-center mb-4">
                      <EmptyIcon className="w-7 h-7 text-(--color-text-muted) dark:text-gray-600" />
                    </div>
                    <p className="text-(--color-text-secondary) dark:text-gray-400 font-medium">
                      {emptyMessage}
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              data.map((row) => (
                <tr
                  key={row[rowKey]}
                  onClick={() => onRowClick && onRowClick(row)}
                  className={`hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors ${onRowClick ? "cursor-pointer" : ""}`}
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={`px-5 py-4 text-(--color-text-body) dark:text-gray-300 font-medium ${alignClass(col.align)}`}
                    >
                      {col.render
                        ? col.render(row[col.key], row)
                        : (row[col.key] ?? "—")}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {!isLoading && totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
}

function SkeletonRows({ columns, count }) {
  return Array.from({ length: count }).map((_, i) => (
    <tr key={i}>
      {columns.map((col) => (
        <td key={col.key} className="px-5 py-4">
          <div
            className="h-4 rounded-md bg-gray-200 dark:bg-gray-700/60 animate-pulse"
            style={{ width: `${50 + Math.random() * 40}%` }}
          />
        </td>
      ))}
    </tr>
  ));
}
