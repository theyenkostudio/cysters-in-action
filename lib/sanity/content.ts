import type { AnnouncementBarData } from '@/components/layout/announcement-bar'
import type { FooterData } from '@/components/layout/footer'
import type { NavData } from '@/components/layout/nav'
import * as fixtures from './fixtures'
import { sanityFetch } from './fetch'
import {
  aboutPageQuery,
  allApprovedStorySlugsQuery,
  allArticlesQuery,
  allEventSlugsQuery,
  allGlossaryTermSlugsQuery,
  allPageSlugsQuery,
  announcementBarQuery,
  approvedStoriesQuery,
  articleBySlugQuery,
  articlesByCategoryQuery,
  categoriesQuery,
  categoryBySlugQuery,
  contactPageQuery,
  eventByIdQuery,
  eventBySlugQuery,
  eventJoinDetailsQuery,
  eventRsvpCountQuery,
  featuredArticlesQuery,
  featuredStoriesQuery,
  footerQuery,
  glossaryTermBySlugQuery,
  glossaryTermsQuery,
  homePageQuery,
  learnHubPageQuery,
  navigationQuery,
  pageBySlugQuery,
  pastEventsQuery,
  shareStoryPageQuery,
  siteSettingsQuery,
  storyBySlugQuery,
  storyContactDetailsQuery,
  teamMembersQuery,
  upcomingEventsQuery,
} from './queries'
import type {
  ArticleRef,
  CategoryRef,
  EventRef,
  GlossaryTermRef,
  HeroValue,
  PageBuilderBlock,
  RichTextValue,
  SeoValue,
  StoryRef,
  TeamMemberRef,
} from './types'

export type SiteSettingsData = typeof fixtures.siteSettings | null

// --- Site shell -------------------------------------------------------------

export function getSiteSettings() {
  return sanityFetch<SiteSettingsData>({
    query: siteSettingsQuery,
    tags: ['siteSettings'],
    fixture: fixtures.siteSettings,
  })
}

export function getNavigation() {
  return sanityFetch<NavData>({
    query: navigationQuery,
    tags: ['navigation'],
    fixture: fixtures.navigation as NavData,
  })
}

export function getFooter() {
  return sanityFetch<FooterData>({
    query: footerQuery,
    tags: ['footer'],
    fixture: fixtures.footer as FooterData,
  })
}

export function getAnnouncementBar() {
  return sanityFetch<AnnouncementBarData>({
    query: announcementBarQuery,
    tags: ['announcementBar'],
    fixture: fixtures.announcementBar as AnnouncementBarData,
  })
}

// --- Home / About / Learn hub -----------------------------------------------

export type HomePageData = { seo?: SeoValue; hero: HeroValue; sections: PageBuilderBlock[] } | null

export function getHomePage() {
  return sanityFetch<HomePageData>({
    query: homePageQuery,
    tags: ['homePage'],
    fixture: { hero: fixtures.homePageHero, sections: fixtures.homePageSections },
  })
}

export type AboutPageData = {
  seo?: SeoValue
  hero: HeroValue
  story: RichTextValue
  pillars: { title: string; icon?: 'learn' | 'connect' | 'act'; body?: string }[]
  values: { title: string; body?: string }[]
  foundingCircleHeading?: string
  foundingCircle: TeamMemberRef[]
  sections: PageBuilderBlock[]
} | null

export function getAboutPage() {
  return sanityFetch<AboutPageData>({
    query: aboutPageQuery,
    tags: ['aboutPage'],
    fixture: {
      hero: fixtures.aboutPageHero,
      story: fixtures.aboutPageStory,
      pillars: fixtures.aboutPagePillars,
      values: fixtures.aboutPageValues,
      foundingCircleHeading: 'The Founding Circle',
      foundingCircle: fixtures.teamMembers.filter((m) => m.group === 'foundingCircle'),
      sections: [],
    },
  })
}

export type LearnHubPageData = {
  seo?: SeoValue
  hero: HeroValue
  introText?: string
  showGlossaryTeaser?: boolean
  doctorGuidesHeading?: string
  featuredArticles: ArticleRef[]
  sections: PageBuilderBlock[]
} | null

export function getLearnHubPage() {
  return sanityFetch<LearnHubPageData>({
    query: learnHubPageQuery,
    tags: ['learnHubPage'],
    fixture: {
      hero: fixtures.learnHubPageHero,
      introText: fixtures.learnHubIntroText,
      showGlossaryTeaser: false,
      doctorGuidesHeading: 'Questions for your doctor',
      featuredArticles: fixtures.learnHubFeaturedArticles,
      sections: [],
    },
  })
}

export type ContactPageData = {
  seo?: SeoValue
  hero: HeroValue
  intro?: string
  enquiryTypes: { label: string; value: string; routeToEmail?: string }[]
  successMessage?: string
  showMap?: boolean
  mapEmbedUrl?: string
} | null

