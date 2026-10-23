import { RichText } from '@/components/portable-text'
import type { RichTextValue } from '@/lib/sanity/types'
import { cn } from '@/lib/utils'

export function RichTextBlock({
  data,
}: {
  data: { content: RichTextValue; width?: 'narrow' | 'wide' }
}) {
  return (
    <section className="px-4 py-12 sm:px-8">
      <RichText
        value={data.content}
        className={cn('mx-auto', data.width === 'wide' ? 'max-w-4xl' : 'max-w-2xl')}
      />
    </section>
  )
}
