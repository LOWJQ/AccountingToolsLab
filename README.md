# AccountingToolsLab

AccountingToolsLab is planned as a free, SEO-focused accounting tools website for accounting students, beginners, and small business owners.

## Current Status

This repository is an architecture scaffold only. It contains the initial Next.js App Router structure, placeholder routes, placeholder components, basic metadata helpers, placeholder data files, placeholder calculator logic files, and starter TypeScript types.

## Not Implemented Yet

- Frontend tool interfaces
- Calculator formulas
- AI-powered journal entry generation
- Backend APIs
- Database
- Login or authentication
- Payments
- Ads
- Dashboard features
- Full SEO articles or polished page content

## Folder Structure

```text
app/                Next.js App Router routes, root layout, sitemap, and robots files.
components/         Placeholder layout, tool, calculator, SEO, and shadcn/ui-compatible component folders.
lib/                Placeholder calculator logic, data, SEO helpers, utilities, and validation files.
types/              Shared TypeScript types for tools, calculators, SEO, and accounting concepts.
public/             Static assets such as the placeholder logo, OG image, and icons folder.
tests/              Placeholder calculator test files.
```

## Development

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Deployment

The project is intended to be Vercel-ready.

## Next Steps

1. Replace placeholder route content with simple SEO-friendly page layouts.
2. Build calculator UI components in `components/calculators/`.
3. Implement calculator formulas in `lib/calculators/`.
4. Add validation schemas in `lib/validations/`.
5. Add real tests in `tests/` as calculator logic is implemented.
6. Expand SEO metadata and schema helpers after the real content structure is ready.
