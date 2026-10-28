'use client'

import { useRef, useState } from 'react'
import { useGsapScope } from '@/components/motion/use-gsap-scope'
import { useReducedMotion } from '@/components/motion/use-reduced-motion'
import { ButtonLink } from '@/components/ui/button'
import type { StoryRef } from '@/lib/sanity/types'
import { storyByline, storyDate, storyParagraphs } from './story-utils'

/**
 * One story, read aloud as you scroll. The left column holds who wrote it and
 * a progress line that fills as you read; on the right the letter's paragraphs
 * sit dim and come into focus one at a time as they reach the middle of the
 * screen. Plain scrolling, nothing pinned. Pick another story and the
 * letter swaps.
 */
export function StoryReadAlong({ stories }: { stories: StoryRef[] }) {
  const reduced = useReducedMotion()
  const ref = useRef<HTMLElement>(null)
  const [index, setIndex] = useState(0)
  const story = stories[index]
  const paragraphs = story ? storyParagraphs(story) : []

  useGsapScope(
    ref,
    ({ gsap, ScrollTrigger }) => {
      const q = gsap.utils.selector(ref.current!)
      const paras = q('[data-p]')
      const fill = q('[data-fill]')[0]
      const letter = q('[data-letter]')[0]
      gsap.set(paras, { opacity: 0.18, y: 18 })
      gsap.set(fill, { scaleY: 0, transformOrigin: 'top center' })

      paras.forEach((p) => {
        ScrollTrigger.create({
          trigger: p,
          start: 'top 68%',
          end: 'bottom 38%',
          onToggle: (self) =>
            gsap.to(p, {
              opacity: self.isActive ? 1 : 0.18,
              y: self.isActive ? 0 : self.direction > 0 ? -6 : 18,
              duration: 0.6,
              ease: 'power3.out',
              overwrite: true,
            }),
        })
      })
      // the first paragraph is lit as soon as the letter arrives
      ScrollTrigger.create({
        trigger: letter,
        start: 'top 80%',
        once: true,
        onEnter: () => gsap.to(paras[0], { opacity: 1, y: 0, duration: 0.9, ease: 'expo.out' }),
      })
      gsap.to(fill, {
        scaleY: 1,
        ease: 'none',
        scrollTrigger: { trigger: letter, start: 'top 60%', end: 'bottom 55%', scrub: true },
      })
    },
    !reduced && !!story,
    [index],
  )

  if (!story) return null

  return (
    <section ref={ref} className="bg-subtle px-4 py-20 sm:px-[clamp(32px,5vw,80px)] sm:py-28">
      <div className="mx-auto grid max-w-[1240px] gap-12 lg:grid-cols-12 lg:gap-16">
        <aside className="lg:col-span-4">
          <div className="lg:sticky lg:top-32">
            <h2 className="text-fg-default flex items-center gap-2 text-[11px] font-medium tracking-[0.12em] uppercase sm:text-[12px]">
              <span
                aria-hidden="true"
                className="bg-accent-orchid inline-block h-2 w-2 rounded-full"
              />
              Community stories
            </h2>

            <p className="font-display text-fg-heading mt-6 text-[clamp(28px,2.8vw,40px)] leading-[1.08] font-semibold tracking-[-0.02em] text-balance">
              {story.title}
            </p>

            <p className="text-fg mt-5 text-base">{storyByline(story)}</p>
            <p className="text-fg-muted mt-1 text-sm">
              {[story.country, storyDate(story)].filter(Boolean).join(' · ')}
            </p>

            {story.themes && story.themes.length > 0 && (
              <ul className="mt-5 flex flex-wrap gap-2">
                {story.themes.map((t) => (
                  <li
                    key={t}
                    className="text-fg-muted border-default rounded-full border px-3 py-1 text-xs capitalize"
                  >
                    {t}
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-8 flex items-stretch gap-4">
              <div
                aria-hidden="true"
                className="bg-fg/15 relative w-[3px] shrink-0 overflow-hidden rounded-full"
              >
                <div data-fill className="bg-fg-heading absolute inset-0" />
              </div>
              <div className="flex flex-wrap items-center gap-3">
                {story.slug && (
                  <ButtonLink
                    href={`/connect/stories/${story.slug.current}`}
                    variant="solid"
                    size="sm"
                  >
                    Read the full story
                  </ButtonLink>
                )}
                <ButtonLink href="/connect/share-your-story" variant="outline" size="sm">
                  Share yours
                </ButtonLink>
              </div>
            </div>

            {stories.length > 1 && (
              <div className="mt-10">
                <p className="text-fg-muted text-xs font-medium tracking-[0.14em] uppercase">
                  More letters
                </p>
                <ul className="mt-3 flex flex-col gap-1">
                  {stories.map((s, i) => (
                    <li key={s._id}>
                      <button
                        type="button"
                        aria-current={i === index}
                        onClick={() => setIndex(i)}
                        className={`focus-visible:ring-focus-ring rounded-input w-full py-1.5 text-left text-sm transition-colors focus-visible:ring-2 focus-visible:outline-none ${
                          i === index
                            ? 'text-fg-heading font-medium'
                            : 'text-fg-muted hover:text-fg'
                        }`}
                      >
                        {i === index && <span aria-hidden="true">— </span>}
                        {s.title}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </aside>

        <div key={story._id} data-letter className="lg:col-span-8 lg:pt-2">
          {story.contentWarning && (
            <p className="text-fg-muted border-default mb-10 inline-block rounded-full border px-4 py-1.5 text-sm">
              Content note: {story.contentWarning}
            </p>
          )}
          {story.pullQuote && (
            <p
              data-p
              className="font-display text-fg-heading mb-14 text-[clamp(30px,4vw,60px)] leading-[1.06] font-medium tracking-[-0.03em] text-balance"
            >
              &ldquo;{story.pullQuote}&rdquo;
            </p>
          )}
          <div className="flex flex-col gap-[clamp(40px,9vh,96px)] pb-[18vh]">
            {paragraphs.map((p, i) => (
              <p
                key={i}
                data-p
                className="text-fg max-w-[34ch] text-[clamp(21px,2.1vw,30px)] leading-[1.4] sm:max-w-[40ch]"
              >
                {p}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
