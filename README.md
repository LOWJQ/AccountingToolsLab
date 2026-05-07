# AccountingToolsLab

AccountingToolsLab is a free accounting tools website for accounting students, beginners, and small business owners. It provides simple calculators and beginner-friendly explanations for core accounting topics.

Production domain:

```text
https://www.accountingtoolslab.com
```

## Current Status

The project is a Next.js App Router site with multiple working calculators, guide pages, SEO routes, and shared site layout.

Currently available:

- Homepage
- Tools directory
- Guides directory
- About page
- Contact page
- Privacy Policy
- Terms of Use
- Trial Balance Calculator
- Accounting Equation Calculator
- Debit/Credit Helper
- Financial Ratio Calculator
- Depreciation Calculator
- Break-even Calculator
- Cash Flow Calculator
- Invoice Generator
- Malaysia SST Calculator
- Journal Entry Checker
- Trial Balance Explained guide
- Debit vs Credit guide
- Financial Ratios for Beginners guide
- Why Trial Balance Is Not Balancing guide
- Journal Entries for Beginners guide
- Cash Flow vs Profit guide
- Break-even Point Explained guide
- Straight-Line Depreciation Explained guide
- How to Create a Simple Invoice guide
- SST Calculator Malaysia guide

## Not Implemented Yet

- Database
- Login or authentication
- Payments
- Ads
- AI features
- Dashboard features

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Vercel Analytics
- Vercel Speed Insights
- Vercel deployment target

## Folder Structure

```text
app/                Next.js App Router routes, root layout, sitemap, and robots files.
components/         Layout, calculator, tool, SEO, and UI component folders.
lib/                Calculator logic, shared data, SEO helpers, utilities, and validation placeholders.
types/              Shared TypeScript types for tools, calculators, SEO, and accounting concepts.
public/             Static assets such as logo and favicon assets.
tests/              Calculator logic tests.
```

## Key Routes

```text
/                                             Homepage
/tools                                        Tools directory
/tools/trial-balance-calculator               Trial Balance Calculator
/tools/accounting-equation-calculator         Accounting Equation Calculator
/tools/debit-credit-checker                   Debit/Credit Helper
/tools/financial-ratio-calculator             Financial Ratio Calculator
/tools/depreciation-calculator                Depreciation Calculator
/tools/break-even-calculator                  Break-even Calculator
/tools/cash-flow-calculator                   Cash Flow Calculator
/tools/invoice-generator                      Invoice Generator
/tools/sst-calculator-malaysia                Malaysia SST Calculator
/tools/journal-entry-checker                  Journal Entry Checker
/guides                                       Guides directory
/guides/trial-balance-explained               Trial Balance Explained guide
/guides/debit-vs-credit                       Debit vs Credit guide
/guides/financial-ratios-for-beginners        Financial Ratios for Beginners guide
/guides/why-trial-balance-not-balancing       Why Trial Balance Is Not Balancing guide
/guides/journal-entries-for-beginners         Journal Entries for Beginners guide
/guides/cash-flow-vs-profit                   Cash Flow vs Profit guide
/guides/break-even-point-explained            Break-even Point Explained guide
/guides/straight-line-depreciation-explained  Straight-Line Depreciation Explained guide
/guides/how-to-create-a-simple-invoice        How to Create a Simple Invoice guide
/guides/sst-calculator-malaysia-add-remove-sst SST Calculator Malaysia guide
/about                                        About page
/contact                                      Contact page
/privacy-policy                               Privacy Policy
/terms                                        Terms of Use
```

## Environment

The canonical production URL is configured in `lib/seo/site.ts`:

```text
https://www.accountingtoolslab.com
```

Contact form email delivery uses Resend through the App Router API route at
`/api/contact`. Configure these server-side environment variables:

```text
RESEND_API_KEY=
CONTACT_TO_EMAIL=accttoolslab@gmail.com
CONTACT_FROM_EMAIL=AccountingToolsLab <onboarding@resend.dev>
```

Do not prefix `RESEND_API_KEY` with `NEXT_PUBLIC_`. Add the variables to
`.env.local` for local development and to Vercel Environment Variables for
production. For production, `CONTACT_FROM_EMAIL` should use a verified sender
or domain in Resend. `onboarding@resend.dev` is mainly for testing.

After changing local environment variables, restart `npm run dev`. After
changing Vercel environment variables, redeploy the project.

To test the contact form locally:

1. Create `.env.local`.
2. Add `RESEND_API_KEY`.
3. Add `CONTACT_FROM_EMAIL`.
4. Add `CONTACT_TO_EMAIL`.
5. Restart the dev server.
6. Submit the form from `/contact`.
7. If it fails, check the dev terminal for the safe Resend status summary.
8. Check the Resend dashboard logs.

The YouTube tutorial stores contacts in Neon with Drizzle and server actions.
This project currently sends contact submissions by email through a Next.js API
route and Resend.

## Development

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Run tests:

```bash
npm test
```

Build for production:

```bash
npm run build
```

Run linting:

```bash
npm run lint
```

## Deployment

The project is prepared for Vercel deployment.

Before deploying, check:

- The custom domain is configured in Vercel
- Apex and HTTP traffic redirect to `https://www.accountingtoolslab.com`
- Footer and navigation links work
- Sitemap and robots output use the production domain
- Contact email is correct
- Vercel Analytics and Speed Insights are enabled

## Next Steps

1. Add more guide content for accounting topics.
2. Replace placeholder OG image with a production-ready image.
3. Review Privacy Policy and Terms before major public launch updates.
4. Add more focused tests as calculator behavior expands.
