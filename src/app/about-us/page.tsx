import type { Metadata } from "next";

import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Briefcase,
  CalendarRange,
  ChartNoAxesColumnIncreasing,
  Clock3,
  Compass,
  Handshake,
  Network,
  Route,
  ShieldCheck,
  Sparkles,
  Target,
  Truck,
} from "lucide-react";

const CANONICAL = "https://quickcartrucking.com/about-us";

export const metadata: Metadata = {
  title: "About Us | Quickcar Trucking LLC",
  description:
    "Learn how Quickcar Trucking LLC has grown since 2019 into a reliable nationwide auto transport partner built on execution, transparency, and service.",
  alternates: {
    canonical: CANONICAL,
  },
  openGraph: {
    title: "About Us | Quickcar Trucking LLC",
    description:
      "Built on experience and driven by progress. Explore the Quickcar Trucking story, milestones, and service standards.",
    url: CANONICAL,
    siteName: "Quickcar Trucking",
    type: "website",
  },
};

const timeline = [
  {
    year: "2019",
    title: "The Foundation",
    icon: CalendarRange,
    body:
      "Quickcar Trucking LLC was established with a clear goal: to bring reliability and professionalism into an industry often challenged by delays and poor communication. We started by working directly with carriers, learning every detail from the ground up.",
  },
  {
    year: "2020",
    title: "Building the Network",
    icon: Network,
    body:
      "As demand grew, we focused on building a trusted network of vetted carriers across the United States. Strong partnerships became the backbone of our service.",
  },
  {
    year: "2021",
    title: "Process & Efficiency",
    icon: Compass,
    body:
      "We refined our workflow, improving dispatching, communication, and scheduling systems to ensure smoother and faster deliveries.",
  },
  {
    year: "2022",
    title: "Scaling Operations",
    icon: Truck,
    body:
      "With increased shipment volume, we expanded our capabilities, handling more vehicles while maintaining consistency and quality.",
  },
  {
    year: "2023",
    title: "Customer Experience Focus",
    icon: Handshake,
    body:
      "We elevated our service standards by focusing on transparency, faster response times, and better communication with every client.",
  },
  {
    year: "2024",
    title: "Strength & Stability",
    icon: ShieldCheck,
    body:
      "By this stage, Quickcar Trucking became a dependable name in the industry, known for reliability, strong execution, and a solid carrier network.",
  },
  {
    year: "2025",
    title: "Continuous Growth",
    icon: ChartNoAxesColumnIncreasing,
    body:
      "We continue to improve, adapt, and grow, ensuring that every shipment meets higher standards than the last.",
  },
] as const;

const metrics = [
  { value: "20,000+", label: "Vehicles Delivered", icon: Truck },
  { value: "98%", label: "On-Time Delivery", icon: Clock3 },
  { value: "5.0", label: "5-Star Rated Service", icon: ShieldCheck },
  { value: "50+", label: "Nationwide Coverage", icon: Route },
] as const;

const trustPoints = [
  "Transparent pricing with no hidden fees",
  "Carefully vetted carriers",
  "Consistent communication",
  "On-time delivery focus",
  "Professional coordination from start to finish",
] as const;

function SectionEyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary/80">{children}</p>
  );
}

