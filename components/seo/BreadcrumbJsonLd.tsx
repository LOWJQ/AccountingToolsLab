import { JsonLd } from "./JsonLd";

type BreadcrumbJsonLdProps = {
  items: Array<{
    name: string;
    url: string;
  }>;
};

export function BreadcrumbJsonLd({ items }: BreadcrumbJsonLdProps) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: item.name,
          item: item.url
        }))
      }}
    />
  );
}
