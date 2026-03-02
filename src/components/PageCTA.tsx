import Link from "next/link";

type PageCTAProps = {
  title?: string;
  subtitle?: string;
  href?: string;
  ctaLabel?: string;
};

export default function PageCTA({
  title = "Ready to ship your vehicle?",
  subtitle = "Get a fast, transparent quote and lock in your dispatch window.",
  href = "/quote",
  ctaLabel = "Get a Quote",
}: PageCTAProps) {
  return (
    <section className="mt-24 rounded-3xl bg-[rgb(var(--primary-rgb))] text-white p-8 md:p-12 text-center">
      <h2 className="text-3xl font-semibold mb-3">{title}</h2>
      <p className="mx-auto max-w-2xl text-white/85 leading-relaxed mb-8">{subtitle}</p>
      <Link
        href={href}
        className="inline-flex items-center justify-center rounded-xl bg-white px-8 py-3 font-medium text-[rgb(var(--primary-rgb))] transition-shadow duration-300 hover:shadow-lg"
      >
        {ctaLabel}
      </Link>
    </section>
  );
}
