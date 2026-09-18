import OfferOne from "../../../assets/Home/offer_1.webp";
import OfferTwo from "../../../assets/Home/offer_2.webp";

export default function SpecialOffers() {
  return (
    <div className="w-full px-4 sm:px-8 lg:px-12 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <img
          src={OfferOne}
          alt="Special Offer 1"
          width="800"
          height="400"
          loading="lazy"
          decoding="async"
          className="w-full h-auto rounded-2xl shadow-md object-cover aspect-[2/1]"
        />
        <img
          src={OfferTwo}
          alt="Special Offer 2"
          width="800"
          height="400"
          loading="lazy"
          decoding="async"
          className="w-full h-auto rounded-2xl shadow-md object-cover aspect-[2/1]"
        />
      </div>
    </div>
  );
}
