import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { AnimatedButtonLabel, fillButtonClasses } from "@/components/animated-button-label";
import { CommunityAvatar } from "@/components/community-avatar";
import { LazyCommunityWall } from "@/components/lazy-community-wall";
import { site } from "@/lib/site";
import { NewsletterAvatar } from "@/components/newsletter-avatar";
import { NewsLink } from "@/components/news-link";
import { SocialIcon, type SocialNetwork } from "@/components/social-icon";

type Testimonial = { name: string; role: string; quote: string; photoUrl?: string; profileUrl?: string };

const channelKeys = ["development", "networking", "jobs", "forum"] as const;

export async function NetworkingSection() {
  const t = await getTranslations("networking");

  return (
    <section id="networking" className="relative scroll-mt-24 overflow-hidden bg-slate section-grid px-[var(--page-gutter)] py-[clamp(5rem,10vw,9rem)] text-white" aria-labelledby="networking-heading">
      <div className="mx-auto grid max-w-[80rem] gap-16 min-[62rem]:grid-cols-[.8fr_1.2fr] min-[62rem]:items-center">
        <div>
          <h2 id="networking-heading" className="max-w-[13ch] text-balance font-bold tracking-[-.035em]">{t("title")}</h2>
          <p className="mt-6 max-w-[48ch] text-lg leading-relaxed text-white/80">{t("intro")}</p>
          <div className="mt-8 flex flex-wrap gap-2">
            {channelKeys.map((key) => <span key={key} className="rounded-full bg-primary px-4 py-2 text-xs font-bold text-ink">{t(`channels.${key}`)}</span>)}
          </div>
        </div>

        <div className="relative mx-auto min-h-[34rem] w-full max-w-[43rem]">
          <div className="absolute left-[10%] top-[18%] h-[62%] w-[78%] origin-center rotate-[8deg] animate-orbit rounded-[50%] border-2 border-dashed border-primary" aria-hidden="true" />
          <div className="scene-card absolute left-[3%] top-[5%] z-20 w-[75%] -rotate-[2deg] rounded-2xl bg-ink p-5 text-white shadow-card">
            <div className="flex gap-3"><CommunityAvatar name="Question person" size={44} className="size-11 shrink-0" /><p className="text-sm leading-relaxed"><strong>{t("messages.authors.question")}</strong><br />{t("messages.question")}</p></div>
          </div>
          <div className="scene-card absolute right-[1%] top-[36%] z-30 w-[73%] rotate-[2deg] rounded-2xl bg-primary p-5 text-ink shadow-card">
            <div className="flex gap-3"><CommunityAvatar name="Answerperson2" size={44} className="size-11 shrink-0" /><p className="text-sm leading-relaxed"><strong>{t("messages.authors.answer")}</strong><br />{t("messages.answer")}</p></div>
          </div>
          <div className="scene-card absolute bottom-[3%] left-[8%] z-20 w-[82%] -rotate-[1deg] rounded-2xl bg-postit p-5 text-ink shadow-card">
            <div className="flex gap-3"><CommunityAvatar name="Opportunity person" size={44} className="size-11 shrink-0" /><p className="text-sm leading-relaxed"><strong>{t("messages.authors.opportunity")}</strong><br />{t("messages.opportunity")}</p></div>
          </div>
          {['frontend node', 'data node', 'security node'].map((name, index) => <CommunityAvatar key={name} name={name} size={62} className={`floating-avatar absolute z-40 size-16 drop-shadow-xl ${index === 0 ? "right-[8%] top-[5%]" : index === 1 ? "left-[1%] top-[44%]" : "right-[3%] bottom-[2%]"}`} />)}
        </div>
      </div>
    </section>
  );
}