export default function AboutUsPage() {
  return (
    <main className="bg-white text-[#111827]">
      <section className="relative overflow-hidden border-b border-black/5">
        <div className="absolute inset-0 bg-[url('/hero/about-hero-truck.png')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.94)_0%,rgba(255,255,255,0.86)_45%,rgba(255,255,255,0.72)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(62,106,225,0.12),transparent_30%),radial-gradient(circle_at_top_right,rgba(17,24,39,0.08),transparent_28%)]" />
        <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-primary/40 to-transparent" />
        <div className="mx-auto max-w-6xl px-6 py-20 sm:py-24 lg:py-28">
          <div className="relative max-w-3xl">
            <div className="inline-flex rounded-full border border-white/60 bg-white/75 px-3 py-1 backdrop-blur">
              <SectionEyebrow>Quickcar Trucking LLC</SectionEyebrow>
            </div>
            <h1 className="mt-5 max-w-3xl text-5xl font-semibold tracking-[-0.04em] text-[#0f172a] sm:text-6xl lg:text-7xl">
              Built on Experience. Driven by Progress.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[#334155] sm:text-xl">
              Since 2019, Quickcar Trucking LLC has been moving vehicles and raising the standard of auto
              transport across the United States.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/quote"
                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(62,106,225,0.24)] transition duration-300 hover:-translate-y-0.5 hover:bg-primary-hover hover:shadow-[0_24px_56px_rgba(62,106,225,0.3)]"
              >
                Get a Quote
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/learn/contact-us"
                className="inline-flex items-center justify-center rounded-xl border border-black/10 bg-white/80 px-6 py-3.5 text-sm font-semibold text-[#0f172a] backdrop-blur transition duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:bg-white hover:shadow-[0_16px_34px_rgba(15,23,42,0.08)]"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="relative -mt-8 z-10">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex gap-3 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {metrics.map((metric) => {
              const Icon = metric.icon;
              return (
                <div
                  key={metric.label}
                  className="group min-w-60 flex-1 rounded-2xl border border-black/6 bg-white/92 px-4 py-4 shadow-[0_16px_40px_rgba(15,23,42,0.06)] backdrop-blur transition duration-300 hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-[0_20px_48px_rgba(62,106,225,0.1)]"
                >
                  <div className="flex items-center gap-3">
                    <span className="inline-flex h-10 w-10 flex-none items-center justify-center rounded-full bg-primary/10 text-primary transition duration-300 group-hover:bg-primary group-hover:text-white">
                      <Icon className="h-4 w-4" />
                    </span>
                    <div className="min-w-0">
                      <div className="text-2xl font-semibold tracking-[-0.03em] text-[#0f172a]">{metric.value}</div>
                      <p className="mt-0.5 text-xs font-medium text-[#475569]">{metric.label}</p>
                    </div>
                    <Sparkles className="ml-auto h-3.5 w-3.5 flex-none text-[#94a3b8]" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="relative">
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-24">
          <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
            <div className="max-w-2xl">
              <SectionEyebrow>Who We Are</SectionEyebrow>
              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.03em] text-[#0f172a] sm:text-4xl">
                Nationwide vehicle shipping with discipline, visibility, and care.
              </h2>
            </div>

            <div className="space-y-5 text-lg leading-8 text-[#475569]">
              <p>
                Quickcar Trucking LLC is a nationwide auto transport company focused on delivering reliable,
                efficient, and fully managed vehicle shipping solutions.
              </p>
              <p>
                We are more than just a logistics provider. We are a partner our clients can rely on. Every
                shipment we handle is backed by experience, strong coordination, and a commitment to doing
                things the right way.
              </p>
              <p>
                From individual customers to dealerships and businesses, we provide solutions tailored to
                each need, always with transparency, speed, and care.
              </p>
            </div>
          </div>
        </div>

        <div className="mx-auto h-px max-w-6xl bg-linear-to-r from-transparent via-black/10 to-transparent" />
      </section>

      <section className="relative overflow-hidden bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_35%,#ffffff_100%)]">
        <div className="absolute inset-x-0 top-0 h-40 bg-[radial-gradient(circle_at_center,rgba(62,106,225,0.09),transparent_60%)]" />
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-24">
          <div className="max-w-3xl">
            <SectionEyebrow>Our Story &amp; Experience</SectionEyebrow>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.03em] text-[#0f172a] sm:text-4xl">
              Every year, stronger than before.
            </h2>
            <p className="mt-5 text-lg leading-8 text-[#475569]">
              Our growth has been deliberate: stronger carrier relationships, tighter coordination, better
              systems, and higher service standards year after year.
            </p>
          </div>

          <div className="relative mt-14 space-y-8 before:absolute before:top-0 before:left-6.75 before:h-full before:w-px before:bg-linear-to-b before:from-primary/40 before:via-primary/20 before:to-transparent md:before:left-1/2 md:before:-translate-x-1/2">
            {timeline.map((item, index) => {
              const Icon = item.icon;
              const isRight = index % 2 === 1;

              return (
                <article
                  key={item.year}
                  className={`relative grid gap-4 md:grid-cols-2 md:gap-12 ${isRight ? "" : ""}`}
                >
                  <div className={`${isRight ? "md:order-2" : ""}`}>
                    <div className="ml-16 rounded-[28px] border border-black/6 bg-white p-6 shadow-[0_22px_60px_rgba(15,23,42,0.06)] transition duration-300 hover:-translate-y-1 hover:border-primary/20 hover:shadow-[0_28px_80px_rgba(62,106,225,0.1)] md:ml-0">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="inline-flex items-center rounded-full border border-primary/20 bg-primary/8 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-primary">
                          {item.year}
                        </span>
                        <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#0f172a] text-white">
                          <Icon className="h-4 w-4" />
                        </span>
                      </div>
                      <h3 className="mt-5 text-2xl font-semibold tracking-[-0.03em] text-[#0f172a]">{item.title}</h3>
                      <p className="mt-4 text-base leading-7 text-[#475569]">{item.body}</p>
                    </div>
                  </div>

                  <div className={`${isRight ? "md:order-1" : ""} hidden md:block`} />

                  <div className="absolute top-7 left-2.75 inline-flex h-8 w-8 items-center justify-center rounded-full border border-primary/20 bg-white text-primary shadow-[0_8px_24px_rgba(62,106,225,0.16)] md:left-1/2 md:-translate-x-1/2">
                    <BadgeCheck className="h-4 w-4" />
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="relative">
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-24">
          <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="rounded-[28px] border border-black/6 bg-[#0f172a] p-8 text-white shadow-[0_30px_90px_rgba(15,23,42,0.18)] sm:p-10">
              <SectionEyebrow>Why Clients Trust Us</SectionEyebrow>
              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.03em] text-white sm:text-4xl">
                Shipping a vehicle is not just about transportation. It is about trust.
              </h2>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {trustPoints.map((point) => (
                  <div
                    key={point}
                    className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-sm text-white/80 transition duration-300 hover:border-white/20 hover:bg-white/8"
                  >
                    <div className="flex items-start gap-3">
                      <span className="mt-0.5 inline-flex h-6 w-6 flex-none items-center justify-center rounded-full bg-primary/20 text-primary">
                        <BadgeCheck className="h-3.5 w-3.5" />
                      </span>
                      <span>{point}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-6">
              <div className="rounded-[28px] border border-black/6 bg-white p-8 shadow-[0_22px_60px_rgba(15,23,42,0.06)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_28px_80px_rgba(15,23,42,0.08)] sm:p-10">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Target className="h-5 w-5" />
                </div>
                <h3 className="mt-6 text-2xl font-semibold tracking-[-0.03em] text-[#0f172a]">Our Mission</h3>
                <p className="mt-4 text-base leading-7 text-[#475569]">
                  Our mission is to simplify vehicle transportation by creating a process that is clear,
                  reliable, and stress-free for every customer.
                </p>
              </div>

              <div className="rounded-[28px] border border-black/6 bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] p-8 shadow-[0_22px_60px_rgba(15,23,42,0.06)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_28px_80px_rgba(62,106,225,0.1)] sm:p-10">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0f172a] text-white">
                  <Briefcase className="h-5 w-5" />
                </div>
                <h3 className="mt-6 text-2xl font-semibold tracking-[-0.03em] text-[#0f172a]">
                  Your Vehicle Is in Safe Hands
                </h3>
                <p className="mt-4 text-base leading-7 text-[#475569]">
                  Every shipment is handled with attention to detail and backed by experienced professionals.
                  We work only with carriers who meet our standards, because your vehicle deserves nothing
                  less.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden border-t border-black/5 bg-[linear-gradient(180deg,#f8fafc_0%,#eef4ff_100%)]">
        <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-primary/50 to-transparent" />
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-24">
          <div className="rounded-4xl border border-white/70 bg-white/80 p-8 shadow-[0_28px_80px_rgba(62,106,225,0.12)] backdrop-blur sm:p-12">
            <SectionEyebrow>Final CTA</SectionEyebrow>
            <div className="mt-4 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl">
                <h2 className="text-3xl font-semibold tracking-[-0.03em] text-[#0f172a] sm:text-4xl">
                  Ready to Ship with a Company You Can Trust?
                </h2>
                <p className="mt-4 text-lg leading-8 text-[#475569]">
                  Let Quickcar Trucking handle your next shipment with precision and care.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/quote"
                  className="group inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(62,106,225,0.24)] transition duration-300 hover:-translate-y-0.5 hover:bg-primary-hover hover:shadow-[0_24px_56px_rgba(62,106,225,0.3)]"
                >
                  Get a Quote Now
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                </Link>
                <a
                  href="tel:+16467311022"
                  className="inline-flex items-center justify-center rounded-xl border border-black/10 bg-white px-6 py-3.5 text-sm font-semibold text-[#0f172a] transition duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-[0_16px_34px_rgba(15,23,42,0.08)]"
                >
                  Call Now
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}