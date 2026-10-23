'use client'

import useEmblaCarousel from 'embla-carousel-react'
import { motion } from 'motion/react'
import { useCallback, useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { useReducedMotion } from '@/components/motion/use-reduced-motion'
import type { StoryRef } from '@/lib/sanity/types'

/** Moment 5: draggable carousel with momentum; the active card scales up,
 * quote marks animate, image reveals with clip-path. Falls back to a plain
 * swipeable row (Embla alone, no scale/clip-path motion) under reduced motion. */
export function StoriesCarousel({
  stories,
  exaggerated = true,
}: {
  stories: StoryRef[]
  exaggerated?: boolean
}) {
  const reducedMotion = useReducedMotion()
  const animated = exaggerated && !reducedMotion
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: stories.length > 1, align: 'center' })
  const [selectedIndex, setSelectedIndex] = useState(0)

  const onSelect = useCallback(() => {
    if (emblaApi) setSelectedIndex(emblaApi.selectedScrollSnap())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    emblaApi.on('select', onSelect)
    return () => {
      emblaApi.off('select', onSelect)
    }
  }, [emblaApi, onSelect])

  return (
    <div>
      <div ref={emblaRef} className="overflow-hidden">
        <div className="flex">
          {stories.map((story, i) => (
            <div key={story._id} className="min-w-0 flex-[0_0_85%] px-3 sm:flex-[0_0_55%]">
              <motion.div
                className="rounded-card border-default bg-canvas border p-8 text-center"
                animate={
                  animated
                    ? {
                        scale: i === selectedIndex ? 1 : 0.92,
                        opacity: i === selectedIndex ? 1 : 0.6,
                      }
                    : undefined
                }
                transition={{ duration: 0.4 }}
                style={{ clipPath: 'inset(0 0 0 0 round 24px)' }}
              >
                <motion.p
                  aria-hidden
                  className="font-display text-accent-orchid text-4xl"
                  animate={animated ? { scale: i === selectedIndex ? 1 : 0.8 } : undefined}
                >
                  “
                </motion.p>
                <p className="font-display text-fg-heading text-xl">
                  {story.pullQuote ?? story.title}
                </p>
                <p className="text-fg-muted mt-3 text-sm">
                  {story.isAnonymous ? 'Anonymous' : story.authorName}
                </p>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
      {stories.length > 1 && (
        <div className="mt-4 flex justify-center gap-2">
          <Button type="button" variant="ghost" onClick={() => emblaApi?.scrollPrev()}>
            Previous
          </Button>
          <Button type="button" variant="ghost" onClick={() => emblaApi?.scrollNext()}>
            Next
          </Button>
        </div>
      )}
    </div>
  )
}
