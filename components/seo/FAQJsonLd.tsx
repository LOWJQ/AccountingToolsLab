import { JsonLd } from "./JsonLd";

type FAQJsonLdProps = {
  faqs: Array<{
    question: string;
    answer: string;
  }>;
};

export function FAQJsonLd({ faqs }: FAQJsonLdProps) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer
          }
        }))
      }}
    />
  );
}
