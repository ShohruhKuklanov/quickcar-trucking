"use client";

import { useState } from "react";

import { PricingSection } from "@/components/pricing/PricingSection";
import { HomeQuoteSection } from "@/components/quote/HomeQuoteSection";

type ServiceLevel = "Standard" | "Priority" | "Premium";

export function HomePricingQuoteClient() {
  const [serviceLevel, setServiceLevel] = useState<ServiceLevel | null>(null);

  return (
    <>
      <PricingSection onSelect={setServiceLevel} selected={serviceLevel} scrollTargetId="quote-section" />
      <HomeQuoteSection serviceLevel={serviceLevel} />
    </>
  );
}
