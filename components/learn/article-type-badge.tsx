import { Badge } from '@/components/ui/badge'
import type { ArticleType } from '@/lib/sanity/types'

export const ARTICLE_TYPE_LABELS: Record<ArticleType, string> = {
  explainer: 'Explainer',
  mythBuster: 'Myth-buster',
  doctorGuide: 'Doctor guide',
  personalInsight: 'Personal insight',
  news: 'News',
}

export function ArticleTypeBadge({ type }: { type: ArticleType }) {
  return <Badge tone="neutral">{ARTICLE_TYPE_LABELS[type]}</Badge>
}
