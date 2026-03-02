import Link from "next/link";

import ContentSection from "@/components/ContentSection";
import FAQSection from "@/components/FAQSection";
import PageCTA from "@/components/PageCTA";
import { cityNameToSlug, type StateEntry } from "@/lib/states";

export default function StateContent({ state, aiContent }: { state: StateEntry; aiContent?: string }) {
  const cityLinks = state.exampleCities
    .slice(0, 6)
    .map((city) => ({
      label: `${city}, ${state.abbr}`,
      href: `/auto-transport/${state.slug}/${cityNameToSlug(city)}`,
    }));

  return (
    <>
      <section className="grid md:grid-cols-2 gap-12 mb-20">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Licensed, insured transport statewide</h2>
          <p className="text-gray-600 leading-relaxed">
            Quickcar Trucking coordinates door-to-door auto transport across {state.name}. Choose open or
            enclosed shipping, then select a pickup window that matches your timeline.
          </p>
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">What influences pricing in {state.name}</h2>
          <ul className="text-gray-600 space-y-2 leading-relaxed">
            <li>• Route distance and lane demand</li>
            <li>• Vehicle size and operability</li>
            <li>• Open vs enclosed protection</li>
            <li>• Pickup window flexibility</li>
            <li>• Seasonal availability</li>
          </ul>
        </div>
      </section>

      {aiContent ? (
        <ContentSection title={`Local market snapshot: ${state.name}`}>
          <div className="whitespace-pre-wrap text-gray-600 leading-relaxed">{aiContent}</div>
        </ContentSection>
      ) : null}

      <ContentSection title={`Why ship a car in ${state.name}`}
      >
        <div className="grid md:grid-cols-2 gap-10">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Door-to-door coordination</h3>
            <p>
              Pickup and delivery are arranged as close to your address as safely possible—ideal for busy
              schedules and multi-vehicle moves.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Flexible service levels</h3>
            <p>
              Choose Standard for value, Priority for tighter scheduling, or Premium Guaranteed for maximum
              certainty.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Protection options</h3>
            <p>
              Open shipping is cost-effective. Enclosed shipping adds protection many customers prefer for
              classic or high-value vehicles.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Single point of contact</h3>
            <p>
              A dedicated coordinator keeps scheduling, updates, and delivery confirmation simple.
            </p>
          </div>
        </div>
      </ContentSection>

      <ContentSection title={`Popular routes from ${state.name}`}
      >
        <div className="grid md:grid-cols-3 gap-6">
          <div className="rounded-2xl border border-black/5 bg-white p-6">
            <div className="font-semibold text-gray-900">Within the region</div>
            <p className="mt-2">
              Regional lanes can move quickly depending on demand and your pickup window.
            </p>
          </div>
          <div className="rounded-2xl border border-black/5 bg-white p-6">
            <div className="font-semibold text-gray-900">Cross-country</div>
            <p className="mt-2">
              Long routes require planning—see our guide on{" "}
              <Link className="text-[rgb(var(--primary-rgb))] hover:underline" href="/cross-country-car-shipping">
                cross-country car shipping
              </Link>
              .
            </p>
          </div>
          <div className="rounded-2xl border border-black/5 bg-white p-6">
            <div className="font-semibold text-gray-900">Dealer and auction pickups</div>
            <p className="mt-2">
              For volume moves, explore{" "}
              <Link className="text-[rgb(var(--primary-rgb))] hover:underline" href="/dealer-auto-transport">
                dealer auto transport
              </Link>
              .
            </p>
          </div>
        </div>
      </ContentSection>

      <ContentSection title={`Cities we serve in ${state.name}`}
      >
        <p className="text-gray-600 leading-relaxed mb-6">
          Explore city-specific pages with local pickup considerations and common routes.
        </p>
        <div className="flex flex-wrap gap-3">
          {cityLinks.map((c) => (
            <Link
              key={c.href}
              href={c.href}
              className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm text-gray-700 hover:border-black/20 transition"
            >
              {c.label}
            </Link>
          ))}
        </div>
      </ContentSection>

      <FAQSection
        items={[
          {
            question: `How long does car shipping take in ${state.name}?`,
            answer:
              "Transit times depend on distance and lane demand. Most shipments move in 3–7 days after pickup, while pickup scheduling varies by availability and your selected service level.",
          },
          {
            question: `Is your car shipping service in ${state.name} insured?`,
            answer:
              "Yes—carriers are licensed and insured, and the vehicle is inspected at pickup and delivery to document condition.",
          },
          {
            question: `Can I ship an inoperable vehicle from ${state.name}?`,
            answer:
              "Often yes. Inoperable vehicles may require special equipment, which can affect pricing and availability.",
          },
          {
            question: `Should I choose open or enclosed transport in ${state.name}?`,
            answer:
              "Open transport is the most common and cost-effective. Enclosed transport adds protection from the elements and is commonly selected for higher-value or specialty vehicles.",
          },
        ]}
      />

      <PageCTA />
    </>
  );
}
