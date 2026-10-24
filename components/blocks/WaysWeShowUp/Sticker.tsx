import { Heart } from 'lucide-react'
import { forwardRef } from 'react'
import type { PillarKey } from '@/lib/sanity/types'
import { PILLAR_SOLID_VAR } from './pillar-colors'

export const Sticker = forwardRef<HTMLDivElement, { pillar: PillarKey }>(function Sticker(
  { pillar },
  ref,
) {
  return (
    <div
      ref={ref}
      aria-hidden="true"
      data-sticker
      // No rotate class here — GSAP owns the `rotate` property for this
      // element entirely from mount (see useShuffleTimeline's initial
      // gsap.set), the same "don't mix a CSS transform with a later GSAP
      // tween of the same property" rule as the rest of this block.
      className="absolute top-0 right-0 z-20 flex h-12 w-12 translate-x-1/4 -translate-y-1/3 items-center justify-center rounded-full shadow-lg will-change-transform"
      style={{ backgroundColor: PILLAR_SOLID_VAR[pillar] }}
    >
      <Heart className="h-5 w-5 fill-white text-white" strokeWidth={1.5} />
    </div>
  )
})
