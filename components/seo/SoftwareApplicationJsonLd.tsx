import { JsonLd } from "./JsonLd";

type SoftwareApplicationJsonLdProps = {
  name: string;
  description: string;
  url: string;
};

export function SoftwareApplicationJsonLd({
  description,
  name,
  url
}: SoftwareApplicationJsonLdProps) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        name,
        description,
        url,
        applicationCategory: "FinanceApplication",
        operatingSystem: "Web",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD"
        }
      }}
    />
  );
}
