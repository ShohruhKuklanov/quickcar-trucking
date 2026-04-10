"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  Clock3,
  Headset,
  Mail,
  MapPin,
  MessageSquareText,
  Phone,
  ShieldCheck,
  Truck,
} from "lucide-react";

const PHONE_HREF = "tel:+16467311022";
const PHONE_LABEL = "(646) 731-1022";
const EMAIL = "support@quickcartrucking.com";

const quickSupport = [
  "Call us for instant help",
  "Email us anytime",
  "Request a quote in minutes",
] as const;

const helpTopics = [
  "Car shipping quotes",
  "Booking and scheduling",
  "Shipment tracking and updates",
  "General transport questions",
  "Support for existing orders",
] as const;

const trustPoints = [
  "Professional support team",
  "Transparent communication",
  "Fast response times",
  "Nationwide service",
] as const;

type FormState = {
  fullName: string;
  phone: string;
  email: string;
  pickupLocation: string;
  deliveryLocation: string;
  message: string;
};

const initialForm: FormState = {
  fullName: "",
  phone: "",
  email: "",
  pickupLocation: "",
  deliveryLocation: "",
  message: "",
};

function SectionEyebrow({ children }: { children: React.ReactNode }) {
  return <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary/80">{children}</p>;
}

export function ContactSupportPage() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [submitState, setSubmitState] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [feedback, setFeedback] = useState("");

  const updateField = (field: keyof FormState, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitState("submitting");
    setFeedback("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const payload = (await response.json().catch(() => null)) as { error?: string; ok?: boolean } | null;

      if (!response.ok || !payload?.ok) {
        throw new Error(payload?.error || "Unable to send your message right now.");
      }

      setSubmitState("success");
      setFeedback("Your message was sent. Our team will get back to you as soon as possible.");
      setForm(initialForm);
    } catch (error) {
      setSubmitState("error");
      setFeedback(error instanceof Error ? error.message : "Unable to send your message right now.");
    }
  };

  return (
    <main className="bg-white text-[#111827]">
      <section className="relative overflow-hidden border-b border-black/5">
        <div className="absolute inset-0 bg-[url('/hero/herobg.avif')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.95)_0%,rgba(255,255,255,0.86)_35%,rgba(255,255,255,0.62)_72%,rgba(255,255,255,0.4)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(62,106,225,0.13),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(15,23,42,0.08),transparent_26%)]" />
        <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-primary/40 to-transparent" />

        <div className="relative mx-auto max-w-6xl px-6 py-20 sm:py-24 lg:py-28">
          <div className="max-w-3xl">
            <div className="inline-flex rounded-full border border-white/70 bg-white/80 px-3 py-1 backdrop-blur">
              <SectionEyebrow>Contact Us / Support &amp; Information</SectionEyebrow>
            </div>

            <h1 className="mt-5 text-5xl font-semibold tracking-[-0.04em] text-[#0f172a] sm:text-6xl lg:text-7xl">
              Contact Quickcar Trucking
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-[#334155] sm:text-xl">
              Have questions or need assistance with your vehicle shipment? Our team is ready to provide fast,
              reliable support every step of the way.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/quote"
                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(62,106,225,0.24)] transition duration-300 hover:-translate-y-0.5 hover:bg-primary-hover hover:shadow-[0_24px_56px_rgba(62,106,225,0.3)]"
              >
                Get a Free Quote
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
              </Link>
              <Link
                href={PHONE_HREF}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-black/10 bg-white/85 px-6 py-3.5 text-sm font-semibold text-[#0f172a] backdrop-blur transition duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:bg-white hover:shadow-[0_16px_34px_rgba(15,23,42,0.08)]"
              >
                <Phone className="h-4 w-4" />
                Call Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="relative -mt-8 z-10">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              { icon: Phone, label: "Main Line", value: PHONE_LABEL },
              { icon: Mail, label: "Email Support", value: EMAIL },
              { icon: Clock3, label: "Response Time", value: "Fast replies during business hours" },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.label}
                  className="rounded-2xl border border-black/6 bg-white/92 px-5 py-4 shadow-[0_16px_40px_rgba(15,23,42,0.06)] backdrop-blur"
                >
                  <div className="flex items-center gap-3">
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Icon className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#64748b]">{item.label}</p>
                      <p className="mt-1 text-sm font-semibold text-[#0f172a]">{item.value}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-24">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 lg:grid-cols-[0.92fr_1.08fr] lg:items-start">
          <div className="space-y-8">
            <div>
              <SectionEyebrow>Get in Touch</SectionEyebrow>
              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.03em] text-[#0f172a] sm:text-4xl">
                We&apos;re Here to Help
              </h2>
              <p className="mt-5 text-lg leading-8 text-[#475569]">
                Whether you need a quote, want to check your shipment status, or simply have a question, our
                support team is available and ready to assist you.
              </p>
            </div>

            <div className="rounded-[28px] border border-black/6 bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] p-6 shadow-[0_22px_60px_rgba(15,23,42,0.06)]">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary/80">Contact Details</p>
                  <div className="mt-4 space-y-4">
                    <Link href={PHONE_HREF} className="flex items-start gap-3 rounded-2xl border border-black/6 bg-white p-4 transition hover:border-primary/20 hover:shadow-[0_12px_28px_rgba(62,106,225,0.08)]">
                      <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <Phone className="h-4 w-4" />
                      </span>
                      <span>
                        <span className="block text-sm font-medium text-[#64748b]">Main Line</span>
                        <span className="mt-1 block text-base font-semibold text-[#0f172a]">{PHONE_LABEL}</span>
                      </span>
                    </Link>

                    <Link href={`mailto:${EMAIL}`} className="flex items-start gap-3 rounded-2xl border border-black/6 bg-white p-4 transition hover:border-primary/20 hover:shadow-[0_12px_28px_rgba(62,106,225,0.08)]">
                      <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <Mail className="h-4 w-4" />
                      </span>
                      <span>
                        <span className="block text-sm font-medium text-[#64748b]">Email</span>
                        <span className="mt-1 block text-base font-semibold text-[#0f172a]">{EMAIL}</span>
                      </span>
                    </Link>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary/80">Business Hours</p>
                  <div className="mt-4 rounded-2xl border border-black/6 bg-white p-5">
                    <div className="flex items-start gap-3">
                      <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#0f172a] text-white">
                        <Clock3 className="h-4 w-4" />
                      </span>
                      <div className="space-y-2 text-sm text-[#475569]">
                        <p><span className="font-semibold text-[#0f172a]">Monday - Saturday:</span> 8:00 AM - 6:00 PM</p>
                        <p><span className="font-semibold text-[#0f172a]">Sunday:</span> 10:00 AM - 3:00 PM</p>
                        <p>We respond quickly during business hours.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary/80">Office Address</p>
                  <div className="mt-4 rounded-2xl border border-black/6 bg-white p-5">
                    <div className="flex items-start gap-3">
                      <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <MapPin className="h-4 w-4" />
                      </span>
                      <div className="space-y-1 text-sm text-[#475569]">
                        <p className="font-semibold text-[#0f172a]">14 Harwood Ct, Suite 415 #1034</p>
                        <p>Scarsdale, NY 10583</p>
                        <p>United States</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[32px] border border-black/6 bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] p-6 shadow-[0_24px_70px_rgba(15,23,42,0.08)] sm:p-8">
            <SectionEyebrow>Send Us a Message</SectionEyebrow>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.03em] text-[#0f172a] sm:text-4xl">
              Request a Quote or Send a Message
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-7 text-[#475569]">
              Fill out the form below and our team will get back to you as soon as possible.
            </p>

            <form className="mt-8 space-y-4" onSubmit={onSubmit}>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field
                  label="Full Name"
                  name="fullName"
                  value={form.fullName}
                  onChange={updateField}
                  required
                />
                <Field
                  label="Phone Number"
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={updateField}
                  required
                />
                <Field
                  label="Email Address"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={updateField}
                  required
                />
                <Field
                  label="Pickup Location"
                  name="pickupLocation"
                  value={form.pickupLocation}
                  onChange={updateField}
                />
                <Field
                  label="Delivery Location"
                  name="deliveryLocation"
                  value={form.deliveryLocation}
                  onChange={updateField}
                />
                <div className="hidden sm:block" />
              </div>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-[#0f172a]">Message</span>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={(event) => updateField("message", event.target.value)}
                  rows={6}
                  className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm text-[#0f172a] outline-none transition focus:border-primary/35 focus:ring-4 focus:ring-primary/10"
                  placeholder="Tell us about your shipment or question."
                />
              </label>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="submit"
                  disabled={submitState === "submitting"}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(62,106,225,0.24)] transition duration-300 hover:-translate-y-0.5 hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-70"
                >
                  <MessageSquareText className="h-4 w-4" />
                  {submitState === "submitting" ? "Sending..." : "Send Message"}
                </button>

                {feedback ? (
                  <p
                    className={`text-sm ${
                      submitState === "success" ? "text-emerald-600" : "text-red-600"
                    }`}
                  >
                    {feedback}
                  </p>
                ) : null}
              </div>
            </form>
          </div>
        </div>
      </section>

      <section className="border-y border-black/5 bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] py-20 md:py-24">
        <div className="mx-auto grid max-w-6xl gap-6 px-6 lg:grid-cols-3">
          <InfoPanel
            eyebrow="Quick Support Options"
            title="Need Immediate Assistance?"
            icon={Headset}
            items={quickSupport}
          />
          <InfoPanel
            eyebrow="How We Can Help"
            title="What We Can Assist You With"
            icon={Truck}
            items={helpTopics}
          />
          <InfoPanel
            eyebrow="Why Contact Quickcar"
            title="Why Customers Trust Us"
            icon={ShieldCheck}
            items={trustPoints}
            description="At Quickcar Trucking LLC, we prioritize clear communication, fast response times, and reliable service."
          />
        </div>
      </section>

      <section className="py-20 md:py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="rounded-[32px] border border-black/6 bg-[linear-gradient(135deg,#0f172a_0%,#172554_52%,#1d4ed8_100%)] p-8 text-white shadow-[0_28px_80px_rgba(15,23,42,0.22)] sm:p-10 lg:p-12">
            <SectionEyebrow>Final CTA</SectionEyebrow>
            <h2 className="mt-4 max-w-3xl text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">
              Ready to Ship Your Vehicle?
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-7 text-white/78 sm:text-lg">
              Contact us today and get a fast, reliable quote with no hassle.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/quote"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-semibold text-[#0f172a] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_38px_rgba(255,255,255,0.16)]"
              >
                Get a Quote Now
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href={PHONE_HREF}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/22 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur transition duration-300 hover:-translate-y-0.5 hover:bg-white/16"
              >
                <Phone className="h-4 w-4" />
                Call {PHONE_LABEL}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Link
        href={PHONE_HREF}
        className="fixed right-4 bottom-4 z-40 inline-flex items-center gap-2 rounded-full bg-[#0f172a] px-5 py-3 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(15,23,42,0.24)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#111c34] md:right-6 md:bottom-6"
      >
        <Phone className="h-4 w-4" />
        Call Now
      </Link>
    </main>
  );
}

function Field({
  label,
  name,
  value,
  onChange,
  type = "text",
  required = false,
}: {
  label: string;
  name: keyof FormState;
  value: string;
  onChange: (field: keyof FormState, value: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-[#0f172a]">{label}</span>
      <input
        type={type}
        name={name}
        value={value}
        onChange={(event) => onChange(name, event.target.value)}
        required={required}
        className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm text-[#0f172a] outline-none transition focus:border-primary/35 focus:ring-4 focus:ring-primary/10"
      />
    </label>
  );
}

function InfoPanel({
  eyebrow,
  title,
  description,
  items,
  icon: Icon,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  items: readonly string[];
  icon: typeof Headset;
}) {
  return (
    <article className="rounded-[28px] border border-black/6 bg-white p-6 shadow-[0_22px_60px_rgba(15,23,42,0.06)]">
      <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Icon className="h-5 w-5" />
      </span>
      <p className="mt-5 text-xs font-semibold uppercase tracking-[0.22em] text-primary/80">{eyebrow}</p>
      <h3 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-[#0f172a]">{title}</h3>
      {description ? <p className="mt-4 text-base leading-7 text-[#475569]">{description}</p> : null}
      <div className="mt-6 space-y-3">
        {items.map((item) => (
          <div key={item} className="flex items-start gap-3 rounded-2xl border border-black/6 bg-[#f8fafc] px-4 py-3">
            <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary/12 text-primary">
              <ArrowRight className="h-3.5 w-3.5" />
            </span>
            <p className="text-sm font-medium text-[#334155]">{item}</p>
          </div>
        ))}
      </div>
    </article>
  );
}