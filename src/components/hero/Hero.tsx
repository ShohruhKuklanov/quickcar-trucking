import Link from "next/link";
import Image from "next/image";

import { QuoteForm } from "@/components/quote/QuoteForm";

export function Hero() {
  return (
    <section id="hero" className="qh-rootVars relative min-h-[500px] overflow-hidden">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <Image
          src="/hero/herobg.avif"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-25"
        />
      </div>
      <div className="relative mx-auto grid max-w-6xl items-center gap-8 px-4 py-12 md:grid-cols-2 md:py-20">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-sm font-medium text-foreground/70">Door-to-door vehicle shipping</p>
          </div>
          <h1 className="mt-3 text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
            Ship your car with confidence.
          </h1>
          <p className="mt-4 max-w-prose text-base leading-7 text-foreground/70">
            QuickCar Transport helps you move vehicles nationwide with transparent pricing and reliable
            carriers.
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/quote"
              className="qc-btn qc-btn--primary"
            >
              Get an instant quote
            </Link>
            <a
              href="#how"
              className="qc-btn qc-btn--secondary"
            >
              How it works
            </a>
          </div>

          <dl className="mt-8 grid grid-cols-3 gap-4 text-sm">
            <div className="qh-heroStat px-4 py-3">
              <dt className="qh-heroStatLabel">Pricing</dt>
              <dd className="qh-heroStatValue mt-1">Upfront</dd>
            </div>
            <div className="qh-heroStat px-4 py-3">
              <dt className="qh-heroStatLabel">Tracking</dt>
              <dd className="qh-heroStatValue mt-1">Updates</dd>
            </div>
            <div className="qh-heroStat px-4 py-3">
              <dt className="qh-heroStatLabel">Pickup</dt>
              <dd className="qh-heroStatValue mt-1">Flexible</dd>
            </div>
          </dl>
        </div>

        <div className="mx-auto w-full max-w-md">
          <QuoteForm instanceId="hero-quote" anchorId="quote" />
        </div>
      </div>
    </section>
  );
}
