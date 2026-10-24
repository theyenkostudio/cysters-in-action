import type { SchemaTypeDefinition } from 'sanity'

import { aboutStat } from './objects/aboutStat'
import { address } from './objects/address'
import { cta } from './objects/cta'
import { faqItem } from './objects/faqItem'
import { hero } from './objects/hero'
import { heroMedia } from './objects/heroMedia'
import { link } from './objects/link'
import { navGroup } from './objects/navGroup'
import { navItem } from './objects/navItem'
import { richText } from './objects/richText'
import { seo } from './objects/seo'
import { socialLink } from './objects/socialLink'
import { stat } from './objects/stat'
import { waysWeShowUpCard } from './objects/waysWeShowUpCard'

import { blockSchemaTypes } from './blocks'

import { article } from './documents/article'
import { author } from './documents/author'
import { category } from './documents/category'
import { contactSubmission } from './documents/contactSubmission'
import { event } from './documents/event'
import { eventRsvp } from './documents/eventRsvp'
import { glossaryTerm } from './documents/glossaryTerm'
import { page } from './documents/page'
import { story } from './documents/story'
import { teamMember } from './documents/teamMember'
import { testimonial } from './documents/testimonial'

import { aboutPage } from './singletons/aboutPage'
import { announcementBar } from './singletons/announcementBar'
import { contactPage } from './singletons/contactPage'
import { footer } from './singletons/footer'
import { homePage } from './singletons/homePage'
import { learnHubPage } from './singletons/learnHubPage'
import { navigation } from './singletons/navigation'
import { shareStoryPage } from './singletons/shareStoryPage'
import { siteSettings } from './singletons/siteSettings'

// Document type names that are singletons: at most one instance, no "create
// new"/duplicate/delete in the Studio (enforced in sanity.config.ts).
export const SINGLETON_TYPES = new Set([
  'siteSettings',
  'navigation',
  'footer',
  'announcementBar',
  'homePage',
  'aboutPage',
  'learnHubPage',
  'contactPage',
  'shareStoryPage',
])

// Document types only ever created by the site itself (Server Actions with
// a write token) — never by an editor via Studio's "New document" menu.
export const NO_CREATE_TYPES = new Set(['contactSubmission', 'eventRsvp'])

export const schemaTypes: SchemaTypeDefinition[] = [
  // Objects
  seo,
  link,
  cta,
  heroMedia,
  hero,
  richText,
  socialLink,
  address,
  navGroup,
  navItem,
  stat,
  aboutStat,
  waysWeShowUpCard,
  faqItem,
  // Page-builder blocks
  ...blockSchemaTypes,
  // Documents
  page,
  article,
  category,
  author,
  teamMember,
  testimonial,
  contactSubmission,
  story,
  event,
  eventRsvp,
  glossaryTerm,
  // Singletons
  siteSettings,
  navigation,
  footer,
  announcementBar,
  homePage,
  aboutPage,
  learnHubPage,
  contactPage,
  shareStoryPage,
]
