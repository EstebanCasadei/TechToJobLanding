import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { AnimatedButtonLabel, fillButtonClasses } from "@/components/animated-button-label";
import { ElasticCord } from "@/components/elastic-cord";
import { site } from "@/lib/site";

const steps = [
  { id: "join", items: ["channels", "introduction", "project"], tone: "bg-postit text-ink", rotate: "-rotate-[1.5deg]" },
  { id: "participate", items: ["challenge", "build", "feedback"], tone: "bg-ink text-white", rotate: "rotate-[1.2deg]" },
  { id: "connect", items: ["messages", "work", "fit"], tone: "bg-white text-ink", rotate: "-rotate-[.8deg]" },
] as const;

export async function HowItWorks() {
  const t = await getTranslations("howItWorks");

  return (
    <section id="how-it-works" className="relative scroll-mt-24 overflow-hidden bg-white bg-center [background-image:linear-gradient(to_right,rgba(132,192,191,.2)_1px,transparent_2px),linear-gradient(to_bottom,rgba(132,192,191,.2)_1px,transparent_2px)] [background-size:5rem_5rem] px-[var(--page-gutter)] py-[clamp(5rem,10vw,9rem)] text-ink" aria-labelledby="how-it-works-heading">
      <div className="mx-auto max-w-[80rem]">
        <header className="max-w-[60rem]">
          <h2 id="how-it-works-heading" className="text-balance font-bold leading-[.98] tracking-[-.035em]">{t("title")}</h2>
          <p className="mt-5 max-w-[50ch] text-lg font-bold text-ink/80">{t("subtitle")}</p>
        </header>

        <ol className="relative mt-16 grid gap-12 min-[56rem]:gap-20">
          <ElasticCord />
          {steps.map((step, index) => (
            <li key={step.id} className={`relative max-w-[56rem] ${index === 1 ? "min-[56rem]:ml-auto" : ""}`}>
              <Image src="/images/pin.svg" alt="" width={32} height={36} data-swing-pin className={`step-pin absolute -top-3 left-1/2 z-40 h-10 w-auto -translate-x-1/2 ${index === 1 ? "drop-shadow-[0_2px_2px_rgb(0_0_0/70%)]" : "drop-shadow-md"}`} />
              <article data-swing-card className={`${step.tone} ${step.rotate} relative z-10 rounded-2xl p-[clamp(1.5rem,4vw,3.5rem)] shadow-[0_24px_70px_rgb(47_52_54/18%)]`}>
                <h3 className="max-w-[22ch] text-balance text-[clamp(1.7rem,4vw,3.2rem)] font-bold leading-none tracking-[-.03em]"><span aria-hidden="true">{index + 1}. </span>{t(`steps.${step.id}.title`)}</h3>
                <p className="mt-5 max-w-[58ch] text-base leading-relaxed opacity-100">{t(`steps.${step.id}.description`)}</p>
                <ul className="mt-7 grid gap-3 min-[36rem]:grid-cols-3">
                  {step.items.map((item) => (
                    <li key={item} className="flex items-start gap-2 border-t border-current/20 pt-3 text-sm font-bold">
                      <Image src="/images/check.svg" alt="" width={22} height={26} className="h-6 w-auto shrink-0" />
                      {t(`steps.${step.id}.items.${item}`)}
                    </li>
                  ))}
                </ul>
                {index === 0 ? (
                  <a className={`${fillButtonClasses} mt-8 inline-flex min-h-12 items-center gap-2 rounded-full bg-ink px-5 text-sm font-bold text-white before:bg-primary hover:text-ink`} href={site.discord}>
                    <Image src="/images/discord-light.svg" alt="" width={24} height={18.29} className="relative z-10 h-5 w-auto" />
                    <AnimatedButtonLabel text={t("joinDiscord")} variant="fill" />
                  </a>
                ) : null}
              </article>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
