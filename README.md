# AccountingToolsLab

AccountingToolsLab is a free Malaysia-friendly accounting tools website for freelancers, students, small business owners, side-hustle sellers, and beginners. It provides simple invoice, SST, calculator, and guide pages for everyday record-keeping and learning.

Production domain:

```text
https://www.accountingtoolslab.com
```

## Current Status

The project is a Next.js App Router site with multiple working calculators, guide pages, SEO routes, a contact API route, and shared site layout.

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
components/         Layout, calculator, invoice, contact, tool, SEO, and UI component folders.
hooks/              Client hooks for focused invoice-generator behavior.
lib/                Calculator logic, invoice helpers, contact helpers, shared data, SEO helpers, and utilities.
types/              Small shared TypeScript types that are still used across the app.
public/             Static assets such as logos, favicons, OG images, and guide images.
tests/              Lightweight TypeScript/Node tests for calculators, invoice logic, contact API helpers, and SEO helpers.
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
NEXT_PUBLIC_SITE_URL=https://www.accountingtoolslab.com
RESEND_API_KEY=
CONTACT_TO_EMAIL=accttoolslab@gmail.com
CONTACT_FROM_EMAIL=AccountingToolsLab <onboarding@resend.dev>
TURNSTILE_SECRET_KEY=
CONTACT_TURNSTILE_TIMEOUT_MS=8000
CONTACT_RESEND_TIMEOUT_MS=10000
```

Configure the public Cloudflare Turnstile site key for the browser widget:

```text
NEXT_PUBLIC_TURNSTILE_SITE_KEY=
```

Do not prefix `RESEND_API_KEY` or `TURNSTILE_SECRET_KEY` with `NEXT_PUBLIC_`.
Add the variables to `.env.local` for local development and to Vercel
Environment Variables for production. For production, `CONTACT_FROM_EMAIL`
should use a verified sender or domain in Resend. `onboarding@resend.dev` is
mainly for testing. `CONTACT_TO_EMAIL` should be a valid comma-separated list
of recipient email addresses; if it is configured incorrectly, the contact API
fails safely instead of silently falling back.

The contact API includes an in-memory rate limiter for local/dev/test. That
fallback is not cross-instance protection on serverless deployments. The route
uses a small `RateLimitStore` interface so Redis, Vercel KV, or another shared
store can be wired later without changing request handling.

Contact form security behavior:

- Request bodies are read with a hard byte limit before JSON parsing.
- Required fields, email, topic, page URL, field lengths, and unsafe control characters are validated server-side.
- A honeypot field silently accepts likely bot submissions without sending email.
- Cloudflare Turnstile is verified server-side when configured.
- Cloudflare Turnstile and Resend requests use server-side timeouts so a slow
  provider does not leave the API waiting indefinitely.
- Resend and Turnstile secrets are server-only and must not use `NEXT_PUBLIC_`.
- Proxy IP headers are trusted only on Vercel or when `CONTACT_TRUST_PROXY_HEADERS=true` is explicitly set behind a trusted proxy.

When self-hosting behind a trusted reverse proxy, set
`CONTACT_TRUST_PROXY_HEADERS=true` only if the proxy strips incoming
`x-forwarded-for` / `x-real-ip` headers before setting its own. Vercel is
trusted automatically through `VERCEL=1`.

After changing local environment variables, restart `npm run dev`. After
changing Vercel environment variables, redeploy the project.

To test the contact form locally:

1. Create `.env.local`.
2. Add `RESEND_API_KEY`.
3. Add `CONTACT_FROM_EMAIL`.
4. Add `CONTACT_TO_EMAIL`.
5. Add `NEXT_PUBLIC_TURNSTILE_SITE_KEY`.
6. Add `TURNSTILE_SECRET_KEY`.
7. Restart the dev server.
8. Submit the form from `/contact`.
9. If it fails, check the dev terminal for the safe Resend status summary.
10. Check the Resend dashboard logs.

The YouTube tutorial stores contacts in Neon with Drizzle and server actions.
This project currently sends contact submissions by email through a Next.js API
route and Resend.

## Production Security

`next.config.mjs` applies baseline HTTP security headers to every route:

- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `X-Frame-Options: DENY`
- `Permissions-Policy` disabling camera, microphone, geolocation, payment, USB, and browsing topics
- `Content-Security-Policy`

The CSP is intentionally staged instead of nonce-only. It keeps the app
compatible with Next.js App Router, Cloudflare Turnstile, Vercel Analytics,
Vercel Speed Insights, uploaded invoice logo/QR previews, and PDF generation.
It allows `data:` and `blob:` only for media/image/worker cases where the app
needs local previews or generated files.

Manual browser checks after CSP changes:

1. Open `/contact` and confirm the Turnstile widget loads.
2. Submit a valid contact form message in a staging environment.
3. Open `/tools/invoice-generator`.
4. Upload an invoice logo and payment QR image and confirm previews render.
5. Preview and download an invoice PDF.
6. Check the browser console for CSP violations.
7. Confirm Vercel Analytics and Speed Insights still receive events in production.

The contact rate limiter currently uses the in-memory fallback in
`MemoryRateLimitStore`. That is useful for local/dev/test, but it is not enough
across multiple serverless instances. For production abuse protection, wire the
exported `RateLimitStore` / `SharedRateLimitStore` interface to Redis, Vercel
KV, Upstash, or another shared store with atomic increment and expiry. Keep
store credentials server-only; do not expose them with `NEXT_PUBLIC_`.

## Invoice Generator Privacy

The invoice generator is client-side and designed for simple PDF invoices and
record-keeping. Draft invoice data is saved in the user's browser localStorage
when available, so repeat editing works on the same device. Uploaded logo and
payment QR image data URLs are intentionally stripped before drafts are saved,
so those images remain in the current browser session and PDF output but are
not persisted to localStorage.

Uploaded invoice logos and payment QR images are validated before use. They are
only used for the current preview/PDF workflow and are not uploaded to a server
by the invoice generator.

The invoice generator does not submit, validate, or connect invoices to
LHDN/MyInvois and should not be treated as professional accounting, tax, or
legal advice.

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

The test runner compiles the lightweight TypeScript tests with
`tsconfig.test.json`, then runs the compiled `.test.js` files through
`scripts/run-tests.mjs`. The project does not currently use Vitest or a browser
component test runner; add one only if component interaction tests become worth
the extra setup.

Run linting:

```bash
npm run lint
```

Run a TypeScript type check without emitting files:

```bash
npx tsc --noEmit
```

Build for production:

```bash
npm run build
```

Static metadata assets are served from `public/`. The default OG image and the
invoice/guide OG image are expected to be 1200x630 PNG files so metadata and
actual asset dimensions stay aligned.

Run a dependency audit:

```bash
npm audit --audit-level=moderate
```

Current audit note: Next.js advisories may require a major Next upgrade
according to `npm audit fix --force`. Do not force that automatically; treat it
as a separate framework migration and verify App Router routes, metadata,
security headers, analytics, Turnstile, and PDF generation after upgrading.

## Deployment

The project is prepared for Vercel deployment.

Before deploying, check:

- The custom domain is configured in Vercel
- Apex and HTTP traffic redirect to `https://www.accountingtoolslab.com`
- Footer and navigation links work
- Sitemap and robots output use the production domain
- Security headers are present on the homepage and key routes
- CSP does not block Turnstile, invoice previews, PDF downloads, or analytics
- Contact email is correct
- `NEXT_PUBLIC_TURNSTILE_SITE_KEY` and `TURNSTILE_SECRET_KEY` are configured together
- Vercel Analytics and Speed Insights are enabled

Recommended production build check:

```bash
rm -rf .next
NEXT_TELEMETRY_DISABLED=1 npm run build
```

On Windows PowerShell, use:

```powershell
Remove-Item -LiteralPath .next -Recurse -Force
$env:NEXT_TELEMETRY_DISABLED='1'
npm.cmd run build
```

## Next Steps

1. Add more guide content for accounting topics only when there is a clear search intent.
2. Review Privacy Policy and Terms before major public launch updates.
3. Add more focused tests as calculator behavior expands.
4. Wire the contact rate limiter to Redis, Vercel KV, or another shared store if the site needs cross-instance production rate limiting.
