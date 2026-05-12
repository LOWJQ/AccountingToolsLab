import { JsonLd } from "./JsonLd";

type SoftwareApplicationJsonLdProps = {
  aggregateRating?: {
    ratingValue: string;
    reviewCount: string;
  };
  applicationCategory?: string;
  name: string;
  description: string;
  priceCurrency?: string;
  url: string;
};

export function SoftwareApplicationJsonLd({
  aggregateRating,
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
        ...(aggregateRating
          ? {
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: aggregateRating.ratingValue,
                reviewCount: aggregateRating.reviewCount
              }
            }
          : {}),
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency
        }
      }}
    />
  );
}
