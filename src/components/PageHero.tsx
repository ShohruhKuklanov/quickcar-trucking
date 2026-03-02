type PageHeroProps = {
  title: string;
  subtitle: string;
};

export default function PageHero({ title, subtitle }: PageHeroProps) {
  return (
    <section className="mb-16">
      <h1 className="text-4xl font-semibold tracking-tight text-gray-900 mb-6">
        {title}
      </h1>
      <p className="text-lg text-gray-600 leading-relaxed max-w-3xl">
        {subtitle}
      </p>
    </section>
  );
}
