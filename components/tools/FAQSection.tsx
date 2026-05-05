import { Card } from "@/components/ui/Card";

export type FAQItem = {
  question: string;
  answer: string;
};

type FAQSectionProps = {
  faqs: FAQItem[];
  eyebrow?: string;
  title?: string;
};

export function FAQSection({
  eyebrow = "FAQ",
  faqs,
  title = "Trial Balance Calculator FAQs"
}: FAQSectionProps) {
  return (
    <Card className="p-6 sm:p-8">
      <p className="text-sm font-medium tracking-wide text-slate-500">{eyebrow}</p>
      <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950 sm:text-3xl">
        {title}
      </h2>
      <div className="mt-6 divide-y divide-stone-100">
        {faqs.map((faq) => (
          <article className="py-5 first:pt-0 last:pb-0" key={faq.question}>
            <h3 className="text-base font-semibold text-stone-950">{faq.question}</h3>
            <p className="mt-2 text-sm leading-6 text-stone-600">{faq.answer}</p>
          </article>
        ))}
      </div>
    </Card>
  );
}
