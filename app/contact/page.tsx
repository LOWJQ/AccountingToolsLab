import { Container } from "@/components/layout/Container";
import { ContactForm } from "@/components/contact/ContactForm";
import { createMetadata } from "@/lib/seo/metadata";

export const metadata = createMetadata({
  title: "Contact AccountingToolsLab",
  description:
    "Contact AccountingToolsLab with feedback, issue reports, or suggestions for future accounting tools.",
  path: "/contact"
});

const contactEmail = "accttoolslab@gmail.com";

const contactOptions = [
  {
    title: "Feedback and suggestions",
    text: "Share ideas for new accounting calculators, page improvements, or beginner-friendly explanations."
  },
  {
    title: "Report an issue",
    text: "Found a calculation problem, broken page, or confusing explanation? Report it so it can be reviewed."
  },
  {
    title: "General contact",
    text: `For general questions about AccountingToolsLab. Direct email: ${contactEmail}.`
  }
];

export default function ContactPage() {
  return (
    <main>
      <section className="w-full border-b border-stone-200 bg-[#eef6f5]">
        <Container className="gap-0 py-10 sm:py-12 lg:py-14">
          <p className="text-sm font-medium tracking-wide text-slate-500">Contact</p>
          <h1 className="mt-4 max-w-4xl text-4xl font-semibold tracking-tight text-stone-950 sm:text-5xl">
            Get in touch about AccountingToolsLab
          </h1>
          <p className="mt-5 text-base leading-7 text-stone-600">
            Have feedback, found an issue, or want to suggest a new accounting tool? You can
            reach out and help improve AccountingToolsLab.
          </p>
        </Container>
      </section>

      <Container className="py-12 sm:py-16">
        <section
          className="scroll-mt-24 overflow-hidden rounded-2xl border border-stone-300 bg-white shadow-sm"
          id="contact-form"
        >
          <ContactForm />
        </section>

        <section className="space-y-8">
          <article>
            <h2 className="text-xl font-semibold tracking-tight text-stone-950">
              How to reach out
            </h2>
            <p className="mt-4 text-sm leading-6 text-stone-600 sm:text-base">
              Keep messages specific where possible so feedback can be reviewed clearly.
            </p>
            <ul className="mt-5 grid gap-4 text-sm leading-6 text-stone-600 sm:text-base">
            {contactOptions.map((option) => (
              <li className="flex gap-3" key={option.title}>
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-600" />
                <span>
                  <span className="font-semibold text-stone-950">{option.title}</span>
                  <span className="block">{option.text}</span>
                </span>
              </li>
            ))}
            </ul>
          </article>

          <article>
            <h2 className="text-xl font-semibold tracking-tight text-stone-950">
              What to include
            </h2>
            <p className="mt-4 text-sm leading-6 text-stone-600 sm:text-base">
              If you are reporting a calculator issue, include the tool name, the values you
              entered, the result you expected, and the result shown.
            </p>
            <p className="mt-4 text-sm leading-6 text-stone-500">
              Direct email fallback:{" "}
              <span className="font-semibold text-stone-700">{contactEmail}</span>
            </p>
          </article>

          <article>
            <h2 className="text-xl font-semibold tracking-tight text-stone-950">
              Before you contact
            </h2>
            <p className="mt-4 text-sm leading-6 text-stone-600 sm:text-base">
              AccountingToolsLab is a free educational tools site. Please avoid sending
              sensitive personal, financial, or confidential business information by email.
            </p>
          </article>
        </section>

      </Container>
    </main>
  );
}
