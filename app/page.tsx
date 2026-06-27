import Image from "next/image";
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

const featuredTools = [
  {
    title: "Invoice Generator",
    subtitle: "Create professional invoices in seconds.",
    href: "/tools/invoice-generator",
    imageAlt: "Invoice Generator preview",
    imagePosition: "center",
    imageSrc: "/invoice-generator-tools-card-preview.png"
  },
  {
    title: "SST Calculator Malaysia",
    subtitle: "Calculate SST quickly and clearly.",
    href: "/tools/sst-calculator-malaysia",
    imageAlt: "SST Calculator Malaysia preview",
    imagePosition: "center",
    imageSrc: "/sst-calculator-tools-card-preview.png"
  },
  {
    title: "Trial Balance Calculator",
    subtitle: "Check debit and credit totals with ease.",
    href: "/tools/trial-balance-calculator",
    imageAlt: "Trial Balance Calculator preview",
    imagePosition: "center",
    imageSrc: "/trial-balance-calculator-tools-card-preview.png"
  }
] as const;

function ToolShowcaseCard({
  href,
  imageAlt,
  imagePosition,
  imageSrc,
  subtitle,
  title
}: {
  href: string;
  imageAlt: string;
  imagePosition: string;
  imageSrc: string;
  subtitle: string;
  title: string;
}) {
  return (
    <article className="group rounded-[2rem] border border-stone-200 bg-white p-3 shadow-sm shadow-stone-200/60 transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-stone-200/80">
      <Link
        aria-label={`Open ${title}`}
        className="block overflow-hidden rounded-[1.5rem] bg-stone-100 focus:outline-none focus:ring-4 focus:ring-stone-200"
        href={href}
      >
        <div className="relative aspect-[4/5] sm:aspect-[5/6] lg:aspect-[4/5]">
          <Image
            alt={imageAlt}
            className="object-cover transition duration-500 group-hover:scale-[1.04]"
            fill
            sizes="(min-width: 1024px) 390px, (min-width: 640px) 50vw, 100vw"
            src={imageSrc}
            style={{ objectPosition: imagePosition }}
          />
          <div className="absolute inset-x-0 bottom-0 h-[62%] bg-gradient-to-t from-slate-950/85 via-slate-950/45 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
            <p className="text-xs font-semibold uppercase text-teal-100">Tools</p>
            <h3 className="mt-2 text-2xl font-semibold leading-tight text-white">{title}</h3>
            <p className="mt-2 max-w-xs text-sm leading-6 text-white">{subtitle}</p>
          </div>
        </div>
      </Link>
    </article>
  );
}

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-hidden bg-white text-stone-950">
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

      <section className="relative z-10 pb-10 pt-14 sm:pb-14 sm:pt-16 lg:pb-16 lg:pt-20">
        <div className="mx-auto max-w-[1240px] px-3 sm:px-5 lg:px-6">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase text-teal-700">Featured tools</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-stone-950 sm:text-4xl">
              Start with the tools people use most
            </h2>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {featuredTools.map((tool) => (
              <ToolShowcaseCard key={tool.href} {...tool} />
            ))}
          </div>
        </div>
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
        <div className="absolute inset-x-0 bottom-0 z-[1] h-28 bg-gradient-to-t from-white via-white/20 to-transparent" />

        <div className="pointer-events-auto relative z-10 mx-auto max-w-[1080px] px-4 sm:px-6 lg:px-8">
          <div
            className="mx-auto flex max-w-3xl justify-center rounded-[2rem] border border-white/70 bg-white/72 px-5 py-8 text-center shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-[6px] sm:px-8 sm:py-10 lg:px-12 lg:py-14"
          >
            <EmailSignup />
          </div>
        </div>
      </section>

      <section className="px-4 py-5 text-center text-sm font-medium text-stone-950 sm:px-6 sm:text-base lg:px-8">
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
