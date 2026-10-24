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
const SEO = `{ metaTitle, metaDescription, "ogImage": ogImage${IMAGE}, noIndex, canonicalUrl }`
const GLOSSARY_TERM_CARD = `{ _id, _type, term, slug, alsoKnownAs, pronunciation, shortDefinition }`

// Resolves the `glossaryTerm` mark's `term` reference inline, so article
// body can render a tooltip without a second round-trip (Section 6: "glossary
// term tooltips" on the article template).
const richTextWithGlossary = (field: string) => `${field}[]{
  ...,
  markDefs[]{
    ...,
    _type == "glossaryTerm" => { "term": term->${GLOSSARY_TERM_CARD} }
  }
}`

const ARTICLE_FULL = `{
  ${ARTICLE_CARD.slice(1, -1)},
  tags, myths, doctorQuestions, sources, lastReviewedAt, contentWarning, seo,
  "body": ${richTextWithGlossary('body')},
  "author": author->${AUTHOR},
  "medicalReviewer": medicalReviewer->${AUTHOR},
  "relatedArticles": relatedArticles[]->${ARTICLE_CARD},
}`
const GLOSSARY_TERM_FULL = `{
  ${GLOSSARY_TERM_CARD.slice(1, -1)},
  "fullExplanation": ${richTextWithGlossary('fullExplanation')},
  "relatedTerms": relatedTerms[]->${GLOSSARY_TERM_CARD},
  "relatedArticles": relatedArticles[]->${ARTICLE_CARD},
}`
// Only ever queried publicly with status == "approved" — see every usage
// below. Private fields (contactEmail, the three consents, moderationNotes)
// are never selected here at all, so they can never leak into a public response.
const STORY_CARD = `{
  _id, _type, title, slug, isAnonymous,
  "authorName": select(isAnonymous => null, authorName),
  pullQuote, "image": image${IMAGE}, themes, featured, submittedAt, approvedAt,
}`
const STORY_FULL = `{
  ${STORY_CARD.slice(1, -1)},
  ageRange, country, body, contentWarning,
}`
// onlineJoinUrl is deliberately excluded — "Never rendered publicly" per
// Section 6. It's only ever read server-side, inside the RSVP Server Action,
// via a separate query (see lib/forms/actions.ts).
const EVENT_CARD = `{
  _id, _type, title, slug, eventType, format, startDateTime, endDateTime, timezone,
  summary, "image": image${IMAGE}, rsvpEnabled, rsvpMode, externalRsvpUrl, capacity, status,
}`
const EVENT_FULL = `{
  ${EVENT_CARD.slice(1, -1)},
  description, venue, rsvpDeadline, recordingUrl, seo${SEO},
  "hosts": hosts[]->{ _id, name, "photo": photo${IMAGE} },
}`

const PAGE_BUILDER_BLOCK = `{
  ...,
  _type == "heroBlock" => { hero${HERO} },
  _type == "aboutIntroBlock" => { cta${CTA} },
  _type == "waysWeShowUpBlock" => {
    cards[]{ ..., "image": image${IMAGE}, link${LINK} },
  },
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
  _type == "upcomingEventsBlock" => { cta${CTA} },
  _type == "storiesCarouselBlock" => { "manualStories": stories[]->${STORY_CARD}, cta${CTA} },
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

// --- Community (Phase 4) -----------------------------------------------------

export const shareStoryPageQuery = defineQuery(`*[_type == "shareStoryPage"][0]{
  seo${SEO}, hero${HERO}, intro, whatHappensNext, consentText, privacyNote,
  successHeading, successMessage, submissionsOpen, closedMessage,
}`)

export const approvedStoriesQuery = defineQuery(
  `*[_type == "story" && status == "approved"] | order(approvedAt desc)${STORY_CARD}`,
)

export const featuredStoriesQuery = defineQuery(
  `*[_type == "story" && status == "approved" && featured == true] | order(approvedAt desc)${STORY_CARD}`,
)

export const storyBySlugQuery = defineQuery(
  `*[_type == "story" && status == "approved" && slug.current == $slug][0]${STORY_FULL}`,
)

export const allApprovedStorySlugsQuery = defineQuery(
  `*[_type == "story" && status == "approved"]{ "slug": slug.current }`,
)

export const upcomingEventsQuery = defineQuery(
  `*[_type == "event" && status != "cancelled" && startDateTime >= now()] | order(startDateTime asc)${EVENT_CARD}`,
)

export const pastEventsQuery = defineQuery(
  `*[_type == "event" && startDateTime < now()] | order(startDateTime desc)${EVENT_CARD}`,
)

export const eventBySlugQuery = defineQuery(
  `*[_type == "event" && slug.current == $slug][0]${EVENT_FULL}`,
)

// Public-safe (no onlineJoinUrl) — used by the .ics download route, which
// anyone with the link can hit.
export const eventByIdQuery = defineQuery(`*[_type == "event" && _id == $id][0]${EVENT_FULL}`)

export const allEventSlugsQuery = defineQuery(`*[_type == "event"]{ "slug": slug.current }`)

// Server-only — reads onlineJoinUrl, which the public queries above never select.
export const eventJoinDetailsQuery = defineQuery(`*[_type == "event" && _id == $id][0]{
  title, startDateTime, endDateTime, timezone, onlineJoinUrl, format, capacity,
  "venueName": venue.name, "mapUrl": venue.mapUrl,
}`)

// Server-only, used by the Studio "Approve & publish" / "Reject" actions
// (via /api/story-decision) to email the submitter. Never exposed to a page.
export const storyContactDetailsQuery = defineQuery(`*[_type == "story" && _id == $id][0]{
  title, isAnonymous, authorName, contactEmail, consentContact, "slug": slug.current,
}`)

export const glossaryTermsQuery = defineQuery(
  `*[_type == "glossaryTerm"] | order(term asc)${GLOSSARY_TERM_CARD}`,
)

export const glossaryTermBySlugQuery = defineQuery(
  `*[_type == "glossaryTerm" && slug.current == $slug][0]${GLOSSARY_TERM_FULL}`,
)

export const allGlossaryTermSlugsQuery = defineQuery(
  `*[_type == "glossaryTerm"]{ "slug": slug.current }`,
)

// Capacity check inside the RSVP Server Action — counts existing attending RSVPs.
export const eventRsvpCountQuery = defineQuery(
  `count(*[_type == "eventRsvp" && event._ref == $eventId && attendance == "attending"])`,
)
