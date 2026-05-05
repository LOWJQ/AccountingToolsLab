# AccountingToolsLab

AccountingToolsLab is a free accounting tools website for accounting students, beginners, and small business owners. It provides simple calculators and beginner-friendly explanations for core accounting topics.

Production domain:

```text
https://www.accountingtoolslab.com
```

## Current Status

The project is an early-stage Next.js App Router site.

Currently available:

- Homepage
- Tools directory
- Guides directory
- About page
- Contact page
- Privacy Policy
- Terms of Use
- Trial Balance Calculator
- Trial Balance Explained guide

The Trial Balance Calculator is the first working calculator. It supports editable rows, live debit and credit totals, balanced/unbalanced status, empty-state handling, decimal values, and validation for negative or invalid row values.

## Not Implemented Yet

- Other calculator logic
- Full guide articles for every planned guide
- Backend APIs
- Database
- Login or authentication
- Payments
- Ads
- AI features
- Dashboard features
- Working contact form submission

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
public/             Static assets such as logo, OG image placeholder, and icons folder.
tests/              Trial balance calculation tests.
```

## Key Routes

```text
/                                  Homepage
/tools                             Tools directory
/tools/trial-balance-calculator    Working Trial Balance Calculator
/guides                            Guides directory
/guides/trial-balance-explained    Finished beginner guide
/about                             About page
/contact                           Contact page
/privacy-policy                    Privacy Policy
/terms                             Terms of Use
```

Unfinished guide pages use `noindex` metadata and are not included in the sitemap.

## Environment

Create a local `.env.local` if needed:

```bash
NEXT_PUBLIC_SITE_URL=https://www.accountingtoolslab.com
```

The default fallback site URL is configured in `lib/seo/site.ts`.

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

## Deployment

The project is prepared for Vercel deployment.

Before deploying, check:

- `NEXT_PUBLIC_SITE_URL` is set to `https://www.accountingtoolslab.com`
- The custom domain is configured in Vercel
- Footer and navigation links work
- Sitemap and robots output use the production domain
- Contact email is correct
- Vercel Analytics and Speed Insights are enabled in the Vercel project dashboard

## Next Steps

1. Build the next calculator, likely Accounting Equation Calculator.
2. Add real guide content for Debit vs Credit.
3. Add real guide content for Financial Ratios for Beginners.
4. Replace placeholder OG image with a production-ready image.
5. Review Privacy Policy and Terms before public launch.
6. Add more focused tests as new calculator logic is implemented.
