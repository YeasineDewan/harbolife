import FirstImg from "../../../assets/Home/first.webp";
import SecondImg from "../../../assets/Home/second.webp";
import ThirdImg from "../../../assets/Home/third.webp";

export default function PromoBanners() {
  return (
    <div className="w-full px-4 sm:px-8 lg:px-12 py-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[FirstImg, SecondImg, ThirdImg].map((img, idx) => (
          <div
            key={idx}
            className="overflow-hidden rounded-2xl shadow-md group cursor-pointer"
          >
            <img
              src={img}
              alt={`Promo ${idx + 1}`}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
