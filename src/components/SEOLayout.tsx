import type { ReactNode } from "react";

type SEOLayoutProps = {
  breadcrumbs?: unknown;
  title: string;
  subtitle: string;
  children: ReactNode;
};

export default function SEOLayout({ breadcrumbs, title, subtitle, children }: SEOLayoutProps) {
  // Breadcrumb UI intentionally removed site-wide (keep prop for backwards compatibility).
  void breadcrumbs;

  return (
    <main className="max-w-6xl mx-auto px-6 py-20">
      <section className="mb-16">
        <h1 className="text-4xl font-semibold tracking-tight text-gray-900 mb-6">{title}</h1>
        <p className="text-lg text-gray-600 leading-relaxed max-w-3xl">{subtitle}</p>
      </section>

      {children}
    </main>
  );
}
