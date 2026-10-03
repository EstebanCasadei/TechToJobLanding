import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { AnimatedButtonLabel } from "@/components/animated-button-label";
import { HeaderShell } from "@/components/header-shell";
import { MobileMenu } from "@/components/mobile-menu";
import { site } from "@/lib/site";

const navigation = [
  ["howItWorks", "#how-it-works"],
  ["talent", "#talent"],
  ["tournaments", "#tournaments"],
  ["networking", "#networking"],
  ["companies", "#companies"],
] as const;

type Translate = Awaited<ReturnType<typeof getTranslations>>;

function Navigation({ t, mobile = false }: Readonly<{ t: Translate; mobile?: boolean }>) {
  return (
    <ul className={mobile ? "grid min-w-56 gap-1" : "flex items-center gap-6"}>
      {navigation.map(([key, href]) => (
        <li key={key}>
          <a
            href={href}
            className={mobile
              ? "block rounded-xl px-4 py-3 text-base font-bold transition-colors hover:bg-slate hover:text-primary"
              : "text-sm font-bold transition-colors hover:text-primary"}
          >
            {t(`navigation.${key}`)}
          </a>
        </li>
      ))}
    </ul>
  );
}

function DiscordAction({ t, className }: Readonly<{ t: Translate; className: string }>) {
  return (
    <a
      className={`group/action relative items-center gap-2 overflow-hidden rounded-full bg-primary px-4 text-sm font-bold text-ink ${className}`}
      href={site.discord}
      aria-label={t("community.joinFull")}
    >
      <Image src="/images/discord-dark.svg" alt="" width={20} height={20} />
      <AnimatedButtonLabel text={t("community.members")} />
    </a>
  );
}

export async function SiteHeader() {
  const t = await getTranslations();

  return (
    <header className="sticky inset-x-0 top-0 z-50 px-[var(--page-gutter)]">
      <HeaderShell>
        <a href="#top" className="flex w-fit items-center" aria-label={t("brand.name")}>
          <Image src="/images/brand-logo.svg" alt="" width={140} height={78} className="h-11 w-auto min-[50rem]:h-14" loading="eager" fetchPriority="high" />
        </a>
        <nav className="hidden min-[64rem]:block" aria-label={t("navigation.community")}>
          <Navigation t={t} />
        </nav>
        <DiscordAction t={t} className="inline-flex min-h-11 justify-self-center min-[64rem]:hidden" />
        <div className="flex items-center justify-end gap-2">
          <DiscordAction t={t} className="hidden min-h-11 min-[64rem]:inline-flex" />
          <MobileMenu label={t("navigation.menu")}>
            <nav aria-label={t("navigation.community")}>
              <Navigation t={t} mobile />
              <a className="group/action relative mt-2 flex min-h-11 items-center justify-center gap-2 overflow-hidden rounded-xl bg-primary px-4 font-bold text-ink" href={site.discord}>
                <Image src="/images/discord-dark.svg" alt="" width={20} height={20} />
                <AnimatedButtonLabel text={t("community.join")} />
              </a>
            </nav>
          </MobileMenu>
        </div>
      </HeaderShell>
    </header>
  );
}
