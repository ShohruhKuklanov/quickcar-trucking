import { Hero } from "@/components/hero/Hero";
import { HowItWorks } from "@/components/how/HowItWorks";
import { UsaMapSection } from "@/components/journey/UsaMapSection";
import { Reviews } from "@/components/reviews/Reviews";
import { Services } from "@/components/services/Services";
import { WhyChooseUs } from "@/components/why/WhyChooseUs";
import { HomePricingQuoteClient } from "@/app/HomePricingQuoteClient";

export default function HomePage() {
  return (
    <main>
      <Hero />
      <HowItWorks />
      <Services />
      <WhyChooseUs />
      <HomePricingQuoteClient />
      <UsaMapSection />
      <Reviews />
    </main>
  );
}
