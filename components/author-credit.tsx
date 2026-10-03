import { getTranslations } from "next-intl/server";
import { author } from "@/lib/site";

export async function AuthorCredit() {
  const t = await getTranslations("authorCredit");

  return (
    <a
      href={author.linkedin}
      className="fixed bottom-[max(0.75rem,env(safe-area-inset-bottom))] right-[max(0.75rem,env(safe-area-inset-right))] z-40 flex min-h-11 max-w-[calc(100vw-1.5rem)] flex-wrap items-center justify-center gap-x-1 rounded-lg border border-white/20 bg-ink px-3 py-2 text-xs leading-relaxed text-white shadow-sm focus-visible:outline-primary sm:bottom-[max(1rem,env(safe-area-inset-bottom))] sm:right-[max(1rem,env(safe-area-inset-right))]"
    >
      <span>{t("label")}</span>
      <span className="font-bold underline decoration-primary underline-offset-4">
        {author.name}
      </span>
    </a>
  );
}
