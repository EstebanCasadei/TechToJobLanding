import type { Metadata } from "next";
import { Sora } from "next/font/google";
import { getLocale, getTranslations } from "next-intl/server";
import type { ReactNode } from "react";
import { AuthorCredit } from "@/components/author-credit";
import { site, siteUrl } from "@/lib/site";
import "blobatar/motion.css";
import "./global.css";

const sora = Sora({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
  variable: "--font-sora",
});

const socialImage = {
  url: "/images/og-cover.png",
  width: 1200,
  height: 630,
};

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("metadata");

  return {
    metadataBase: new URL(siteUrl),
    icons: { icon: { url: "/images/brand-mark.svg", type: "image/svg+xml" } },
    title: {
      default: t("title"),
      template: "%s | TechToJob",
    },
    description: t("description"),
    alternates: { canonical: "/" },
    openGraph: {
      title: t("socialTitle"),
      description: t("socialDescription"),
      locale: "es_ES",
      siteName: "TechToJob",
      type: "website",
      url: "/",
      images: [{ ...socialImage, alt: t("imageAlt") }],
    },
    twitter: {
      card: "summary_large_image",
      title: t("socialTitle"),
      description: t("socialDescription"),
      images: [{ ...socialImage, alt: t("imageAlt") }],
    },
  };
}

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: site.name,
  url: siteUrl,
  logo: `${siteUrl}/images/brand-mark-512.png`,
  sameAs: [site.discord, site.linkedin, site.x, site.instagram, site.tiktok],
};

export default async function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  const locale = await getLocale();

  return (
    <html lang={locale}>
      <body className={`${sora.variable} ${sora.className}`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        {children}
        <AuthorCredit />
      </body>
    </html>
  );
}
