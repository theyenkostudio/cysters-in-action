import type { Metadata, Viewport } from "next";
import { Hanken_Grotesk } from "next/font/google";
import { ViewTransition } from "react";
import { JsonLd } from "@/components/seo/json-ld";
import { siteConfig } from "@/lib/seo";
import "./globals.css";

const hanken = Hanken_Grotesk({
  variable: "--font-hanken",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: { default: siteConfig.homeTitle, template: `%s · ${siteConfig.name}` },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  category: "health",
  // Stays "noindex" until NEXT_PUBLIC_SITE_URL and SEO_INDEXABLE=true are set. See lib/seo.ts.
  robots: siteConfig.indexable
    ? { index: true, follow: true }
    : { index: false, follow: false },
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    locale: "en",
    title: siteConfig.homeTitle,
    description: siteConfig.description,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.homeTitle,
    description: siteConfig.description,
  },
};

export const viewport: Viewport = {
  themeColor: "#faf8f5",
  colorScheme: "light",
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${siteConfig.url}/#organization`,
      name: siteConfig.name,
      url: siteConfig.url,
      description: siteConfig.description,
    },
    {
      "@type": "WebSite",
      "@id": `${siteConfig.url}/#website`,
      url: siteConfig.url,
      name: siteConfig.name,
      description: siteConfig.description,
      inLanguage: "en",
      publisher: { "@id": `${siteConfig.url}/#organization` },
    },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${hanken.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        {/* Only published once the site is indexable, so no placeholder address ends up in search results. */}
        {siteConfig.indexable && <JsonLd data={structuredData} />}
        {/* Cross-fades between pages. Styled by `.page-fade` in globals.css. */}
        <ViewTransition default="page-fade">{children}</ViewTransition>
      </body>
    </html>
  );
}
