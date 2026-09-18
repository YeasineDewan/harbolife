import { Truck, ShieldCheck, RefreshCcw, Headphones } from "lucide-react";

export default function FeatureCards() {
  return (
    <div className="w-full px-4 sm:px-8 lg:px-12 py-16">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          {
            icon: Truck,
            title: "Free Shipping",
            desc: "For orders over $199.00",
          },
          {
            icon: ShieldCheck,
            title: "Secure Payment",
            desc: "100% secure payment",
          },
          {
            icon: RefreshCcw,
            title: "Money Back",
            desc: "30 days return policy",
          },
          {
            icon: Headphones,
            title: "24/7 Support",
            desc: "Friendly customer support",
          },
        ].map((feature, idx) => (
          <div
            key={idx}
            className="flex flex-col items-center text-center p-6 bg-(--color-surface-card) dark:bg-[#1e1e1e] rounded-2xl shadow-sm border border-(--color-border-base) dark:border-gray-800 hover:-translate-y-2 transition-transform duration-300"
          >
            <div className="w-16 h-16 bg-(--color-primary-50) dark:bg-green-900/20 rounded-full flex items-center justify-center mb-4">
              <feature.icon
                className="w-8 h-8 text-(--color-primary-600) dark:text-green-500"
                aria-hidden="true"
              />
            </div>
            <h4 className="text-xl font-bold text-(--color-text-primary) dark:text-white mb-2">
              {feature.title}
            </h4>
            <p className="text-(--color-text-secondary) dark:text-gray-400">
              {feature.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
