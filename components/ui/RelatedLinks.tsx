import Link from "next/link";
export type RelatedLink = {
  title: string;
  description: string;
  href: string;
};

type RelatedLinksProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  links: RelatedLink[];
};

export function RelatedLinks({
  eyebrow = "Related resources",
  title,
  description,
  links
}: RelatedLinksProps) {
  return (
    <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
      <p className="text-sm font-medium tracking-wide text-slate-500">{eyebrow}</p>
      <h2 className="mt-3 text-2xl font-semibold tracking-tight text-stone-950">
        {title}
      </h2>
      {description ? (
        <p className="mt-4 max-w-3xl text-sm leading-6 text-stone-600 sm:text-base">
          {description}
        </p>
      ) : null}
      <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {links.map((link) => (
          <Link
            className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-200 hover:shadow-md"
            href={link.href}
            key={link.href}
          >
            <h3 className="text-base font-semibold text-stone-950">{link.title}</h3>
            <p className="mt-3 text-sm leading-6 text-stone-600">{link.description}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
