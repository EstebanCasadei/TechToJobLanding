import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { AnimatedButtonLabel } from "@/components/animated-button-label";
import { CommunityAvatar } from "@/components/community-avatar";
import { site } from "@/lib/site";

const communityAreas = [
  { key: "support", mobile: "left-6 top-8 -rotate-[6deg]", desktop: "min-[28rem]:left-6 min-[28rem]:top-6 min-[28rem]:-rotate-[6deg]" },
  { key: "development", mobile: "left-1/2 top-7 -translate-x-1/2 rotate-[1deg]", desktop: "min-[28rem]:left-1/2 min-[28rem]:top-5 min-[28rem]:-translate-x-1/2 min-[28rem]:rotate-[1deg]" },
  { key: "data", mobile: "right-0 top-16 rotate-[8deg]", desktop: "min-[28rem]:right-2 min-[28rem]:top-16 min-[28rem]:rotate-[8deg]" },
  { key: "security", mobile: "left-8 bottom-7 -rotate-[2deg]", desktop: "min-[28rem]:left-16 min-[28rem]:bottom-6 min-[28rem]:-rotate-[2deg]" },
  { key: "product", mobile: "right-8 bottom-7 rotate-[2deg]", desktop: "min-[28rem]:right-12 min-[28rem]:bottom-5 min-[28rem]:rotate-[2deg]" },
] as const;

const communityArrows = [
  ["/images/arrow1.svg", "left-[14%] top-[3.4rem]", 22, 24],
  ["/images/arrow2.svg", "left-[50%] top-[3rem]", 17, 30],
  ["/images/arrow3.svg", "right-[14%] top-[3rem]", 56, 32],
  ["/images/arrow4.svg", "bottom-[3rem] left-[18%]", 20, 23],
  ["/images/arrow-product.svg", "bottom-[3rem] right-[20%]", 20, 29],
] as const;

