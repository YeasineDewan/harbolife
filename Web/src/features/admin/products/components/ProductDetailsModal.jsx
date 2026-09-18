import { X, Package, Pill } from "lucide-react";
import { useGetProductByIdQuery } from "../../../products/api/productsApi";
import Button from "../../../../components/ui/Button";
import GlobalLoader from "../../../../components/ui/GlobalLoader";

export default function ProductDetailsModal({ isOpen, onClose, productId }) {
  const { data, isLoading, error } = useGetProductByIdQuery(productId, {
    skip: !productId || !isOpen,
  });

  if (!isOpen) return null;

  const product = data?.data;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-(--color-surface-card) dark:bg-(--color-panel-dark) rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl border border-(--color-border-base) dark:border-gray-800"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-(--color-border-base) dark:border-gray-800">
          <h2 className="text-xl font-bold text-(--color-text-primary) dark:text-white">
            Product Details
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="p-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <GlobalLoader width="w-8" height="h-8" animate-spin text="(--color-primary-600)" />
              <p className="mt-4 text-(--color-text-secondary)">
                Loading details...
              </p>
            </div>
          ) : error || !product ? (
            <div className="text-center py-12 text-(--color-danger-600)">
              Failed to load product details.
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-6 items-start">
                {/* Product Image */}
                <div className="w-40 h-40 shrink-0 rounded-xl bg-(--color-surface-muted) dark:bg-gray-800 overflow-hidden border border-(--color-border-base) dark:border-gray-700 flex items-center justify-center">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-(--color-text-muted)">
                      <Package className="w-12 h-12" />
                    </div>
                  )}
                </div>

                {/* Main Info */}
                <div className="flex-1 space-y-3">
                  <div>
                    <h3 className="text-2xl font-bold text-(--color-text-primary) dark:text-white">
                      {product.name}
                    </h3>
                    <p className="text-sm text-(--color-primary-600) font-medium mt-1">
                      {product.category?.name || "Uncategorized"}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <span className="px-3 py-1 bg-(--color-surface-muted) dark:bg-gray-800 text-(--color-text-primary) dark:text-gray-200 rounded-lg text-sm font-semibold">
                      💰 EGP {product.price}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-lg text-sm font-semibold ${product.stock > 0 ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"}`}
                    >
                      📦 Stock: {product.stock}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-lg text-sm font-semibold ${product.is_active ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" : "bg-gray-200 text-gray-600 dark:bg-gray-800 dark:text-gray-400"}`}
                    >
                      {product.is_active ? "Active" : "Inactive"}
                    </span>
                  </div>

                  {product.requires_prescription && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-(--color-danger-50) dark:bg-(--color-danger-900) text-(--color-danger-600) dark:text-(--color-danger-400) border border-(--color-danger-200) dark:border-red-800 rounded-lg text-xs font-semibold">
                      <Pill className="w-3 h-3" /> Requires Prescription
                    </span>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="bg-(--color-surface-page) dark:bg-[#252525] p-4 rounded-xl border border-(--color-border-base) dark:border-gray-800">
                <h4 className="text-sm font-semibold text-(--color-text-primary) dark:text-white mb-2">
                  Description
                </h4>
                <p className="text-sm text-(--color-text-body) dark:text-gray-400 leading-relaxed">
                  {product.description || "No description provided."}
                </p>
              </div>

              {/* Strips Info (If applicable) */}
              {product.has_strips && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-(--color-surface-page) dark:bg-[#252525] p-4 rounded-xl border border-(--color-border-base) dark:border-gray-800">
                    <span className="text-xs text-(--color-text-secondary) block">
                      Strips Count
                    </span>
                    <span className="text-lg font-bold text-(--color-text-primary) dark:text-white">
                      {product.strip_count}
                    </span>
                  </div>
                  <div className="bg-(--color-surface-page) dark:bg-[#252525] p-4 rounded-xl border border-(--color-border-base) dark:border-gray-800">
                    <span className="text-xs text-(--color-text-secondary) block">
                      Strips Per Box
                    </span>
                    <span className="text-lg font-bold text-(--color-text-primary) dark:text-white">
                      {product.strips_per_box}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
