"use client";

import { useState } from "react";
import { Building2, Clock, ShieldCheck, Truck, Users } from "lucide-react";

import { PricingSection } from "@/components/pricing/PricingSection";
import { QuoteForm } from "@/components/quote/QuoteForm";

type ServiceLevel = "Standard" | "Priority" | "Premium";

export function QuotePageClient() {
  const [serviceLevel, setServiceLevel] = useState<ServiceLevel | null>(null);

  return (
    <main>
      <PricingSection onSelect={setServiceLevel} selected={serviceLevel} scrollTargetId="quote" />

      <section
        id="quote"
        aria-label="Get a quote"
        className="py-10 md:py-12 bg-white"
      >
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-10 items-start">
            <div className="h-full">
              <QuoteForm variant="enterprise" instanceId="quote-page" serviceLevel={serviceLevel ?? undefined} />
            </div>

            <aside
              className="bg-white/45 backdrop-blur-2xl border border-gray-200/60 rounded-2xl p-5 md:p-6 h-full"
              aria-label="Trust and service highlights"
            >
              <header>
                <h2 className="text-xl font-semibold text-gray-900">WHY QUICKCAR</h2>
                <p className="text-sm text-gray-500 mt-1">Structured, secure, and FMCSA-aligned intake.</p>
              </header>

              <div className="mt-4">
                {[
                  { icon: ShieldCheck, label: "Fully insured carriers" },
                  { icon: Building2, label: "Licensed & bonded" },
                  { icon: Truck, label: "FMCSA compliant" },
                  { icon: Clock, label: "$0 upfront until scheduled" },
                  { icon: Users, label: "Dedicated logistics advisors" },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label} className="flex items-center gap-4 py-3 border-b border-gray-100 last:border-b-0">
                      <span className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                        <Icon size={18} aria-hidden="true" className="text-blue-600" />
                      </span>
                      <span className="text-gray-700 font-medium">{item.label}</span>
                    </div>
                  );
                })}
              </div>

              <div className="grid grid-cols-3 gap-3 mt-5">
                {[
                  { value: "50+", label: "States" },
                  { value: "10k+", label: "Delivered" },
                  { value: "98%", label: "On-time" },
                ].map((stat) => (
                  <div key={stat.label} className="bg-white rounded-xl p-3 text-center shadow-sm">
                    <div className="text-xl font-semibold text-gray-900">{stat.value}</div>
                    <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}