export function getContactPage() {
  return sanityFetch<ContactPageData>({
    query: contactPageQuery,
    tags: ['contactPage'],
    fixture: {
      hero: fixtures.contactPageHero,
      intro: fixtures.contactPageIntro,
      enquiryTypes: fixtures.contactPageEnquiryTypes,
      successMessage: fixtures.contactPageSuccessMessage,
      showMap: false,
    },
  })
}

// --- Learn hub content -------------------------------------------------------

export function getCategories() {
  return sanityFetch<CategoryRef[]>({
    query: categoriesQuery,
    tags: ['category'],
    fixture: fixtures.categories,
  })
}

export function getCategoryBySlug(slug: string) {
  return sanityFetch<CategoryRef | null>({
    query: categoryBySlugQuery,
    params: { slug },
    tags: [`category:${slug}`],
    fixture: () => fixtures.getCategoryBySlug(slug) ?? null,
  })
}

export function getArticlesByCategory(categorySlug: string) {
  return sanityFetch<ArticleRef[]>({
    query: articlesByCategoryQuery,
    params: { categorySlug },
    tags: [`article:category:${categorySlug}`],
    fixture: () => fixtures.getArticlesByCategory(categorySlug),
  })
}

export function getFeaturedArticles() {
  return sanityFetch<ArticleRef[]>({
    query: featuredArticlesQuery,
    tags: ['article'],
    fixture: () => fixtures.articles.filter((a) => a.featured),
  })
}

export function getAllArticles() {
  return sanityFetch<ArticleRef[]>({
    query: allArticlesQuery,
    tags: ['article'],
    fixture: () => [...fixtures.articles].sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1)),
  })
}

export function getArticleBySlug(slug: string) {
  return sanityFetch<ArticleRef | null>({
    query: articleBySlugQuery,
    params: { slug },
    tags: [`article:${slug}`],
    fixture: () => fixtures.getArticleBySlug(slug) ?? null,
  })
}

// --- Team / generic pages ----------------------------------------------------

export function getTeamMembers(group: 'foundingCircle' | 'advisor' | 'volunteer') {
  return sanityFetch<TeamMemberRef[]>({
    query: teamMembersQuery,
    params: { group },
    tags: ['teamMember'],
    fixture: () => fixtures.teamMembers.filter((m) => m.group === group),
  })
}

export type GenericPageData = {
  title: string
  slug: { current: string }
  hero?: HeroValue
  sections: PageBuilderBlock[]
  seo?: SeoValue
} | null

export function getPageBySlug(slug: string) {
  return sanityFetch<GenericPageData>({
    query: pageBySlugQuery,
    params: { slug },
    tags: [`page:${slug}`],
    fixture: () => {
      const page = fixtures.getPageBySlug(slug)
      if (!page) return null
      return { title: page.title, slug: page.slug, sections: page.sections, seo: page.seo }
    },
  })
}

export function getAllPageSlugs() {
  return sanityFetch<{ slug: string }[]>({
    query: allPageSlugsQuery,
    tags: ['page'],
    fixture: () => fixtures.pages.map((p) => ({ slug: p.slug.current })),
  })
}

// --- Community (Phase 4) -----------------------------------------------------

export type ShareStoryPageData = {
  seo?: SeoValue
  hero: HeroValue
  intro?: RichTextValue
  whatHappensNext: { title: string; body?: string }[]
  consentText: RichTextValue
  privacyNote?: string
  successHeading?: string
  successMessage?: string
  submissionsOpen: boolean
  closedMessage?: string
} | null

export function getShareStoryPage() {
  return sanityFetch<ShareStoryPageData>({
    query: shareStoryPageQuery,
    tags: ['shareStoryPage'],
    fixture: {
      hero: fixtures.shareStoryPageHero,
      intro: fixtures.shareStoryPageIntro,
      whatHappensNext: fixtures.shareStoryWhatHappensNext,
      consentText: fixtures.shareStoryConsentText,
      privacyNote: fixtures.shareStoryPrivacyNote,
      successHeading: fixtures.shareStorySuccessHeading,
      successMessage: fixtures.shareStorySuccessMessage,
      submissionsOpen: fixtures.shareStorySubmissionsOpen,
    },
  })
}

export function getApprovedStories() {
  return sanityFetch<StoryRef[]>({
    query: approvedStoriesQuery,
    tags: ['story'],
    fixture: () => fixtures.stories.map(withResolvedAuthorName),
  })
}

export function getFeaturedStories() {
  return sanityFetch<StoryRef[]>({
    query: featuredStoriesQuery,
    tags: ['story'],
    fixture: () => fixtures.stories.filter((s) => s.featured).map(withResolvedAuthorName),
  })
}

export function getStoryBySlug(slug: string) {
  return sanityFetch<StoryRef | null>({
    query: storyBySlugQuery,
    params: { slug },
    tags: [`story:${slug}`],
    fixture: () => {
      const story = fixtures.getStoryBySlug(slug)
      return story ? withResolvedAuthorName(story) : null
    },
  })
}

// Server-only — see queries.ts. Only ever called from /api/story-decision,
// never from a page, so returning contactEmail here is safe.
export type StoryContactDetails = {
  title: string
  isAnonymous: boolean
  authorName?: string
  contactEmail?: string
  consentContact?: boolean
  slug?: string
} | null

