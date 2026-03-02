type FAQItem = {
  question: string;
  answer: string;
};

type FAQSectionProps = {
  title?: string;
  items: FAQItem[];
};

export default function FAQSection({ title = "Frequently asked questions", items }: FAQSectionProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <section className="mb-20" aria-label={title}>
      <h2 className="text-2xl font-semibold text-gray-900 mb-6">{title}</h2>

      <div className="divide-y divide-black/5 rounded-2xl border border-black/5 bg-white">
        {items.map((item, idx) => (
          <details key={`${item.question}-${idx}`} className="group p-6">
            <summary className="cursor-pointer list-none font-medium text-gray-900">
              <span className="inline-flex items-center justify-between w-full">
                <span>{item.question}</span>
                <span className="ml-6 text-gray-400 transition-transform duration-300 group-open:rotate-45">
                  +
                </span>
              </span>
            </summary>
            <div className="mt-3 text-gray-600 leading-relaxed">{item.answer}</div>
          </details>
        ))}
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd),
        }}
      />
    </section>
  );
}
