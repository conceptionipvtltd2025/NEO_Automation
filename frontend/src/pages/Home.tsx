import { Hero } from "@/components/home/Hero";
import { Brands } from "@/components/home/Brands";
import { Capabilities } from "@/components/home/Capabilities";
import { IndustriesShowcase } from "@/components/home/IndustriesShowcase";
import { SpecialProducts } from "@/components/home/SpecialProducts";
import { Process } from "@/components/home/Process";
import { NSWSection } from "@/components/home/NSWSection";
import { ProductsSection } from "@/components/home/ProductsSection";
import { AboutTeaser } from "@/components/home/AboutTeaser";
import { VideoSection } from "@/components/home/VideoSection";
import { CTABand } from "@/components/home/CTABand";

export default function Home() {
  return (
    <>
      <Hero />
      <Brands />
      <IndustriesShowcase />
      <ProductsSection />
      <SpecialProducts />
      <AboutTeaser />
      <Process /> 
      <Capabilities />
      <NSWSection />
      <VideoSection />
      <CTABand />
    </>
  );
}
