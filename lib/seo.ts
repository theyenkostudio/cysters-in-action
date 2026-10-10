import type { Metadata } from "next";

/**
 * One place for the site's search and sharing details.
 * Set these in the hosting environment (see .env.example):
 *   NEXT_PUBLIC_SITE_URL  the real address, for example https://cystersinaction.org
 *   SEO_INDEXABLE         "true" once the site is ready for search engines
 * Until both are set, the site tells search engines NOT to index it.
 */
const url = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/+$/, "");

export const siteConfig = {
  name: "Cysters in Action",
  homeTitle: "Cysters in Action: a community for people living with PMOS",
  description:
    "A community for people living with PMOS (formerly PCOS) to learn from reliable health information, connect with others and act for better care.",
  url,
  indexable: Boolean(process.env.NEXT_PUBLIC_SITE_URL) && process.env.SEO_INDEXABLE === "true",
} as const;

const shareImageAlt = "Two women talking and smiling at each other across a café table";

/**
 * Metadata for a page: title, description, canonical address, and the Facebook/LinkedIn/X sharing cards.
 * Leave `title` out for the home page, which uses the full site title.
 * The sharing image comes from app/opengraph-image.jpg and app/twitter-image.jpg.
 */
export function pageMetadata({
  title,
  description,
  path,
}: {
  title?: string;
  description: string;
  path: string;
}): Metadata {
  const shareTitle = title ? `${title} · ${siteConfig.name}` : siteConfig.homeTitle;

  return {
    title: title ?? { absolute: siteConfig.homeTitle },
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      siteName: siteConfig.name,
      locale: "en",
      url: path,
      title: shareTitle,
      description,
      // A page's own openGraph replaces the layout's, so the image has to be named here too.
      images: [{ url: "/opengraph-image.jpg", width: 1200, height: 630, alt: shareImageAlt }],
    },
    twitter: {
      card: "summary_large_image",
      title: shareTitle,
      description,
      images: [{ url: "/twitter-image.jpg", alt: shareImageAlt }],
    },
  };
}
