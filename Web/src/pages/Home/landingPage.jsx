import { lazy, Suspense } from "react";

import HeroSection from "./components/HeroSection";
import FeatureCards from "./components/FeatureCards";
import GlobalLoader from "../../components/ui/GlobalLoader";
const PromoBanners = lazy(() => import("./components/PromoBanners"));
const TopProducts = lazy(() => import("./components/TopProducts"));
const SpecialOffers = lazy(() => import("./components/SpecialOffers"));
const ShopCategories = lazy(() => import("./components/ShopCategories"));
const Testimonials = lazy(() => import("./components/Testimonials"));
const FAQAccordion = lazy(() => import("./components/FAQAccordion"));

export default function LandingPage() {
  return (
    <div className="w-full bg-(--color-surface-page) dark:bg-[#121212]">
      <HeroSection />
      <FeatureCards />

      <Suspense fallback={<GlobalLoader />}>
        <PromoBanners />
        <TopProducts />
        <SpecialOffers />
        <ShopCategories />
        <Testimonials />
        <FAQAccordion />
      </Suspense>
    </div>
  );
}
