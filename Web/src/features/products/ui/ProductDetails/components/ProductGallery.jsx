export default function ProductGallery({ optimizedImage, productName }) {
  return (
    <div className="w-full md:w-1/2 flex justify-center items-center bg-(--color-surface-card) dark:bg-[#1e1e1e] rounded-3xl p-8 shadow-sm border border-(--color-border-base) dark:border-gray-700">
      <img
        src={optimizedImage}
        alt={productName}
        className="max-h-[320px] w-auto object-contain"
        loading="eager"
        fetchPriority="high"
        decoding="async"
      />
    </div>
  );
}
