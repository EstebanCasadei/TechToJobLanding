import { NewsSection } from "@/components/news-section";
import { getTranslations } from "next-intl/server";
import { CompaniesSection, TalentSection } from "@/components/audience-sides";
import {
  ClosingSection,
  NetworkingSection,
  NewsletterSection,
  SiteFooter,
  TestimonialsSection,
} from "@/components/community-sections";
import { CardSwing } from "@/components/card-swing";
import { Hero } from "@/components/hero";
import { HowItWorks } from "@/components/how-it-works";
import { ScrollExperience } from "@/components/scroll-experience";
import { SiteHeader } from "@/components/site-header";
import { TournamentsSection } from "@/components/tournaments";

export default async function HomePage() {
  const t = await getTranslations("navigation");

  return (
    <div className="relative isolate overflow-x-clip">
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-xl focus:bg-primary focus:px-5 focus:py-3 focus:text-sm focus:font-bold focus:text-ink"
      >
        {t("skipToContent")}
      </a>
      <SiteHeader />
      <main id="content">
        <Hero />
        <HowItWorks />
        <TalentSection />
        <CompaniesSection />
        <TournamentsSection />
        <NetworkingSection />
        <TestimonialsSection />
        <NewsSection />
        <NewsletterSection />
        <ClosingSection />
      </main>
      <SiteFooter />
      <ScrollExperience />
      <CardSwing />
    </div>
  );
}
