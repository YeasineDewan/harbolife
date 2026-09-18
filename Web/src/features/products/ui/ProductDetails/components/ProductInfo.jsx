export default function ProductInfo({
  name,
  price,
  description,
  stock,
  outOfStock,
  isRoshetta,
}) {
  return (
    <>
      <h1 className="text-4xl font-bold mb-4 text-(--color-text-primary) dark:text-white">
        {name}
      </h1>
      <p className="text-3xl font-black text-(--color-primary-700) dark:text-green-400 mb-6">
        ${price}
      </p>
      <p className="text-(--color-text-body) dark:text-gray-300 text-lg mb-8 leading-relaxed whitespace-pre-wrap">
        {description}
      </p>

      <div className="mb-8 border-t border-(--color-border-base) dark:border-gray-700 pt-6">
        <p className="text-lg mb-2 flex items-center gap-2">
          <span className="font-semibold text-(--color-text-primary) dark:text-gray-200">
            Available Stock:{" "}
          </span>
          <span
            className={`font-bold ${
              !outOfStock
                ? "text-(--color-primary-700) dark:text-green-400"
                : "text-(--color-danger-600)"
            }`}
          >
            {stock} pieces
          </span>
        </p>
        {isRoshetta && (
          <p className="text-(--color-danger-700) dark:text-red-400 font-bold bg-(--color-danger-50) dark:bg-red-900/20 inline-block px-4 py-1.5 rounded-lg mt-2 border border-(--color-danger-200) dark:border-red-800">
            ⚠️ Requires Medical Prescription
          </p>
        )}
      </div>
    </>
  );
}
