import { AccountingEquationCalculator } from "@/components/calculators/AccountingEquationCalculator";
import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { FAQJsonLd } from "@/components/seo/FAQJsonLd";
import { SoftwareApplicationJsonLd } from "@/components/seo/SoftwareApplicationJsonLd";
import { FAQSection } from "@/components/tools/FAQSection";
import { RelatedGuideArticleSection } from "@/components/tools/RelatedGuideArticleSection";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { ToolPageLayout } from "@/components/tools/ToolPageLayout";
import { createMetadata } from "@/lib/seo/metadata";
import { siteConfig } from "@/lib/seo/site";

export const metadata = createMetadata({
  title: "Accounting Equation Calculator | Assets, Liabilities and Equity",
  description:
    "Use this free accounting equation calculator to solve for assets, liabilities, or equity using Assets = Liabilities + Equity.",
  path: "/tools/accounting-equation-calculator"
});

const accountingEquationFaqs = [
  {
    question: "What is the accounting equation?",
    answer:
      "The accounting equation is Assets = Liabilities + Equity. It shows how a business's resources are financed."
  },
  {
    question: "How do you calculate assets?",
    answer:
      "Add liabilities and equity together. Assets = Liabilities + Equity."
  },
  {
    question: "How do you calculate liabilities?",
    answer:
      "Subtract equity from assets. Liabilities = Assets - Equity."
  },
  {
    question: "How do you calculate equity?",
    answer:
      "Subtract liabilities from assets. Equity = Assets - Liabilities."
  },
  {
    question: "Can this calculator help with accounting homework?",
    answer:
      "Yes. It can help you check basic accounting equation problems, but you should still show your own working."
  },
  {
    question: "Why must the accounting equation balance?",
    answer:
      "It balances because every business resource is funded either by amounts owed to others or by the owner's claim."
  }
];

export default function AccountingEquationCalculatorPage() {
  const pageUrl = `${siteConfig.url}/tools/accounting-equation-calculator`;

  return (
    <ToolPageLayout eyebrow="Accounting Calculator">
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: siteConfig.url },
          { name: "Tools", url: `${siteConfig.url}/tools` },
          { name: "Accounting Equation Calculator", url: pageUrl }
        ]}
      />
      <SoftwareApplicationJsonLd
        description={metadata.description as string}
        name="Accounting Equation Calculator"
        url={pageUrl}
      />
      <FAQJsonLd faqs={accountingEquationFaqs} />
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-stone-950 sm:text-4xl">
          Accounting Equation Calculator
        </h1>
        <p className="mt-3 text-base leading-7 text-stone-600">
          Solve for assets, liabilities, or equity using the basic accounting equation: Assets =
          Liabilities + Equity.
        </p>
      </div>
      <AccountingEquationCalculator />
      <section className="border-t border-stone-200 pt-8">
        <h2 className="text-2xl font-semibold tracking-tight text-stone-950">
          Solve the accounting equation in a few steps
        </h2>
        <div className="mt-4 space-y-3 text-sm leading-6 text-stone-600 sm:text-base">
          <p>
            Use this accounting equation calculator to choose whether you want to calculate assets,
            calculate liabilities, or calculate equity. After that, enter the two known values and
            the tool solves the missing part of the basic accounting equation for you.
          </p>
          <p>→ Select `Assets`, `Liabilities`, or `Equity` at the top of the calculator.</p>
          <p>→ Enter the two known amounts shown for that selection.</p>
          <p>→ Review the instant result and formula summary below the inputs.</p>
          <p>→ Reset the fields anytime to start a new accounting equation calculation.</p>
        </div>
      </section>
      <section className="border-t border-stone-200 pt-8">
        <h2 className="text-2xl font-semibold tracking-tight text-stone-950">
          Understand assets, liabilities, and equity
        </h2>
        <div className="mt-4 space-y-4 text-sm leading-6 text-stone-600 sm:text-base">
          <p>
            The basic accounting equation is `Assets = Liabilities + Equity`. It shows that
            everything a business owns is funded either by money it owes or by the owner&apos;s
            interest in the business.
          </p>
          <p>
            Assets are the resources a business controls, such as cash, inventory, equipment, or
            receivables. Liabilities are obligations like loans, payables, or other amounts owed.
            Equity is the remaining value after liabilities are taken away from assets.
          </p>
          <p>
            That is why you can also calculate equity as `Assets - Liabilities`. In the same way,
            you can rearrange the equation to calculate assets or calculate liabilities depending on
            which two values you already know.
          </p>
        </div>
      </section>
      <section className="border-t border-stone-200 pt-8">
        <h2 className="text-2xl font-semibold tracking-tight text-stone-950">
          When to use this accounting equation calculator
        </h2>
        <div className="mt-4 space-y-3 text-sm leading-6 text-stone-600 sm:text-base">
          <p>→ Check homework answers for assets, liabilities, and equity questions.</p>
          <p>→ Practice basic accounting equation exercises and rearranged formulas.</p>
          <p>→ Review simple business balance checks before preparing a balance sheet.</p>
          <p>→ Learn how assets liabilities equity relationships work in accounting.</p>
          <p>→ Do a quick financial review when you need to calculate assets, liabilities, or equity.</p>
        </div>
      </section>
      <section className="border-t border-stone-200 pt-8">
        <h2 className="text-2xl font-semibold tracking-tight text-stone-950">
          Connect the accounting equation with other accounting tools
        </h2>
        <p className="mt-4 text-sm leading-6 text-stone-600 sm:text-base">
          After using this accounting equation calculator, you can continue with related tools to
          check balances, review business performance, understand cash movement, or create simple
          documents for day-to-day operations.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <ButtonLink href="/tools/trial-balance-calculator" variant="secondary">
            Trial Balance Calculator
          </ButtonLink>
          <ButtonLink href="/tools/financial-ratio-calculator" variant="secondary">
            Financial Ratio Calculator
          </ButtonLink>
          <ButtonLink href="/tools/cash-flow-calculator" variant="secondary">
            Cash Flow Calculator
          </ButtonLink>
          <ButtonLink href="/tools/invoice-generator" variant="secondary">
            Free Invoice Generator Malaysia
          </ButtonLink>
          <ButtonLink href="/tools" variant="secondary">
            All Tools
          </ButtonLink>
        </div>
      </section>
      <RelatedGuideArticleSection
        articles={[
          {
            description:
              "Learn debit and credit rules, normal balances, beginner examples, and how account changes connect with basic accounting logic.",
            href: "/guides/debit-vs-credit",
            label: "Accounting basics guide",
            title: "Debit vs Credit"
          }
        ]}
        toolName="Accounting Equation Calculator"
      />
      <FAQSection
        faqs={accountingEquationFaqs}
        title="Accounting Equation Calculator FAQs"
      />
    </ToolPageLayout>
  );
}
