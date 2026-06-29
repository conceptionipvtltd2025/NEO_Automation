import { Hero } from "@/components/home/Hero";
import { Brands } from "@/components/home/Brands";
import { Capabilities } from "@/components/home/Capabilities";
import { IndustriesShowcase } from "@/components/home/IndustriesShowcase";
import { SpecialProducts } from "@/components/home/SpecialProducts";
import { Process } from "@/components/home/Process";
import { SWFSection } from "@/components/home/SWFSection";
import { NSWSection } from "@/components/home/NSWSection";
import { ProductsSection } from "@/components/home/ProductsSection";
import { AboutTeaser } from "@/components/home/AboutTeaser";
import { ContactSection } from "@/components/home/ContactSection";
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
      <SWFSection />
      <NSWSection />
      <ContactSection />
      <CTABand />
    </>
  );
}
