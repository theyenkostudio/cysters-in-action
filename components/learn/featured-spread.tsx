import Image from 'next/image'
import NextLink from 'next/link'
import { Icon } from '@/components/ui/icon'
import { internalHref } from '@/lib/link'
import type { ArticleRef } from '@/lib/sanity/types'
import { ARTICLE_TYPE_LABELS } from './article-type-badge'

/**
 * One large lead story plus up to two smaller ones beside it — an editorial
 * spread instead of a uniform card grid, so "Featured" reads differently
 * from the plain article grids/lists elsewhere on the Learn hub.
 */
export function FeaturedSpread({ articles }: { articles: ArticleRef[] }) {
  const [lead, ...rest] = articles
  if (!lead) return null

  const leadHref = internalHref({ _type: 'article', slug: lead.slug, category: lead.category })

  return (
    <div className="mt-6 grid gap-7 lg:grid-cols-[1.55fr_1fr]">
      <NextLink
        href={leadHref}
        data-theme="inverse"
        className="rounded-card bg-deep relative flex min-h-[380px] flex-col justify-end overflow-hidden p-9"
      >
        {lead.mainImage && (
          <Image
            src={lead.mainImage.url}
            alt={lead.mainImage.alt}
            fill
            sizes="(min-width: 1024px) 60vw, 100vw"
            className="object-cover"
          />
        )}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent"
        />
        <div className="relative">
          <span className="text-[11px] font-semibold tracking-[0.1em] text-white/70 uppercase">
            {ARTICLE_TYPE_LABELS[lead.articleType]}
          </span>
          <h3 className="font-display mt-3 max-w-[16ch] text-[clamp(26px,3vw,36px)] font-normal text-white">
            {lead.title}
          </h3>
          {lead.standfirst && (
            <p className="mt-3 max-w-[40ch] text-sm text-white/85">{lead.standfirst}</p>
          )}
          <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-white">
            Read article
            <Icon name="arrow-right" className="h-3.5 w-3.5" />
          </span>
        </div>
      </NextLink>

      {rest.length > 0 && (
        <div className="flex flex-col gap-4">
          {rest.map((article) => {
            const href = internalHref({
              _type: 'article',
              slug: article.slug,
              category: article.category,
            })
            return (
              <NextLink
                key={article._id}
                href={href}
                className="border-default bg-canvas rounded-card flex flex-1 gap-4 border p-4"
              >
                {article.mainImage && (
                  <div className="rounded-input relative h-20 w-20 shrink-0 overflow-hidden">
                    <Image
                      src={article.mainImage.url}
                      alt={article.mainImage.alt}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="flex flex-col justify-center">
                  <span className="text-orchid-text text-[10.5px] font-semibold tracking-[0.09em] uppercase">
                    {ARTICLE_TYPE_LABELS[article.articleType]}
                  </span>
                  <h3 className="font-display text-fg-heading mt-1.5 text-lg font-normal">
                    {article.title}
                  </h3>
                  {article.standfirst && (
                    <p className="text-fg-muted mt-1 text-sm">{article.standfirst}</p>
                  )}
                </div>
              </NextLink>
            )
          })}
        </div>
      )}
    </div>
  )
}
