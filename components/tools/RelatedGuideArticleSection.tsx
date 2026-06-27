import Link from "next/link";

export type RelatedGuideArticle = {
  description: string;
  href: string;
  label: string;
  title: string;
};

export function RelatedGuideArticleSection({
  articles,
  toolName
}: {
  articles: RelatedGuideArticle[];
  toolName: string;
}) {
  if (articles.length === 0) {
    return null;
  }

  return (
    <section className="border-t border-stone-200 pt-8">
      <h2 className="text-2xl font-semibold tracking-tight text-stone-950">
        {toolName} Related Guide Article{articles.length > 1 ? "s" : ""}
      </h2>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {articles.map((article) => (
          <Link
            className="group flex min-h-[220px] flex-col rounded-2xl border border-stone-200 bg-[#f5f5f5] p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
            href={article.href}
            key={article.href}
          >
            <p className="text-sm font-medium tracking-wide text-slate-500">{article.label}</p>
            <h3 className="mt-3 text-xl font-semibold tracking-tight text-stone-950">
              {article.title}
            </h3>
            <p className="mt-4 flex-1 text-sm leading-6 text-stone-600 sm:text-base">
              {article.description}
            </p>
            <span className="mt-5 inline-flex text-sm font-semibold text-slate-700 group-hover:text-slate-950">
              Read guide -&gt;
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
