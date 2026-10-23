import { NewsletterForm } from '@/components/forms/newsletter-form'
import { Reveal } from '@/components/motion/reveal'
import { cn } from '@/lib/utils'

export type NewsletterBlockData = {
  heading?: string
  body?: string
  buttonLabel?: string
  successMessage?: string
  variant?: 'band' | 'card'
}

export function NewsletterBlock({ data }: { data: NewsletterBlockData }) {
  const isBand = data.variant !== 'card'

  return (
    <section
      data-theme={isBand ? 'brand' : undefined}
      className={cn('px-4 py-16 sm:px-8', isBand && 'bg-canvas')}
    >
      <Reveal
        className={cn(
          'mx-auto max-w-xl text-center',
          !isBand && 'rounded-card border-default bg-canvas border p-10',
        )}
      >
        <h2 className="font-display text-fg-heading text-2xl font-semibold sm:text-3xl">
          {data.heading ?? 'Join the newsletter'}
        </h2>
        {data.body && <p className="text-fg-muted mt-3">{data.body}</p>}
        <div className="mt-6">
          <NewsletterForm
            source="newsletterBlock"
            buttonLabel={data.buttonLabel}
            successMessage={data.successMessage}
          />
        </div>
      </Reveal>
    </section>
  )
}