export async function Hero() {
  const t = await getTranslations();

  return (
    <section id="top" className="relative isolate -mt-[4.25rem] min-h-[calc(100svh-4rem+4.25rem)] [background:radial-gradient(circle_at_78%_24%,rgba(132,192,191,.18),transparent_31rem),linear-gradient(180deg,#2f3436_0%,#292e30_100%)] overflow-hidden px-[max(var(--page-gutter),calc((100%_-_80rem)/2))] pb-20 pt-[calc(4.25rem+3rem)] min-[50rem]:-mt-[5.25rem] min-[50rem]:min-h-[calc(100svh-4rem+5.25rem)] min-[50rem]:pt-[calc(5.25rem+3rem)] min-[64rem]:grid min-[64rem]:grid-cols-[minmax(0,1.02fr)_minmax(32rem,.98fr)] min-[64rem]:items-center min-[64rem]:gap-8 min-[64rem]:pb-28 min-[64rem]:pt-[calc(5.25rem+4rem)]" aria-labelledby="hero-heading">
      <div className="absolute left-[56%] top-[42%] -z-10 hidden size-[min(70vw,60rem)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/8 before:absolute before:inset-[10%] before:rounded-full before:border before:border-white/7 before:content-[''] after:absolute after:inset-[24%] after:rounded-full after:border after:border-white/7 after:content-[''] min-[64rem]:block" aria-hidden="true" />
      <div className="relative z-10 mx-auto max-w-[48rem] text-center min-[64rem]:mx-0 min-[64rem]:text-left">
        <h1 id="hero-heading" className="mx-auto max-w-[12ch] whitespace-pre-line text-balance font-bold leading-[.93] tracking-[-.04em] min-[64rem]:mx-0">{t("hero.title")}</h1>
        <p className="mx-auto mt-5 max-w-[19ch] text-balance text-[clamp(1.6rem,3vw,3rem)] font-bold leading-[1.03] text-primary min-[64rem]:mx-0">{t("hero.tagline")}</p>
        <div className="mx-auto mt-7 max-w-[62ch] text-base leading-relaxed min-[64rem]:mx-0">
          <p className="font-bold text-white">{t("hero.lead")}</p>
          <p className="text-white/72">{t("hero.description")}</p>
          <p className="text-white/72">{t("hero.context")}</p>
        </div>
        <div className="relative mx-auto mt-7 h-60 w-full max-w-[35rem] min-[64rem]:mx-0">
          <p className="sr-only">{t("hero.activity.status")}</p>
          <div className="absolute left-1/2 top-1/2 -z-10 size-[min(110vw,36rem)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/8 before:absolute before:inset-[10%] before:rounded-full before:border before:border-white/7 before:content-[''] after:absolute after:inset-[24%] after:rounded-full after:border after:border-white/7 after:content-[''] min-[64rem]:hidden" aria-hidden="true" />
          {communityAreas.map((area) => (
            <span key={area.key} className={`absolute z-20 text-[.65rem] font-bold text-white min-[28rem]:text-xs ${area.mobile} ${area.desktop}`}>
              <span className="relative">
                {area.key === "development" ? (
                  <Image src="/images/circle_highlight.svg" alt="" width={134} height={52} className="absolute left-1/2 top-1/2 w-28 max-w-none -translate-x-1/2 -translate-y-1/2 -rotate-2" />
                ) : null}
                <span className="relative">{t(`community.areas.${area.key}`)}</span>
              </span>
            </span>
          ))}
          {communityArrows.map(([src, position, width, height]) => <Image key={src} src={src} alt="" width={width} height={height} className={`absolute z-10 h-auto scale-[.65] min-[28rem]:scale-100 ${position}`} />)}
          <a className="group/action absolute left-1/2 top-1/2 grid min-h-16 w-[min(100%,28rem)] -translate-x-1/2 -translate-y-1/2 grid-cols-[auto_1fr_auto] items-center gap-3 overflow-hidden rounded-2xl bg-primary px-4 text-sm font-bold text-ink shadow-[0_16px_45px_rgb(0_0_0/30%)] min-[28rem]:px-6 min-[28rem]:text-base" href={site.discord} aria-label={t("community.joinFull")}>
            <Image src="/images/discord-dark.svg" alt="" width={22} height={22} loading="eager" />
            <AnimatedButtonLabel text={t("community.join")} className="justify-self-center" />
            {" "}
            <span>{t("community.members")}</span>
          </a>
        </div>
      </div>

      <div className="relative mx-auto mt-16 min-h-[31rem] w-full max-w-[39rem] min-[64rem]:mt-0">
        <p className="sr-only">{t("hero.activity.status")}</p>
        <div className="scene-card absolute left-[3%] top-[4%] z-20 w-[72%] -rotate-[4deg] rounded-2xl bg-white p-5 text-ink shadow-card">
          <div className="flex items-center gap-3">
            <CommunityAvatar name="Alex R frontend" size={52} className="size-13 shrink-0" />
            <div>
              <p className="text-sm font-bold">{t("profile.name")}</p>
              <p className="text-xs text-ink/80">{t("profile.role")}</p>
            </div>
            <span className="ml-auto size-2.5 rounded-full bg-primary" aria-hidden="true" />
          </div>
          <div className="mt-5 grid gap-2 text-sm">
            <p className="rounded-xl bg-ink/6 px-3 py-2">React · TypeScript · Next.js</p>
            <p className="rounded-xl bg-primary/30 px-3 py-2 font-bold">{t("profile.strengths.project")}</p>
          </div>
        </div>

        <div className="scene-card absolute right-[1%] top-[29%] z-30 w-[76%] rotate-[3deg] rounded-2xl bg-discord-chat p-4 text-discord-text shadow-card">
          <p className="mb-4 text-xs font-bold text-primary">{t("hero.activity.channel")}</p>
          <div className="flex gap-3">
            <CommunityAvatar name="Marina codes" size={42} className="size-11 shrink-0" />
            <div>
              <p className="text-sm font-bold text-white">{t("hero.activity.author")} <span className="ml-1 text-[.65rem] font-normal text-discord-muted">{t("hero.activity.time")}</span></p>
              <p className="mt-1 text-sm leading-relaxed">{t("hero.activity.message")}</p>
            </div>
          </div>
          <div className="ml-9 mt-4 flex gap-3 rounded-xl bg-discord-embed p-3">
            <CommunityAvatar name="Noa helps" size={34} className="size-9 shrink-0" />
            <p className="text-sm leading-relaxed"><strong className="text-white">{t("hero.activity.replier")}</strong><br />{t("hero.activity.reply")}</p>
          </div>
        </div>

        <div className="scene-card absolute bottom-[3%] left-[8%] z-10 w-[68%] -rotate-[2deg] rounded-2xl bg-postit p-5 text-ink shadow-card">
          <p className="text-xs font-bold uppercase tracking-[.16em]">{t("hero.activity.pullRequest")}</p>
          <div className="mt-4 space-y-2" aria-hidden="true">
            <span className="block h-2 w-4/5 rounded-full bg-ink/75" />
            <span className="block h-2 w-3/5 rounded-full bg-ink/35" />
            <span className="block h-2 w-2/3 rounded-full bg-primary" />
          </div>
          <div className="mt-5 flex -space-x-2">
            {['Ana review', 'Leo dev', 'Cris product'].map((name) => <CommunityAvatar key={name} name={name} size={34} className="size-9 rounded-full ring-2 ring-transparent" />)}
            <span className="flex size-9 items-center justify-center rounded-full bg-ink text-xs font-bold text-white ring-2 ring-transparent">+8</span>
          </div>
        </div>

      </div>
    </section>
  );
}
