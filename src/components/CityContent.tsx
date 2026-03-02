import Link from "next/link";

import ContentSection from "@/components/ContentSection";
import FAQSection from "@/components/FAQSection";
import PageCTA from "@/components/PageCTA";
import type { StateEntry } from "@/lib/states";

export default function CityContent({
  state,
  city,
  relatedCities,
}: {
  state: StateEntry;
  city: string;
  relatedCities: { label: string; href: string }[];
}) {
  return (
    <>
      <section className="grid md:grid-cols-2 gap-12 mb-20">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Most common routes</h2>
          <p className="text-gray-600 leading-relaxed">
            From {city}, {state.abbr}, we coordinate door-to-door transport nationwide. Popular routes vary
            by season and demand—your quote reflects the lane at the time you book.
          </p>
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Pricing factors</h2>
          <ul className="text-gray-600 space-y-2 leading-relaxed">
            <li>• Distance and timing</li>
            <li>• Vehicle type and operability</li>
            <li>• Open vs enclosed shipping</li>
            <li>• Pickup window flexibility</li>
          </ul>
        </div>
      </section>

      <ContentSection title={`Local pickup info in ${city}`}
      >
        <div className="grid md:grid-cols-2 gap-10">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Door-to-door where possible</h3>
            <p>
              Carriers typically meet at or near your address when the route is safe and accessible. If a
              large truck can’t reach your street, your coordinator will suggest a nearby meeting point.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Flexible scheduling</h3>
            <p>
              For better pricing, choose a flexible pickup window. For tighter schedules, Priority or Premium
              Guaranteed can help reduce uncertainty.
            </p>
          </div>
        </div>
      </ContentSection>

      <ContentSection title="Why choose Quickcar">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="rounded-2xl border border-black/5 bg-white p-6">
            <div className="font-semibold text-gray-900">Licensed & insured</div>
            <p className="mt-2">Coordination with compliant carriers and documented inspections.</p>
          </div>
          <div className="rounded-2xl border border-black/5 bg-white p-6">
            <div className="font-semibold text-gray-900">Clear communication</div>
            <p className="mt-2">A dedicated coordinator keeps scheduling and updates simple.</p>
          </div>
          <div className="rounded-2xl border border-black/5 bg-white p-6">
            <div className="font-semibold text-gray-900">Nationwide coverage</div>
            <p className="mt-2">Ship from {city} to anywhere in the contiguous U.S.</p>
          </div>
        </div>
      </ContentSection>

      <ContentSection title={`Explore more in ${state.name}`}
      >
        <p className="text-gray-600 leading-relaxed mb-6">
          Jump back to the state page or browse nearby cities.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href={`/auto-transport/${state.slug}`}
            className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm text-gray-700 hover:border-black/20 transition"
          >
            {state.name} state page
          </Link>
          {relatedCities.map((c) => (
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
            question: `How long does it take to ship a car from ${city}, ${state.abbr}?`,
            answer:
              "Transit times depend on distance and lane demand—often 3–7 days after pickup. Pickup scheduling can add 1–5 days depending on availability and your chosen service level.",
          },
          {
            question: `Do you offer enclosed transport from ${city}?`,
            answer:
              "Yes. Enclosed transport is available from many markets and is commonly chosen for higher-value, classic, or specialty vehicles.",
          },
          {
            question: `Can you pick up at a residence in ${city}?`,
            answer:
              "In many cases, yes. If access is limited for a large truck, we can coordinate a safe nearby meeting location.",
          },
        ]}
      />

      <PageCTA />

      <div className="mt-10 text-sm text-gray-500">
        Looking for long-distance planning? Read{" "}
        <Link className="text-[rgb(var(--primary-rgb))] hover:underline" href="/cross-country-car-shipping">
          cross-country car shipping
        </Link>
        .
      </div>
    </>
  );
}
