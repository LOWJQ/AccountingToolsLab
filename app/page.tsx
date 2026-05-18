import Link from "next/link";
import { ToolsMarquee } from "@/components/home/ToolsMarquee";
import { JsonLd } from "@/components/seo/JsonLd";
import { createMetadata } from "@/lib/seo/metadata";
import { createOrganizationSchema, createWebsiteSchema } from "@/lib/seo/schema";

export const metadata = createMetadata({
  title: "Free Invoice Generator and Accounting Tools | AccountingToolsLab",
  description:
    "Create simple invoices, download PDFs, choose from 10 supported currencies including MYR, calculate SST, and use free accounting tools for small businesses, freelancers, and learners.",
  path: "/"
});

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-hidden text-stone-950">
      <JsonLd data={createWebsiteSchema()} />
      <JsonLd data={createOrganizationSchema()} />

      <section className="pb-16 pt-20 text-center sm:pb-20 sm:pt-24 lg:pt-28">
        <div className="mx-auto max-w-[1080px] px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl">
            <h1 className="font-display text-4xl font-extrabold leading-[0.92] tracking-tight text-stone-950 sm:text-5xl lg:text-6xl xl:text-7xl">
              Simple accounting tools
              <br className="hidden md:block" /> for modern small businesses
            </h1>
            <p className="mx-auto mt-7 max-w-3xl text-base leading-7 text-stone-600 sm:text-lg">
              Create invoices, calculate SST, check cash flow, review ratios, and handle everyday
              accounting checks from one clean workspace.
            </p>

            <div className="mt-9 flex flex-col items-center gap-3">
            <Link
              className="inline-flex h-12 items-center justify-center rounded-full border border-stone-950 bg-white px-7 text-sm font-semibold text-stone-950 shadow-sm transition hover:bg-stone-100 focus:outline-none focus:ring-4 focus:ring-stone-200"
              href="/tools"
            >
              Get started
            </Link>
              <p className="text-sm font-medium text-stone-500">No sign-up needed</p>
            </div>
          </div>
        </div>

        <ToolsMarquee />
      </section>

      <section>
        <div className="relative aspect-[1912/821] w-full overflow-hidden bg-white">
          <div
            className="absolute inset-0 bg-white bg-no-repeat"
            style={{
              backgroundImage:
                "linear-gradient(180deg, rgba(255,255,255,0.88) 0%, rgba(255,255,255,0.58) 34%, rgba(255,255,255,0.08) 68%), url('/landing-page-image.png')",
              backgroundPosition: "center 58%",
              backgroundSize: "100% auto"
            }}
          />

          <div className="relative z-10 mx-auto flex h-full max-w-3xl px-5 py-8 text-center sm:px-8 sm:py-10 lg:px-12 lg:py-14">
            <div className="w-full">
            <h2 className="text-4xl font-semibold tracking-tight text-stone-950 sm:text-5xl">
              Accounting workspace
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-stone-600 sm:text-base">
              Tools that help you create, calculate, check, and understand business numbers
              faster.
            </p>
            <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                className="inline-flex h-11 items-center justify-center rounded-full bg-stone-950 px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-stone-800 focus:outline-none focus:ring-4 focus:ring-stone-300"
                href="/tools/invoice-generator"
              >
                Create invoice
              </Link>
              <Link
                className="inline-flex h-11 items-center justify-center rounded-full border border-stone-300 bg-white/40 px-6 text-sm font-semibold text-stone-950 transition hover:bg-white focus:outline-none focus:ring-4 focus:ring-stone-300"
                href="/tools"
              >
                Explore tools
              </Link>
            </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#c8ff00] px-4 py-5 text-center text-sm font-medium text-stone-950 sm:px-6 sm:text-base lg:px-8">
        <p>
          New: PDF invoice generator with MYR support is now available.{" "}
          <Link
            className="font-bold underline decoration-stone-950/40 underline-offset-4 transition hover:decoration-stone-950"
            href="/tools/invoice-generator"
          >
            Try it today
          </Link>
          .
        </p>
      </section>
    </main>
  );
}
