import NextLink from 'next/link'
import { Card, CardImage } from '@/components/ui/card'
import { Icon } from '@/components/ui/icon'
import { internalHref } from '@/lib/link'
import type { ArticleRef } from '@/lib/sanity/types'
import { ARTICLE_TYPE_LABELS } from './article-type-badge'

export function ArticleCard({ article }: { article: ArticleRef }) {
  const href = internalHref({ _type: 'article', slug: article.slug, category: article.category })

  return (
    <Card>
      <NextLink href={href} className="flex h-full flex-col">
        {article.mainImage && <CardImage src={article.mainImage.url} alt={article.mainImage.alt} />}
        <div className="flex flex-1 flex-col p-5">
          <span className="text-fg-subtle text-xs font-semibold tracking-wide uppercase">
            {ARTICLE_TYPE_LABELS[article.articleType]}
          </span>
          <h3 className="text-fg-heading font-display mt-2 text-lg font-semibold">
            {article.title}
          </h3>
          {article.standfirst && <p className="text-fg-muted mt-2 text-sm">{article.standfirst}</p>}
          <span className="text-fg-link mt-auto inline-flex items-center gap-1 pt-3 text-sm font-medium">
            Read article
            <Icon
              name="arrow-right"
              className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
            />
          </span>
        </div>
      </NextLink>
    </Card>
  )
}