export async function TestimonialsSection() {
  const t = await getTranslations();
  const items = t.raw("testimonials.items") as Testimonial[];

  return (
    <section className="overflow-hidden bg-ink py-[clamp(5rem,10vw,9rem)] text-white" aria-labelledby="testimonials-heading">
      <div className="px-[var(--page-gutter)]">
        <h2 id="testimonials-heading" className="mx-auto max-w-[80rem] text-balance font-bold tracking-[-.035em]">{t("testimonials.title")}</h2>
      </div>
      <div className="mt-14 pl-[var(--page-gutter)]">
        <div className="flex w-max animate-marquee pb-8 hover:[animation-play-state:paused] focus-within:[animation-play-state:paused] motion-reduce:animate-none">
          {[0, 1, 2].map((copy) => (
            <div key={copy} className="flex gap-5 pr-5" aria-hidden={copy > 0 || undefined}>
              {items.map((item, index) => (
                <article key={item.name} className={`w-[min(82vw,25rem)] shrink-0 rounded-2xl bg-white p-6 text-ink shadow-[0_20px_55px_rgb(47_52_54/14%)] ${index % 2 ? "rotate-[1deg]" : "-rotate-[1deg]"}`}>
                  <div className="flex items-center gap-3">
                    {item.photoUrl
                      ? <Image src={item.photoUrl} alt="" width={52} height={52} className="size-13 shrink-0 rounded-full object-cover" />
                      : <CommunityAvatar name={item.name} size={52} className="size-13 shrink-0" />}
                    <div>
                      <h3 className="text-base font-bold">
                        {item.profileUrl
                          ? <a href={item.profileUrl} className="underline-offset-4 hover:underline" aria-label={`${t("testimonials.profileLabel")} ${item.name}`} tabIndex={copy > 0 ? -1 : undefined}>{item.name}</a>
                          : item.name}
                      </h3>
                      <p className="text-sm text-ink/75">{item.role}</p>
                    </div>
                  </div>
                  <blockquote className="mt-7 text-lg font-bold leading-relaxed">“{item.quote}”</blockquote>
                </article>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export async function NewsletterSection() {
  const t = await getTranslations("newsletter");

  return (
    <section id="newsletter" className="bg-primary px-[var(--page-gutter)] py-[clamp(4rem,8vw,7rem)] text-ink" aria-labelledby="newsletter-heading">
      <div className="mx-auto grid max-w-[80rem] gap-10 min-[58rem]:grid-cols-[1fr_1fr] min-[58rem]:items-end">
        <div><h2 id="newsletter-heading" className="max-w-[13ch] text-balance font-bold tracking-[-.035em]">{t("title")}</h2><p className="mt-5 max-w-[52ch] text-lg leading-relaxed text-ink/85">{t("description")}</p></div>
        <NewsletterAvatar>
          <form action="#newsletter" className="relative rounded-2xl bg-ink p-5 text-white shadow-card min-[36rem]:p-7">
            <label className="text-sm font-bold" htmlFor="newsletter-email">{t("label")}</label>
            <div className="mt-3 grid gap-3 min-[36rem]:grid-cols-[1fr_auto]">
              <input id="newsletter-email" name="email" type="email" autoComplete="email" required placeholder={t("placeholder")} className="min-h-13 min-w-0 rounded-xl bg-white px-4 text-base text-ink placeholder:text-ink/50" />
              <button type="submit" className={`${fillButtonClasses} min-h-13 cursor-pointer rounded-xl bg-primary px-5 text-sm font-bold text-ink before:bg-white hover:text-ink`}><AnimatedButtonLabel text={t("button")} variant="fill" /></button>
            </div>
            <p className="mt-3 text-xs text-white/70">{t("note")}</p>
          </form>
        </NewsletterAvatar>
      </div>
    </section>
  );
}

export async function ClosingSection() {
  const t = await getTranslations("closing");
  const members = t.raw("members") as string[];

  return (
    <section className="relative isolate overflow-hidden bg-ink px-[var(--page-gutter)] py-[clamp(6rem,12vw,11rem)]" aria-labelledby="closing-heading">
      <Image src="/images/brand-mark-outline.svg" alt="" width={880} height={880} className="absolute left-1/2 top-1/2 -z-10 w-[min(90vw,55rem)] -translate-x-1/2 -translate-y-1/2 opacity-[.02]" />
      <div className="mx-auto max-w-[80rem] text-center">
        <h2 id="closing-heading" className="text-balance font-bold tracking-[-.04em]">{t("title")}</h2>
        <p className="mx-auto mt-7 max-w-[55ch] text-lg leading-relaxed text-white/70">{t("description")}</p>
        <div className="mt-12">
          <LazyCommunityWall
            members={members}
            hint={t("hint")}
            wallLabel={t("wallLabel")}
            spot={t.raw("spot") as { label: string; title: string; cta: string }}
            discord={site.discord}
          />
        </div>
        <a href={site.discord} className="group/action relative mt-10 inline-flex min-h-14 items-center gap-3 overflow-hidden rounded-full bg-primary px-7 text-base font-bold text-ink"><Image src="/images/discord-dark.svg" alt="" width={22} height={22} /><AnimatedButtonLabel text={t("button")} /></a>
      </div>
    </section>
  );
}

export async function SiteFooter() {
  const t = await getTranslations("footer");
  const links = [
    ["profiles", "#talent"], ["tournaments", "#tournaments"],
    ["search", "#companies"], ["networking", "#networking"],
  ] as const;
  const networks: ReadonlyArray<{ key: SocialNetwork; label: string; href: string }> = [
    { key: "discord", label: "Discord", href: site.discord },
    { key: "linkedin", label: "LinkedIn", href: site.linkedin },
    { key: "instagram", label: "Instagram", href: site.instagram },
    { key: "x", label: "X", href: site.x },
    { key: "tiktok", label: "TikTok", href: site.tiktok },
  ];

  return (
    <footer className="relative isolate overflow-hidden bg-ink px-[var(--page-gutter)] pt-16 pb-[calc(6rem+env(safe-area-inset-bottom))] min-[48rem]:pb-16 text-white">
      <div className="mx-auto max-w-[80rem] border-t border-primary/40 pt-12">
        <div className="grid gap-14 min-[60rem]:grid-cols-[1fr_1.1fr] min-[60rem]:gap-24">
          <div className="flex items-center">
            <Image src="/images/brand-logo.svg" alt="TechToJob" width={140} height={78} className="h-auto w-full max-w-[28rem]" />
          </div>
          <div className="grid gap-x-10 gap-y-9 min-[36rem]:grid-cols-2">
            <nav aria-labelledby="footer-explore-heading">
              <h2 id="footer-explore-heading" className="text-base font-bold text-primary">{t("explore")}</h2>
              <ul className="mt-4 grid gap-1">
                {links.map(([key, href]) => <li key={key}><NewsLink href={href} label={t(`links.${key}`)} className="text-white/85 hover:text-primary transition-colors" /></li>)}
              </ul>
            </nav>
            <div>
              <h2 className="text-base font-bold text-primary">{t("legal")}</h2>
              <ul className="mt-4 grid gap-1">
                <li><NewsLink href="/privacidad" label={t("privacy")} className="text-white/85 hover:text-primary transition-colors" /></li>
                <li><NewsLink href="/aviso-legal" label={t("legalNotice")} className="text-white/85 hover:text-primary transition-colors" /></li>
              </ul>
            </div>
            <div className="min-[36rem]:col-span-2 border-t border-white/15 pt-6">
              <h2 className="text-base font-bold text-primary">{t("community")}</h2>
              <ul className="mt-4 flex flex-wrap gap-3">
                {networks.map(({ key, label, href }) => (
                  <li key={key}><a href={href} aria-label={label} title={label} className="inline-flex size-12 items-center justify-center rounded-full border border-white/25 text-white transition-colors hover:bg-primary hover:text-ink"><SocialIcon network={key} /></a></li>
                ))}
              </ul>
              <p className="mt-6 text-xs text-white/70">© {new Date().getFullYear()} {t("rights")}</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
