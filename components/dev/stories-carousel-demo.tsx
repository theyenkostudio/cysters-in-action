'use client'

import useEmblaCarousel from 'embla-carousel-react'
import { motion } from 'motion/react'
import { useCallback, useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'

// Mock cards only — the `story` schema ships in Phase 4. Content is clearly
// placeholder, not a real community submission.
const MOCK_STORIES = [
  { id: 1, quote: 'I finally stopped feeling like I was making this up.', author: 'Anonymous' },
  {
    id: 2,
    quote: 'The checklist made my first appointment so much less scary.',
    author: 'Anonymous',
  },
  {
    id: 3,
    quote: 'Reading someone else’s story made mine feel less isolating.',
    author: 'Anonymous',
  },
  {
    id: 4,
    quote: 'My doctor finally took me seriously after I brought my questions in writing.',
    author: 'Anonymous',
  },
]

export function StoriesCarouselDemo() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'center' })
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
          {MOCK_STORIES.map((story, i) => (
            <div key={story.id} className="min-w-0 flex-[0_0_80%] px-3 sm:flex-[0_0_50%]">
              <motion.div
                className="rounded-card border-default bg-canvas border p-8 text-center"
                animate={{
                  scale: i === selectedIndex ? 1 : 0.92,
                  opacity: i === selectedIndex ? 1 : 0.6,
                }}
                transition={{ duration: 0.4 }}
                style={{ clipPath: 'inset(0 0 0 0 round 24px)' }}
              >
                <motion.p
                  aria-hidden
                  className="font-display text-accent-orchid text-4xl"
                  animate={{ scale: i === selectedIndex ? 1 : 0.8 }}
                >
                  “
                </motion.p>
                <p className="font-display text-fg-heading text-xl">{story.quote}</p>
                <p className="text-fg-muted mt-3 text-sm">{story.author}</p>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-4 flex justify-center gap-2">
        <Button type="button" variant="ghost" onClick={() => emblaApi?.scrollPrev()}>
          Previous
        </Button>
        <Button type="button" variant="ghost" onClick={() => emblaApi?.scrollNext()}>
          Next
        </Button>
      </div>
    </div>
  )
}
