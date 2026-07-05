export type FAQItem = {
  question: string;
  answer: string;
};

type FAQSectionProps = {
  faqs: FAQItem[];
  eyebrow?: string;
  id?: string;
  title?: string;
};

export function FAQSection({
  eyebrow = "FAQ",
  faqs,
  id,
  title = "Frequently Asked Questions"
}: FAQSectionProps) {
  return (
    <section className="border-t border-stone-200 pt-8" id={id}>
      {eyebrow ? <p className="text-sm font-medium tracking-wide text-slate-500">{eyebrow}</p> : null}
      <h2 className={`${eyebrow ? "mt-3" : ""} text-2xl font-semibold tracking-tight text-stone-950 sm:text-3xl`}>
        {title}
      </h2>
      <div className="mt-6 divide-y divide-stone-200">
        {faqs.map((faq) => (
          <details className="group py-5 first:pt-0 last:pb-0" key={faq.question}>
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-semibold text-stone-950">
              <span>{faq.question}</span>
              <span
                aria-hidden="true"
                className="flex h-7 w-7 shrink-0 items-center justify-center text-stone-500 transition group-open:rotate-180"
              >
                <svg
                  className="h-3.5 w-3.5"
                  fill="none"
                  viewBox="0 0 16 16"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3.5 6L8 10.5L12.5 6"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.25"
                  />
                </svg>
              </span>
            </summary>
            <p className="mt-3 text-sm leading-6 text-stone-950">{faq.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
