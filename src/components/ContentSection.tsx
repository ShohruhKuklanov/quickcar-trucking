import type { ReactNode } from "react";

type ContentSectionProps = {
  title: string;
  children: ReactNode;
  className?: string;
};

export default function ContentSection({ title, children, className }: ContentSectionProps) {
  return (
    <section className={`mb-20 ${className ?? ""}`.trim()}>
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">{title}</h2>
      <div className="text-gray-600 leading-relaxed">{children}</div>
    </section>
  );
}
