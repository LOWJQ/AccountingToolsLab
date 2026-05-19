import Link from "next/link";
import { EmailSignup } from "@/components/home/EmailSignup";
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
    <main
      className="min-h-screen overflow-hidden text-stone-950"
      style={{
        background:
          "radial-gradient(circle at 50% 18%, rgba(220,245,238,0.5), transparent 34%), linear-gradient(180deg, #F8FAFC 0%, #FFFFFF 42%, #F6F8FB 100%)"
      }}
    >
      <JsonLd data={createWebsiteSchema()} />
      <JsonLd data={createOrganizationSchema()} />

      <section className="relative z-10 pb-2 pt-20 text-center sm:pb-4 sm:pt-24 lg:pb-6 lg:pt-28">
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

      <section className="pointer-events-none relative z-0 -mt-6 flex min-h-[460px] items-center overflow-hidden py-8 sm:-mt-8 sm:min-h-[500px] sm:py-10 lg:-mt-10 lg:min-h-[540px] lg:py-12">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 z-0 h-full bg-no-repeat"
          style={{
            backgroundImage: "url('/landing-page-image.png')",
            backgroundPosition: "center center",
            backgroundSize: "100% auto",
            transform: "translateY(48px)"
          }}
        />
        <div className="absolute inset-x-0 top-0 z-[1] h-24 bg-gradient-to-b from-white via-white/80 to-transparent sm:h-28" />
        <div className="absolute inset-0 z-[1] bg-gradient-to-b from-white/55 via-white/15 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 z-[1] h-28 bg-gradient-to-t from-[#f6f8fb] via-white/20 to-transparent" />

        <div className="pointer-events-auto relative z-10 mx-auto max-w-[1080px] px-4 sm:px-6 lg:px-8">
          <div
            className="mx-auto flex max-w-3xl justify-center rounded-[2rem] border border-white/70 bg-white/72 px-5 py-8 text-center shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-[6px] sm:px-8 sm:py-10 lg:px-12 lg:py-14"
          >
            <EmailSignup />
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
