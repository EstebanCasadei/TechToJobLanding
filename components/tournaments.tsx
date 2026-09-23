import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { CommunityAvatar } from "@/components/community-avatar";

const stages = ["brief", "building", "review", "shipping"] as const;
const benefits = ["learn", "showcase", "visibility"] as const;

export async function TournamentsSection() {
  const t = await getTranslations("tournaments");

  return (
    <section id="tournaments" className="relative scroll-mt-24 overflow-hidden bg-ink px-[var(--page-gutter)] py-[clamp(5rem,10vw,9rem)]" aria-labelledby="tournaments-heading">
      <div className="mx-auto max-w-[80rem]">
        <header className="grid gap-7 min-[60rem]:grid-cols-[1.2fr_.8fr] min-[60rem]:items-end">
          <h2 id="tournaments-heading" className="max-w-[13ch] text-balance font-bold leading-[.95] tracking-[-.035em]">{t("title")}</h2>
          <div>
            <p className="text-xl font-bold text-primary">{t("subtitle")}</p>
            <p className="mt-4 max-w-[54ch] leading-relaxed text-white/70">{t("lead")}</p>
          </div>
        </header>

        <div className="mt-16 grid gap-12 min-[64rem]:grid-cols-[1.18fr_.82fr] min-[64rem]:items-end">
          <div className="tournament-podium relative mx-auto min-h-[34rem] w-full max-w-[48rem]">
            <p className="absolute right-0 top-0 z-30 w-36 rotate-[4deg] text-right text-xs font-bold leading-tight text-primary min-[40rem]:w-40 min-[40rem]:text-sm min-[80rem]:w-48 min-[80rem]:text-base">{t("meta")}</p>
            <Image src="/images/arrow4.svg" alt="" width={20} height={23} className="absolute right-[16%] top-[3rem] z-20 h-6 w-auto rotate-[200deg] min-[40rem]:right-[20%] min-[40rem]:top-12 min-[40rem]:h-7 min-[80rem]:right-[22%] min-[80rem]:top-14" />

            <article data-swing-card className="absolute left-1/2 top-20 z-20 w-[min(76%,19rem)] -translate-x-1/2 -rotate-[2deg] rounded-2xl bg-white p-5 text-ink shadow-card min-[40rem]:top-16">
              <Image src="/images/pin.svg" alt="" width={32} height={36} data-swing-pin className="absolute -top-5 left-1/2 h-9 w-auto -translate-x-1/2" />
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs font-bold uppercase tracking-[.14em] text-ink/75">{t("winner")}</p>
                <span className="rounded-full bg-primary px-2.5 py-1 text-xs font-bold">#1</span>
              </div>
              <div className="mt-5 space-y-2" aria-hidden="true">
                <span className="block h-2.5 w-4/5 rounded-full bg-ink/80" />
                <span className="block h-2.5 w-3/5 rounded-full bg-ink/35" />
                <span className="block h-2 w-1/2 rounded-full bg-primary" />
              </div>
              <p className="mt-5 text-sm leading-relaxed text-ink/75">{t("winnerDescription")}</p>
            </article>

            <div className="absolute inset-x-0 bottom-14 flex items-end justify-center gap-[clamp(.6rem,2.5vw,1.25rem)]">
              <div className="podium-step relative h-36 w-[27%] max-w-44 rotate-[-1deg] rounded-t-2xl bg-white/8 shadow-card">
                <span className="absolute inset-0 flex items-center justify-center text-[clamp(2.5rem,6vw,4.5rem)] font-bold text-primary/70">2</span>
              </div>
              <div className="podium-step relative h-56 w-[32%] max-w-52 rotate-[.7deg] rounded-t-2xl bg-primary shadow-card">
                <span className="absolute inset-x-0 bottom-7 text-center text-[clamp(3.5rem,8vw,6rem)] font-bold leading-none text-ink">1</span>
              </div>
              <div className="podium-step relative h-28 w-[25%] max-w-40 rotate-[1.4deg] rounded-t-2xl bg-white/8 shadow-card">
                <span className="absolute inset-0 flex items-center justify-center text-[clamp(2rem,5vw,3.75rem)] font-bold text-primary/70">3</span>
              </div>
            </div>
            <div className="absolute inset-x-[4%] bottom-14 border-t-2 border-dashed border-white/25" aria-hidden="true" />
            <div className="absolute bottom-0 left-1/2 flex -translate-x-1/2 -space-x-2">
              {['Torneo participant one', 'Torneo participant two', 'Torneo jury', 'Torneo participant four'].map((name) => <CommunityAvatar key={name} name={name} size={46} className="size-12 rounded-full ring-2 ring-ink" />)}
            </div>
          </div>

          <aside data-swing-card className="relative rotate-[2deg] rounded-2xl bg-postit p-6 text-ink shadow-card min-[40rem]:p-8" aria-labelledby="tournament-process-heading">
            <Image src="/images/pin.svg" alt="" width={32} height={36} data-swing-pin className="absolute -top-5 left-8 h-9 w-auto" />
            <h3 id="tournament-process-heading" className="text-[clamp(1.6rem,3vw,2.4rem)] font-bold leading-none tracking-[-.03em]">{t("processTitle")}</h3>
            <ol className="mt-7 divide-y divide-ink/20 border-y border-ink/20">
              {stages.map((stage, index) => (
                <li key={stage} className="flex items-center gap-4 py-4">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-ink text-xs font-bold text-white">0{index + 1}</span>
                  <span className="font-bold">{t(`board.${stage}`)}</span>
                </li>
              ))}
            </ol>
            <p className="mt-6 text-sm font-bold text-ink/75">{t("jury")}</p>
          </aside>
        </div>

        <ul className="mt-10 flex flex-wrap justify-center gap-3 min-[64rem]:justify-start">
          {benefits.map((key, index) => <li key={key} className={`rounded-full border border-primary/50 px-5 py-3 text-sm font-bold text-primary ${index === 1 ? "rotate-[1deg]" : "-rotate-[.6deg]"}`}>{t(`benefits.${key}`)}</li>)}
        </ul>
      </div>
    </section>
  );
}
