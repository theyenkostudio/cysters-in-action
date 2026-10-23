import NextLink from 'next/link'
import { Card, CardImage } from '@/components/ui/card'
import type { CategoryRef } from '@/lib/sanity/types'

export function CategoryCard({ category }: { category: CategoryRef }) {
  return (
    <Card>
      <NextLink href={`/learn/${category.slug.current}`} className="block">
        {category.image && <CardImage src={category.image.url} alt={category.image.alt} />}
        <div className="p-5">
          <h3 className="text-fg-heading font-display text-lg font-semibold">{category.title}</h3>
          {category.description && (
            <p className="text-fg-muted mt-2 text-sm">{category.description}</p>
          )}
        </div>
      </NextLink>
    </Card>
  )
}
