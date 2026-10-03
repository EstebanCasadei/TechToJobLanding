import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { CommunityAvatar } from "@/components/community-avatar";

const talentPoints = ["human", "junior", "free"] as const;
const companyPoints = ["seeWork", "context", "active"] as const;

function MessageHeader({ name, meta }: Readonly<{ name: string; meta: string }>) {
  return (
    <div className="flex items-center gap-3">
      <CommunityAvatar name={name} size={46} className="size-12 shrink-0" />
      <div>
        <p className="text-sm font-bold text-white">{name}</p>
        <p className="text-xs text-discord-muted">{meta}</p>
      </div>
    </div>
  );
}

export async function TalentSection() {
  const t = await getTranslations();

  return (
    <section id="talent" className="side relative scroll-mt-24 overflow-hidden bg-ink px-[var(--page-gutter)] py-[clamp(5rem,10vw,9rem)]" aria-labelledby="talent-heading">
      <div className="mx-auto grid max-w-[80rem] items-center gap-14 min-[64rem]:grid-cols-[.8fr_1.2fr]">
        <div>
          <h2 id="talent-heading" className="max-w-[12ch] text-balance font-bold leading-[.95] tracking-[-.035em]">{t("talent.title")}</h2>
          <p className="mt-6 max-w-[48ch] text-lg leading-relaxed text-white/72">{t("talent.intro")}</p>
          <ul className="mt-8 grid gap-3">
            {talentPoints.map((key) => <li key={key} className="flex items-center gap-3 text-sm font-bold"><span className="size-2.5 rounded-full bg-primary" />{t(`talent.points.${key}`)}</li>)}
          </ul>
        </div>

        <div className="relative mx-auto w-full max-w-[43rem] pb-14 pt-8">
          <div className="discord-window relative z-20 rounded-2xl bg-discord-chat p-5 text-discord-text shadow-card min-[36rem]:p-7">
            <p className="mb-5 text-xs font-bold text-primary">{t("talent.channel")}</p>
            <MessageHeader name={t("profile.name")} meta={t("talent.card.time")} />
            <div className="mt-5 rounded-xl bg-discord-embed p-5">
              <p className="font-bold text-white">{t("profile.role")}</p>
              <dl className="mt-4 grid gap-4 min-[32rem]:grid-cols-3">
                {(["stack", "level", "availability"] as const).map((key) => (
                  <div key={key}>
                    <dt className="text-xs font-bold text-discord-muted">{t(`talent.card.fields.${key}`)}</dt>
                    <dd className="mt-1 text-sm">{t(`talent.card.values.${key}`)}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
          <div className="scene-card absolute bottom-0 right-2 z-30 w-[78%] rotate-[2deg] rounded-2xl bg-primary p-4 text-ink shadow-card min-[36rem]:right-[-4%] min-[36rem]:w-[64%]">
            <p className="text-sm font-bold">TechToJob · {t("talent.card.replyTime")}</p>
            <p className="mt-1 text-sm">{t("talent.points.human")}</p>
          </div>
          <CommunityAvatar name="Frontend learner" size={80} className="floating-avatar absolute -left-4 bottom-2 z-40 size-20 rotate-[-8deg] drop-shadow-xl" />
        </div>
      </div>
    </section>
  );
}

export async function CompaniesSection() {
  const t = await getTranslations();

  return (
    <section id="companies" className="side relative scroll-mt-24 overflow-hidden bg-primary px-[var(--page-gutter)] py-[clamp(5rem,10vw,9rem)] text-ink" aria-labelledby="companies-heading">
      <div className="mx-auto grid max-w-[80rem] items-center gap-14 min-[64rem]:grid-cols-[1.15fr_.85fr]">
        <div className="relative order-2 mx-auto w-full max-w-[43rem] pb-12 min-[64rem]:order-1">
          <div className="discord-window relative z-20 rounded-2xl bg-discord-chat p-5 text-discord-text shadow-card min-[36rem]:p-7">
            <p className="mb-5 text-xs font-bold text-primary">{t("companies.channel")}</p>
            <MessageHeader name={t("companies.card.author")} meta={t("companies.card.time")} />
            <div className="mt-5 rounded-xl bg-discord-embed p-5">
              <p className="font-bold text-white">{t("companies.card.want")}</p>
              <ul className="mt-4 grid gap-3">
                {(["tournaments", "projects", "known"] as const).map((key) => <li key={key} className="flex gap-2 border-t border-white/10 pt-3 text-sm"><Image src="/images/check.svg" alt="" width={18} height={21} className="h-5 w-auto" />{t(`companies.card.rows.${key}`)}</li>)}
              </ul>
            </div>
          </div>
          <div className="scene-card absolute -bottom-1 left-[4%] z-30 w-[78%] -rotate-[2deg] rounded-2xl border border-white/20 bg-slate p-4 text-white shadow-card min-[36rem]:left-[-5%] min-[36rem]:w-[62%]">
            <p className="text-sm font-bold">TechToJob · {t("companies.card.replyTime")}</p>
            <p className="mt-1 text-sm">{t("companies.points.context")}</p>
          </div>
          <CommunityAvatar name="Hiring team" size={84} className="floating-avatar absolute -right-4 bottom-0 z-40 size-20 rotate-[7deg] drop-shadow-xl" />
        </div>
        <div className="order-1 min-[64rem]:order-2">
          <h2 id="companies-heading" className="max-w-[12ch] text-balance font-bold leading-[.95] tracking-[-.035em]">{t("companies.title")}</h2>
          <p className="mt-6 max-w-[45ch] text-lg leading-relaxed text-ink/85">{t("companies.intro")}</p>
          <ul className="mt-8 grid gap-3">
            {companyPoints.map((key) => <li key={key} className="flex items-center gap-3 text-sm font-bold"><span className="size-2.5 rounded-full bg-ink" />{t(`companies.points.${key}`)}</li>)}
          </ul>
        </div>
      </div>
    </section>
  );
}
