import { JsonLd } from "./JsonLd";

// Deliberately has no aggregateRating support. These tools collect no reviews,
// so any rating here would be fabricated - the kind of structured data Google
// issues manual actions for. Add it only alongside real, on-page reviews.
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
