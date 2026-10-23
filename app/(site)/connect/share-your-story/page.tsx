import type { Metadata } from 'next'
import { ShareStoryForm } from '@/components/connect/share-story-form'
import { Hero } from '@/components/blocks/hero'
import { Reveal } from '@/components/motion/reveal'
import { RichText } from '@/components/portable-text'
import { getShareStoryPage } from '@/lib/sanity/content'
import { seoToMetadata } from '@/lib/seo'

export async function generateMetadata(): Promise<Metadata> {
  const page = await getShareStoryPage()
  return seoToMetadata(page?.seo, { title: 'Share Your Story' }, '/connect/share-your-story')
}

export default async function ShareYourStoryPage() {
  const page = await getShareStoryPage()
  if (!page) return null

  return (
    <>
      <Hero data={page.hero} animation="subtle" />

      <div className="mx-auto grid max-w-5xl gap-10 px-4 py-16 sm:px-8 md:grid-cols-[1fr_1.3fr]">
        <Reveal>
          {page.intro && <RichText value={page.intro} />}

          {page.whatHappensNext.length > 0 && (
            <div className="mt-8 space-y-4">
              <p className="text-fg-subtle text-sm font-semibold tracking-wide uppercase">
                What happens next
              </p>
              {page.whatHappensNext.map((step, i) => (
                <div key={i} className="flex gap-3">
                  <span className="bg-muted text-fg flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-xs font-semibold">
                    {i + 1}
                  </span>
                  <div>
                    <p className="text-fg-heading font-medium">{step.title}</p>
                    {step.body && <p className="text-fg-muted text-sm">{step.body}</p>}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="rounded-card bg-muted text-fg-muted mt-8 p-4 text-sm">
            <RichText value={page.consentText} />
            {page.privacyNote && <p className="mt-2">{page.privacyNote}</p>}
          </div>
        </Reveal>

        <Reveal>
          {page.submissionsOpen ? (
            <ShareStoryForm successMessage={page.successMessage} />
          ) : (
            <div className="rounded-card border-default text-fg-muted border p-6 text-center">
              {page.closedMessage || 'Submissions are currently closed. Please check back soon.'}
            </div>
          )}
        </Reveal>
      </div>
    </>
  )
}
