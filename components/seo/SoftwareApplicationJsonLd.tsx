import { JsonLd } from "./JsonLd";

type SoftwareApplicationJsonLdProps = {
  applicationCategory?: string;
  name: string;
  description: string;
  priceCurrency?: string;
  url: string;
};

export function SoftwareApplicationJsonLd({
  applicationCategory = "FinanceApplication",
  description,
  name,
  priceCurrency = "MYR",
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
        applicationCategory,
        operatingSystem: "Web",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency
        }
      }}
    />
  );
}