export function getStoryContactDetails(id: string) {
  return sanityFetch<StoryContactDetails>({
    query: storyContactDetailsQuery,
    params: { id },
    fixture: () => {
      const story = fixtures.stories.find((s) => s._id === id)
      if (!story) return null
      return {
        title: story.title,
        isAnonymous: story.isAnonymous,
        authorName: story.authorName,
        contactEmail: 'placeholder-submitter@example.com',
        consentContact: true,
        slug: story.slug?.current,
      }
    },
  })
}

export function getAllApprovedStorySlugs() {
  return sanityFetch<{ slug: string }[]>({
    query: allApprovedStorySlugsQuery,
    tags: ['story'],
    fixture: () => fixtures.stories.filter((s) => s.slug).map((s) => ({ slug: s.slug!.current })),
  })
}

/** Mirrors the GROQ projection's `select(isAnonymous => null, authorName)` — belt and
 * braces alongside stories.ts's own resolveAuthorName, so this invariant can never
 * regress silently if a fixture is edited without going through that helper. */
function withResolvedAuthorName(story: StoryRef): StoryRef {
  return { ...story, authorName: fixtures.resolveAuthorName(story) }
}

export function getUpcomingEvents() {
  return sanityFetch<EventRef[]>({
    query: upcomingEventsQuery,
    tags: ['event'],
    fixture: () =>
      fixtures.events
        .filter((e) => e.status !== 'cancelled' && !fixtures.isPastEvent(e))
        .sort((a, b) => (a.startDateTime < b.startDateTime ? -1 : 1)),
  })
}

export function getPastEvents() {
  return sanityFetch<EventRef[]>({
    query: pastEventsQuery,
    tags: ['event'],
    fixture: () =>
      fixtures.events
        .filter((e) => fixtures.isPastEvent(e))
        .sort((a, b) => (a.startDateTime < b.startDateTime ? 1 : -1)),
  })
}

export function getEventBySlug(slug: string) {
  return sanityFetch<EventRef | null>({
    query: eventBySlugQuery,
    params: { slug },
    tags: [`event:${slug}`],
    fixture: () => fixtures.getEventBySlug(slug) ?? null,
  })
}

export function getEventById(id: string) {
  return sanityFetch<EventRef | null>({
    query: eventByIdQuery,
    params: { id },
    tags: [`event:id:${id}`],
    fixture: () => fixtures.events.find((e) => e._id === id) ?? null,
  })
}

// Server-only — includes onlineJoinUrl. Only ever called from inside the
// RSVP Server Action (lib/forms/actions.ts), never from a page.
export type EventJoinDetails = {
  title: string
  startDateTime: string
  endDateTime: string
  timezone: string
  onlineJoinUrl?: string
  format: string
  capacity?: number
  venueName?: string
  mapUrl?: string
} | null

export function getEventJoinDetails(id: string) {
  return sanityFetch<EventJoinDetails>({
    query: eventJoinDetailsQuery,
    params: { id },
    fixture: () => {
      const e = fixtures.events.find((ev) => ev._id === id)
      if (!e) return null
      return {
        title: e.title,
        startDateTime: e.startDateTime,
        endDateTime: e.endDateTime,
        timezone: e.timezone,
        onlineJoinUrl: e.onlineJoinUrl,
        format: e.format,
        capacity: e.capacity,
        venueName: e.venue?.name,
        mapUrl: e.venue?.mapUrl,
      }
    },
  })
}

// Approximate in the fixture world (no real persisted RSVPs to count) —
// always reports 0, so capacity/waitlist logic is exercised at the code
// level but never actually blocks a local-dev submission.
export function getEventRsvpCount(eventId: string) {
  return sanityFetch<number>({
    query: eventRsvpCountQuery,
    params: { eventId },
    fixture: () => 0,
  })
}

export function getAllEventSlugs() {
  return sanityFetch<{ slug: string }[]>({
    query: allEventSlugsQuery,
    tags: ['event'],
    fixture: () => fixtures.events.map((e) => ({ slug: e.slug.current })),
  })
}

export function getGlossaryTerms() {
  return sanityFetch<GlossaryTermRef[]>({
    query: glossaryTermsQuery,
    tags: ['glossaryTerm'],
    fixture: () => [...fixtures.glossaryTerms].sort((a, b) => a.term.localeCompare(b.term)),
  })
}

export function getGlossaryTermBySlug(slug: string) {
  return sanityFetch<GlossaryTermRef | null>({
    query: glossaryTermBySlugQuery,
    params: { slug },
    tags: [`glossaryTerm:${slug}`],
    fixture: () => fixtures.getGlossaryTermBySlug(slug) ?? null,
  })
}

export function getAllGlossaryTermSlugs() {
  return sanityFetch<{ slug: string }[]>({
    query: allGlossaryTermSlugsQuery,
    tags: ['glossaryTerm'],
    fixture: () => fixtures.glossaryTerms.map((t) => ({ slug: t.slug.current })),
  })
}
