import type { Metadata } from "next";
import { InvoiceGenerator } from "@/components/calculators/InvoiceGenerator";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { FAQJsonLd } from "@/components/seo/FAQJsonLd";
import { SoftwareApplicationJsonLd } from "@/components/seo/SoftwareApplicationJsonLd";
import { FAQSection } from "@/components/tools/FAQSection";
import { ToolPageLayout } from "@/components/tools/ToolPageLayout";
import { siteConfig } from "@/lib/seo/site";

export const metadata: Metadata = {
  title: "Invoice Generator | Create a Simple Invoice",
  description:
    "Use this free invoice generator to create a simple invoice with line items, subtotal, total, customer details, and business details."
};

const invoiceFaqs = [
  {
    question: "What is an invoice?",
    answer:
      "An invoice is a document sent to a customer to request payment for goods or services."
  },
  {
    question: "What should an invoice include?",
    answer:
      "A simple invoice usually includes seller details, customer details, invoice number, dates, line items, subtotal, total, and notes."
  },
  {
    question: "Can I print the invoice?",
    answer:
      "Yes. Use the print button to open your browser's print dialog for the invoice page."
  },
  {
    question: "Does this invoice generator include tax?",
    answer:
      "No. This simple invoice generator does not include tax, SST, VAT, or sales tax calculations."
  },
  {
    question: "Is an invoice the same as a receipt?",
    answer:
      "No. An invoice requests payment, while a receipt confirms payment has been received."
  },
  {
    question: "Can this tool help small businesses?",
    answer:
      "Yes. It can help create a simple invoice preview, but it does not replace accounting or tax advice."
  }
];

export default function InvoiceGeneratorPage() {
  const pageUrl = `${siteConfig.url}/tools/invoice-generator`;

  return (
    <ToolPageLayout eyebrow="Business Tool">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: siteConfig.url },
          { name: "Tools", url: `${siteConfig.url}/tools` },
          { name: "Invoice Generator", url: pageUrl }
        ]}
      />
      <SoftwareApplicationJsonLd
        description={metadata.description as string}
        name="Invoice Generator"
        url={pageUrl}
      />
      <FAQJsonLd faqs={invoiceFaqs} />
      <InvoiceGenerator />
      <FAQSection faqs={invoiceFaqs} title="Invoice Generator FAQs" />
    </ToolPageLayout>
  );
}
