import type { AnnouncementBarData } from '@/components/layout/announcement-bar'
import type { FooterData } from '@/components/layout/footer'
import type { NavData } from '@/components/layout/nav'
import * as fixtures from './fixtures'
import { sanityFetch } from './fetch'
import {
  aboutPageQuery,
  allArticlesQuery,
  allPageSlugsQuery,
  announcementBarQuery,
  articleBySlugQuery,
  articlesByCategoryQuery,
  categoriesQuery,
  categoryBySlugQuery,
  featuredArticlesQuery,
  footerQuery,
  homePageQuery,
  learnHubPageQuery,
  navigationQuery,
  pageBySlugQuery,
  siteSettingsQuery,
  teamMembersQuery,
} from './queries'
import type {
  ArticleRef,
  CategoryRef,
  HeroValue,
  PageBuilderBlock,
  RichTextValue,
  SeoValue,
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
