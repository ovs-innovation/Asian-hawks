import { DEMO_BLOGS } from "@/lib/demo-data";

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = DEMO_BLOGS.find((b) => b.slug === slug) || DEMO_BLOGS[0];
  return (
    <article className="px-6 py-16">
      <div className="mx-auto max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">{article.category}</p>
        <h1 className="mt-3 text-4xl font-bold">{article.title}</h1>
        <p className="mt-3 text-sm text-slate-500">{article.author}</p>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={article.coverImage} alt="" className="mt-8 h-80 w-full rounded-[14px] object-cover" />
        <p className="mt-8 text-lg leading-8 text-slate-600 dark:text-slate-300">{article.content}</p>
      </div>
    </article>
  );
}
