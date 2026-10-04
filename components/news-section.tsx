import Image from "next/image";
import { getTranslations } from "next-intl/server";
import type { NewsItem } from "@/lib/news";

export async function NewsSection() {
  const t = await getTranslations();
  const items = t.raw("news.items") as NewsItem[];

  return (
    <section className="bg-slate section-grid px-[var(--page-gutter)] py-[clamp(5rem,10vw,9rem)] text-white" aria-labelledby="news-heading">
      <div className="mx-auto max-w-[80rem]">
        <h2 id="news-heading" className="font-bold tracking-[-.035em]">{t("news.title")}</h2>
        <div className="mt-12 grid gap-6 min-[60rem]:grid-cols-[1.15fr_1fr] min-[60rem]:grid-rows-2">
          {items.map((item, index) => (
            <article key={item.title} className={`flex min-w-0 flex-col overflow-hidden rounded-2xl border border-ink/15 bg-white text-ink ${index === 0 ? "min-[60rem]:row-span-2" : ""}`}>
              {index === 0 && item.image && (
                <Image
                  src={item.image.src}
                  alt={item.image.alt}
                  width={item.image.width}
                  height={item.image.height}
                  sizes="(min-width: 1440px) 675px, (min-width: 960px) 54vw, 100vw"
                  className="aspect-[1200/630] w-full object-cover"
                />
              )}
              <div className="flex flex-1 flex-col p-6 min-[40rem]:p-8">
                <div className="flex flex-wrap items-center justify-between">
                  <span className="rounded-full bg-primary px-3 py-1 text-xs font-bold text-ink">{item.category}</span>
                  <time className="mr-full text-xs text-ink/75" dateTime={item.date}>{item.dateLabel}</time>
                </div>
                <h3 className={`mt-5 text-balance font-bold leading-tight tracking-[-.025em] ${index === 0 ? "text-[clamp(1.5rem,2.6vw,2.25rem)]" : "text-[clamp(1.25rem,2vw,1.65rem)]"}`}>{item.title}</h3>
                <p className="mt-4 max-w-[65ch] text-sm leading-relaxed text-ink/80">{item.summary}</p>
                <ul className="mt-auto flex flex-wrap gap-x-5 gap-y-2 pt-5">
                  {item.links.map((link) => (
                    <li key={link.url} className="min-w-0">
                      <a href={link.url} className="inline-flex min-h-11 items-center gap-2 text-sm font-bold text-ink underline decoration-primary decoration-2 underline-offset-4 [overflow-wrap:anywhere]">
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
