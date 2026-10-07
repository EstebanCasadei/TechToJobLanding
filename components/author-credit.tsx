import { getTranslations } from "next-intl/server";
import { author } from "@/lib/site";
import { NewsLink } from "@/components/news-link";
import { CommunityAvatar } from "@/components/community-avatar";
import Image from "next/image";
import { AuthorCardStack } from "@/components/author-card-stack";

export async function AuthorCredit() {
  const t = await getTranslations("authorCredit");
  const profile = await getTranslations("profile");

  return (
    <AuthorCardStack>
      <Image src="/images/asterisk.svg" alt="" width={48} height={48} className="absolute right-[9%] top-0 size-10 -rotate-12 min-[36rem]:size-14" />

      <article className="author-card author-card-profile relative z-20 w-[88%] -rotate-[4deg] rounded-2xl bg-white p-5 text-ink shadow-card min-[36rem]:w-[80%]">
        <div className="flex items-center gap-3">
          <CommunityAvatar name="Esteban Casadei 18" size={52} className="size-13 shrink-0" />
          <div className="min-w-0">
            <h2 id="author-heading" className="text-base font-bold leading-snug">{author.name}</h2>
            <p className="mt-1 text-xs text-ink/80">{profile("role")}</p>
          </div>
          <span className="ml-auto size-2.5 shrink-0 rounded-full bg-primary" aria-hidden="true" />
        </div>
        <div className="mt-5 grid gap-2 text-sm">
          <p className="rounded-xl bg-primary/30 px-3 py-2 font-bold">{t("createdBy")}</p>
          <p className="rounded-xl bg-ink/6 px-3 py-2 text-ink/75">{t("creativeNote")}</p>
        </div>
      </article>

      <div className="author-card author-card-message relative z-30 -mt-8 w-[90%] self-end rotate-[3deg] rounded-2xl bg-discord-chat p-4 text-discord-text shadow-card min-[36rem]:w-[82%]">
        <p className="mb-4 text-xs font-bold text-primary">{t("channel")}</p>
        <div className="flex gap-3">
          <CommunityAvatar name="TechToJob 7" size={42} className="size-11 shrink-0" />
          <div className="min-w-0">
            <p className="text-sm font-bold text-white">TechToJob</p>
            <p className="mt-1 text-sm leading-relaxed">{t("recognition")}</p>
          </div>
        </div>
        <div className="ml-9 mt-4 flex gap-3 rounded-xl bg-discord-embed p-3">
          <CommunityAvatar name="Esteban Casadei 18" size={34} className="size-9 shrink-0" />
          <div className="min-w-0">
            <p className="text-sm font-bold text-white">{author.name}</p>
            <NewsLink href={author.linkedin} label={t("profile")} className="text-primary" />
          </div>
        </div>
      </div>

      <div className="author-card author-card-project relative z-10 -mt-12 ml-[5%] w-[78%] -rotate-[2deg] rounded-2xl bg-postit p-5 text-ink shadow-card min-[36rem]:w-[70%]">
        <p className="text-xs font-bold uppercase tracking-[.16em]">{t("projectLabel")}</p>
        <div className="mt-4 space-y-2" aria-hidden="true">
          <span className="block h-2 w-4/5 rounded-full bg-ink/75" />
          <span className="block h-2 w-3/5 rounded-full bg-ink/35" />
          <span className="block h-2 w-2/3 rounded-full bg-primary" />
        </div>
        <div className="mt-5 flex -space-x-2" aria-hidden="true">
          {['Ana review', 'Leo dev', 'Cris product'].map((name) => <CommunityAvatar key={name} name={name} size={34} className="size-9 rounded-full ring-2 ring-transparent" />)}
          <span className="flex size-9 items-center justify-center rounded-full bg-ink text-xs font-bold text-white ring-2 ring-transparent">+8</span>
        </div>
      </div>
    </AuthorCardStack>
  );
}
