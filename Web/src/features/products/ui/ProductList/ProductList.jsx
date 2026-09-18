import ProductCard from "../ProductCard/ProductCard";

export default function ProductList({ products = [] }) {
  return (
    <div className="w-full">
      {products.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-(--color-text-secondary) dark:text-gray-400 bg-(--color-surface-card) dark:bg-gray-800 rounded-xl border border-(--color-border-base) dark:border-gray-700">
          <span className="text-4xl mb-3" aria-hidden="true">
            📦
          </span>
          <p className="text-lg font-bold text-(--color-text-primary) dark:text-white">
            No products found
          </p>
          <p className="text-sm mt-1">
            Try adjusting your filters or searching for something else.
          </p>
        </div>
      )}
    </div>
  );
}
