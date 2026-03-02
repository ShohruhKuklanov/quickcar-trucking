"use client";

import Link from "next/link";

type ServiceLevel = "Standard" | "Priority" | "Premium";

export function PricingSection({
  onSelect,
  selected,
  scrollTargetId,
}: {
  onSelect?: (level: ServiceLevel) => void;
  selected?: ServiceLevel | null;
  scrollTargetId?: string;
}) {
  const scrollToQuote = () => {
    const preferred = (scrollTargetId ?? "quote-section").trim();
    const target =
      (preferred ? document.getElementById(preferred) : null) ??
      document.getElementById("quote-section") ??
      document.getElementById("quote");

    target?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleSelect = (level: ServiceLevel) => {
    onSelect?.(level);
    scrollToQuote();
  };
  return (
    <section className="lp py-10 md:py-12 bg-white" aria-labelledby="pricing-title" id="pricing">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="lp-shell">
        <header className="lp-header">
          <h2 className="lp-title" id="pricing-title">
            Choose the Level of Service That Fits Your Timeline
          </h2>
          <p className="lp-subtitle">Transparent pricing. No hidden fees. Fully insured transport.</p>

          <form className="lp-toggle" aria-label="Transport type">
            <fieldset className="lp-toggleFieldset">
              <legend className="lp-toggleLegend">Transport</legend>

              <div className="lp-toggleGroup" role="radiogroup" aria-label="Transport type">
                <input className="lp-toggleInput" type="radio" name="transport" id="lp-open" defaultChecked />
                <label className="lp-toggleOption" htmlFor="lp-open">
                  Open
                </label>

                <input className="lp-toggleInput" type="radio" name="transport" id="lp-enclosed" />
                <label className="lp-toggleOption" htmlFor="lp-enclosed">
                  Enclosed
                </label>
              </div>

              <p className="lp-toggleNote">Pricing varies by route, vehicle, and season. Select a service level to continue.</p>
            </fieldset>
          </form>
        </header>

        <div className="lp-tiers" role="list" aria-label="Service tiers">
          <article
            className={
              "lp-tier lp-tier--standard pricing-card" + (selected === "Standard" ? " active" : "")
            }
            role="listitem"
            aria-label="Standard"
          >
            <header className="lp-tierHeader">
              <p className="lp-tierName">Standard</p>
              <p className="lp-tierLabel">Flexible Pickup</p>
              <p className="lp-tierDesc">Best for customers with open timelines.</p>

              <div className="lp-price" aria-label="Estimated pricing">
                <span className="lp-priceValue">
                  <span className="lp-priceVariant lp-priceVariant--open">Tailored quote</span>
                  <span className="lp-priceVariant lp-priceVariant--enclosed">Tailored quote</span>
                </span>
                <span className="lp-priceHint">Reliable scheduling, best value</span>
              </div>
            </header>

            <ul className="lp-includes" aria-label="Standard includes">
              <li className="lp-item">{CheckIcon()} Open transport</li>
              <li className="lp-item">{CheckIcon()} 3–5 day pickup window</li>
              <li className="lp-item">{CheckIcon()} Door-to-door delivery</li>
              <li className="lp-item">{CheckIcon()} Fully insured</li>
              <li className="lp-item">{CheckIcon()} Dedicated coordinator</li>
            </ul>

            {onSelect ? (
              <button
                type="button"
                className="lp-cta"
                aria-label="Select Standard option"
                onClick={() => handleSelect("Standard")}
              >
                Select This Option
              </button>
            ) : (
              <Link className="lp-cta" href="/quote" aria-label="Select Standard option">
                Select This Option
              </Link>
            )}
          </article>

          <article
            className={
              "lp-tier lp-tier--priority pricing-card" + (selected === "Priority" ? " active" : "")
            }
            role="listitem"
            aria-label="Priority"
          >
            <div className="lp-badge" aria-hidden="true">
              Most Popular
            </div>

            <header className="lp-tierHeader">
              <p className="lp-tierName">Priority</p>
              <p className="lp-tierLabel">Faster Scheduling</p>
              <p className="lp-tierDesc">For customers who want tighter coordination and earlier pickup.</p>

              <div className="lp-price" aria-label="Estimated pricing">
                <span className="lp-priceValue">
                  <span className="lp-priceVariant lp-priceVariant--open">Tailored quote</span>
                  <span className="lp-priceVariant lp-priceVariant--enclosed">Tailored quote</span>
                </span>
                <span className="lp-priceHint">Higher dispatch priority, optimal balance</span>
              </div>
            </header>

            <ul className="lp-includes" aria-label="Priority includes">
              <li className="lp-item">{CheckIcon()} Open or Enclosed option</li>
              <li className="lp-item">{CheckIcon()} 1–3 day pickup window</li>
              <li className="lp-item">{CheckIcon()} Route optimization</li>
              <li className="lp-item">{CheckIcon()} Dedicated coordinator</li>
              <li className="lp-item">{CheckIcon()} Higher dispatch priority</li>
            </ul>

            {onSelect ? (
              <button
                type="button"
                className="lp-cta lp-cta--primary"
                aria-label="Select Priority option"
                onClick={() => handleSelect("Priority")}
              >
                Select This Option
              </button>
            ) : (
              <Link className="lp-cta lp-cta--primary" href="/quote" aria-label="Select Priority option">
                Select This Option
              </Link>
            )}
          </article>

          <article
            className={
              "lp-tier lp-tier--premium pricing-card" + (selected === "Premium" ? " active" : "")
            }
            role="listitem"
            aria-label="Premium Guaranteed"
          >
            <header className="lp-tierHeader">
              <p className="lp-tierName">Premium Guaranteed</p>
              <p className="lp-tierLabel">Locked-In Pickup</p>
              <p className="lp-tierDesc">Concierge-level service with a guaranteed pickup date.</p>

              <div className="lp-price" aria-label="Estimated pricing">
                <span className="lp-priceValue">
                  <span className="lp-priceVariant lp-priceVariant--open">Tailored quote</span>
                  <span className="lp-priceVariant lp-priceVariant--enclosed">Tailored quote</span>
                </span>
                <span className="lp-priceHint">Maximum certainty, premium support</span>
              </div>
            </header>

            <ul className="lp-includes" aria-label="Premium includes">
              <li className="lp-item">{CheckIcon()} Enclosed or Open</li>
              <li className="lp-item">{CheckIcon()} Guaranteed pickup date</li>
              <li className="lp-item">{CheckIcon()} Expedited routing</li>
              <li className="lp-item">{CheckIcon()} Priority carrier assignment</li>
              <li className="lp-item">{CheckIcon()} Direct communication line</li>
              <li className="lp-item">{CheckIcon()} Premium support</li>
            </ul>

            {onSelect ? (
              <button
                type="button"
                className="lp-cta"
                aria-label="Select Premium Guaranteed option"
                onClick={() => handleSelect("Premium")}
              >
                Select This Option
              </button>
            ) : (
              <Link className="lp-cta" href="/quote" aria-label="Select Premium Guaranteed option">
                Select This Option
              </Link>
            )}
          </article>
        </div>

        <div className="lp-proof" aria-label="Assurance details">
          <ul className="lp-proofList">
            <li className="lp-proofItem">{CheckIcon()} Balance paid upon delivery</li>
            <li className="lp-proofItem">{CheckIcon()} No hidden broker fees</li>
            <li className="lp-proofItem">{CheckIcon()} Fully licensed &amp; insured</li>
            <li className="lp-proofItem">{CheckIcon()} 98% on-time delivery rate</li>
          </ul>
        </div>

        <div className="lp-footerCtas" aria-label="Need help">
          {onSelect ? (
            <button
              type="button"
              className="lp-secondary"
              aria-label="Speak with a specialist"
              onClick={() => scrollToQuote()}
            >
              Not sure? Speak with a Specialist
            </button>
          ) : (
            <Link className="lp-secondary" href="/quote" aria-label="Speak with a specialist">
              Not sure? Speak with a Specialist
            </Link>
          )}
        </div>
        </div>
      </div>
    </section>
  );
}

function CheckIcon() {
  return (
    <svg className="lp-check" width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
      <path
        d="M6.65 11.35 3.8 8.5a1 1 0 1 1 1.4-1.4l1.45 1.45L10.8 4.4a1 1 0 1 1 1.4 1.4l-5.55 5.55z"
        fill="currentColor"
      />
    </svg>
  );
}
