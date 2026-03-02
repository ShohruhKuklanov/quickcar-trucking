import Link from "next/link";

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

export default function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-8 text-sm text-gray-500">
      {items.map((item, i) => (
        <span key={`${item.label}-${i}`}>
          {item.href ? (
            <Link href={item.href} className="hover:text-black">
              {item.label}
            </Link>
          ) : (
            <span className="text-gray-700">{item.label}</span>
          )}
          {i < items.length - 1 && " / "}
        </span>
      ))}
    </nav>
  );
}
