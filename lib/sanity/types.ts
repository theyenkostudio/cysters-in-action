// Shared shapes for resolved content — what GROQ projections return AND what
// fixtures provide. Components consume these types regardless of source.

export type SanityImage = {
  url: string
  alt: string
  caption?: string
  credit?: string
}

/** Portable Text content. Loosely typed on purpose — fixtures author literal
 * block arrays, and @portabletext/react accepts this shape structurally. */
export type RichTextValue = Array<Record<string, unknown>>

export type ResolvedLinkValue = {
  label: string
  type: 'internal' | 'external' | 'email' | 'phone' | 'anchor'
  external?: string
  openInNewTab?: boolean
  internal?: {
    _type: string
    slug?: { current: string }
    category?: { slug?: { current: string } } | null
  } | null
}

export type CtaValue = {
  link: ResolvedLinkValue
  style?: 'solid' | 'outline' | 'ghost'
  action?: 'navigate' | 'openNewsletter' | 'scrollTo'
}

export type HeroMediaValue = {
  mediaType: 'image' | 'video'
  image?: SanityImage
  videoUrl?: string
  videoWebmUrl?: string
  poster?: SanityImage
  captionsUrl?: string
  loop?: boolean
  autoplayMuted?: boolean
}

export type HeroValue = {
  eyebrow?: string
  headline: string
  subline?: string
  heroMedia?: HeroMediaValue
  overlayStrength?: number
  overlayDirection?: 'left' | 'bottom' | 'full'
  ctas?: CtaValue[]
  height?: 'full' | 'large' | 'medium'
  textAlign?: 'left' | 'center'
}

export type StatValue = {
  value: number
  prefix?: string
  suffix?: string
  label: string
  source?: string
}

export type FaqItemValue = {
  question: string
  answer: RichTextValue
}

export type SeoValue = {
  metaTitle?: string
  metaDescription?: string
  ogImage?: SanityImage
  noIndex?: boolean
  canonicalUrl?: string
}

export type CategoryRef = {
  _id: string
  _type: 'category'
  title: string
  slug: { current: string }
  description?: string
  icon?: string
  colour?: 'teal' | 'orchid' | 'lagoon'
  order?: number
  image?: SanityImage
}

export type AuthorRef = {
  _id: string
  _type: 'author'
  name: string
  slug: { current: string }
  role: 'writer' | 'medicalReviewer' | 'communityMember'
  credentials?: string
  bio?: string
  photo?: SanityImage
}

export type ArticleType = 'explainer' | 'mythBuster' | 'doctorGuide' | 'personalInsight' | 'news'

export type ArticleRef = {
  _id: string
  _type: 'article'
  title: string
  slug: { current: string }
  articleType: ArticleType
  category: CategoryRef
  tags?: string[]
  standfirst?: string
  mainImage?: SanityImage
  body: RichTextValue
  myths?: { myth: string; fact: string; sourceUrl?: string }[]
  doctorQuestions?: { question: string; whyItMatters?: string }[]
  author: AuthorRef
  medicalReviewer?: AuthorRef
  publishedAt: string
  lastReviewedAt?: string
  sources?: { title: string; url?: string; publisher?: string; year?: number }[]
  relatedArticles?: ArticleRef[]
  featured?: boolean
  contentWarning?: string
  seo?: SeoValue
}

export type TeamMemberRef = {
  _id: string
  _type: 'teamMember'
  name: string
  role: string
  group: 'foundingCircle' | 'advisor' | 'volunteer'
  photo?: SanityImage
  bio?: string
  quote?: string
  order?: number
}

export type TestimonialRef = {
  _id: string
  _type: 'testimonial'
  quote: string
  attribution: string
  role?: string
  image?: SanityImage
  featured?: boolean
}

export type PageBuilderBlock = {
  _type: string
  _key: string
  animation?: 'none' | 'subtle' | 'exaggerated'
} & Record<string, unknown>
