import { defineQuery } from 'next-sanity'

// --- Reusable GROQ projections -------------------------------------------

const IMAGE = `{ "url": asset->url, alt, caption, credit }`
const LINK = `{ label, type, external, openInNewTab, internal->{ _type, slug, "category": category->{slug} } }`
const CTA = `{ style, action, link${LINK} }`
const HERO_MEDIA = `{
  mediaType,
  "image": image${IMAGE},
  "videoUrl": videoFile.asset->url,
  "videoWebmUrl": videoWebm.asset->url,
  "poster": poster${IMAGE},
  "captionsUrl": captionsFile.asset->url,
  loop, autoplayMuted
}`
const HERO = `{
  eyebrow, headline, subline, overlayStrength, overlayDirection, height, textAlign,
  heroMedia${HERO_MEDIA},
  ctas[]${CTA},
}`
const CATEGORY = `{ _id, _type, title, slug, description, icon, colour, order, "image": image${IMAGE} }`
const AUTHOR = `{ _id, _type, name, slug, role, credentials, bio, "photo": photo${IMAGE} }`
const ARTICLE_CARD = `{
  _id, _type, title, slug, articleType, standfirst, publishedAt, featured,
  "category": category->${CATEGORY},
  "mainImage": mainImage${IMAGE},
}`
const ARTICLE_FULL = `{
  ${ARTICLE_CARD.slice(1, -1)},
  tags, body, myths, doctorQuestions, sources, lastReviewedAt, contentWarning, seo,
  "author": author->${AUTHOR},
  "medicalReviewer": medicalReviewer->${AUTHOR},
  "relatedArticles": relatedArticles[]->${ARTICLE_CARD},
}`
const SEO = `{ metaTitle, metaDescription, "ogImage": ogImage${IMAGE}, noIndex, canonicalUrl }`

const PAGE_BUILDER_BLOCK = `{
  ...,
  _type == "heroBlock" => { hero${HERO} },
  _type == "missionStatementBlock" => { cta${CTA} },
  _type == "pillarsBlock" => { pillars[]{ ..., link${LINK} } },
  _type == "problemSolutionBlock" => { "image": image${IMAGE} },
  _type == "featuredArticlesBlock" => {
    cta${CTA},
    "category": category->${CATEGORY},
    "manualArticles": articles[]->${ARTICLE_CARD},
  },
  _type == "ctaBlock" => { "image": image${IMAGE}, ctas[]${CTA} },
  _type == "imageTextBlock" => { "image": image${IMAGE}, cta${CTA} },
  _type == "mediaBlock" => { heroMedia${HERO_MEDIA} },
  _type == "testimonialBlock" => { testimonials[]-> },
  _type == "teamGridBlock" => { "members": members[]-> },
}`

// --- Site shell (Phase 1) --------------------------------------------------

export const siteSettingsQuery = defineQuery(`*[_type == "siteSettings"][0]{
  siteName, tagline, "logo": logo${IMAGE}, "logoOnDark": logoOnDark${IMAGE}, "favicon": favicon${IMAGE},
  contactEmail, phone, whatsapp, address, socialLinks, medicalDisclaimer,
}`)

export const navigationQuery = defineQuery(`*[_type == "navigation"][0]{
  mainNav[]{ label, link${LINK}, items[]{ title, description, icon, link${LINK} } },
  secondaryLink${LINK},
  primaryCta${CTA},
}`)

export const footerQuery = defineQuery(`*[_type == "footer"][0]{
  blurb, columns[]{ heading, links[]${LINK} }, showNewsletter, newsletterHeading,
  legalLinks[]${LINK}, copyrightText, credit${LINK},
}`)

export const announcementBarQuery = defineQuery(`*[_type == "announcementBar" && enabled == true
  && (!defined(startDate) || startDate <= now())
  && (!defined(endDate) || endDate >= now())][0]{
  label, message, link${LINK}, dismissible, tone,
}`)

// --- Home / About / Learn hub (Phase 2) ------------------------------------

export const homePageQuery = defineQuery(`*[_type == "homePage"][0]{
  seo${SEO}, hero${HERO}, sections[]${PAGE_BUILDER_BLOCK},
}`)

export const aboutPageQuery = defineQuery(`*[_type == "aboutPage"][0]{
  seo${SEO}, hero${HERO}, story, pillars, values, foundingCircleHeading,
  "foundingCircle": foundingCircle[]->{ _id, _type, name, role, group, "photo": photo${IMAGE}, bio, quote, order },
  sections[]${PAGE_BUILDER_BLOCK},
}`)

export const learnHubPageQuery = defineQuery(`*[_type == "learnHubPage"][0]{
  seo${SEO}, hero${HERO}, introText, showGlossaryTeaser, doctorGuidesHeading,
  "featuredArticles": featuredArticles[]->${ARTICLE_CARD},
  sections[]${PAGE_BUILDER_BLOCK},
}`)

export const contactPageQuery = defineQuery(`*[_type == "contactPage"][0]{
  seo${SEO}, hero${HERO}, intro, enquiryTypes, successMessage, showMap, mapEmbedUrl,
}`)

// --- Learn hub content ------------------------------------------------------

export const categoriesQuery = defineQuery(`*[_type == "category"] | order(order asc)${CATEGORY}`)

export const categoryBySlugQuery = defineQuery(
  `*[_type == "category" && slug.current == $slug][0]${CATEGORY}`,
)

export const articlesByCategoryQuery = defineQuery(
  `*[_type == "article" && category->slug.current == $categorySlug] | order(publishedAt desc)${ARTICLE_CARD}`,
)

export const featuredArticlesQuery = defineQuery(
  `*[_type == "article" && featured == true] | order(publishedAt desc)${ARTICLE_CARD}`,
)

export const articleBySlugQuery = defineQuery(
  `*[_type == "article" && slug.current == $slug][0]${ARTICLE_FULL}`,
)

export const allArticlesQuery = defineQuery(
  `*[_type == "article"] | order(publishedAt desc)${ARTICLE_CARD}`,
)

// --- Team / testimonials / generic pages -----------------------------------

export const teamMembersQuery = defineQuery(
  `*[_type == "teamMember" && group == $group] | order(order asc){ _id, _type, name, role, group, "photo": photo${IMAGE}, bio, quote, order }`,
)

export const pageBySlugQuery = defineQuery(`*[_type == "page" && slug.current == $slug][0]{
  title, slug, "hero": hero${HERO}, sections[]${PAGE_BUILDER_BLOCK}, seo${SEO},
}`)

export const allPageSlugsQuery = defineQuery(`*[_type == "page"]{ "slug": slug.current }`)
