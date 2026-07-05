import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { ContactForm } from "@/components/contact/ContactForm";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { createMetadata } from "@/lib/seo/metadata";
import { siteConfig } from "@/lib/seo/site";
import { Bug, Mail, MessageSquareText } from "lucide-react";

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
    text: "Share ideas for new accounting calculators, page improvements, or beginner-friendly explanations.",
    icon: MessageSquareText
  },
  {
    title: "Report an issue",
    text: "Found a calculation problem, broken page, or confusing explanation? Report it so it can be reviewed.",
    icon: Bug
  },
  {
    title: "General contact",
    text: "For general questions about AccountingToolsLab.",
    icon: Mail
  }
];

const includeItems = [
  {
    title: "Tool name",
    text: "Which tool or page you were using."
  },
  {
    title: "Values entered",
    text: "The input values you entered."
  },
  {
    title: "Expected result",
    text: "What result you expected to see."
  },
  {
    title: "Actual result",
    text: "What result you got."
  },
  {
    title: "Additional notes",
    text: "Anything else that might help."
  }
];

export default function ContactPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: siteConfig.url },
          { name: "Contact", url: `${siteConfig.url}/contact` }
        ]}
      />

      <main className="bg-white">
        <section className="w-full bg-white">
          <Container className="gap-0 pt-12 pb-10 sm:pt-16 sm:pb-12">
            <nav aria-label="Breadcrumb" className="mb-10 text-sm text-slate-500">
              <ol className="flex flex-wrap items-center gap-2">
                <li>
                  <Link className="transition hover:text-slate-900" href="/">
                    Home
                  </Link>
                </li>
                <li aria-hidden="true">&gt;</li>
                <li className="font-medium text-slate-700">Contact</li>
              </ol>
            </nav>

            <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
              Get in touch about Accounting Tools Lab
            </h1>
            <p className="mt-5 text-base leading-7 text-black">
              Have feedback, found an issue, or want to suggest a new accounting tool? You can
              reach out and help improve Accounting Tools Lab.
            </p>
            <div className="mt-10 border-t border-slate-200" />
          </Container>
        </section>

        <Container className="gap-0 pb-12 pt-0 sm:pb-16">
        <section
          className="grid scroll-mt-24 gap-10 border-b border-slate-200 pb-10 lg:grid-cols-[minmax(0,1.45fr)_minmax(20rem,0.85fr)] lg:gap-12 lg:pb-12"
          id="contact-form"
        >
          <div>
            <ContactForm />
          </div>

          <aside className="border-t border-slate-200 pt-8 lg:border-l lg:border-t-0 lg:pl-12 lg:pt-0">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
              How to reach out
            </h2>
            <p className="mt-4 text-base leading-7 text-black">
              Keep messages specific where possible so feedback can be reviewed clearly.
            </p>
            <div className="mt-8">
              {contactOptions.map((option, index) => {
                const Icon = option.icon;

                return (
                  <article
                    className={index === 0 ? "pb-7" : "border-t border-slate-200 py-7"}
                    key={option.title}
                  >
                    <div className="flex gap-4">
                      <Icon aria-hidden="true" className="mt-1 h-6 w-6 shrink-0 text-slate-900" />
                      <div>
                        <h3 className="text-base font-semibold leading-6 text-slate-950">
                          {option.title}
                        </h3>
                        <p className="mt-3 text-base leading-7 text-black">{option.text}</p>
                        {option.title === "General contact" ? (
                          <p className="mt-2 text-base leading-7 text-black">
                            Direct email:{" "}
                            <a
                              className="font-medium text-teal-700 underline-offset-4 hover:underline"
                              href={`mailto:${contactEmail}`}
                            >
                              {contactEmail}
                            </a>
                          </p>
                        ) : null}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </aside>
        </section>

        <section className="border-b border-slate-200 py-10 md:py-12">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-950">What to include</h2>
          <p className="mt-4 text-base leading-7 text-black">
            If you are reporting a calculator issue, include the details below to help us reproduce
            the problem.
          </p>
          <ul className="mt-7 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {includeItems.map((item) => (
              <li className="text-base leading-7 text-black" key={item.title}>
                <div className="flex gap-3">
                  <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-600" />
                  <div>
                    <h3 className="font-semibold text-slate-950">{item.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-black">{item.text}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="py-10 md:py-12">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
            Before you contact
          </h2>
          <p className="mt-4 text-base leading-7 text-black">
            Accounting Tools Lab is a free tools site. Please avoid sending sensitive personal, financial, or confidential business information by email.
          </p>
        </section>
        </Container>
      </main>
    </>
  );
}
