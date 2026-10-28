'use client'

import { motion } from 'motion/react'
import Image from 'next/image'
import { useReducedMotion } from '@/components/motion/use-reduced-motion'
import type { SanityImage } from '@/lib/sanity/types'

/**
 * Width-expand reveal for the "Our story" photo: scaleX (not a layout
 * `width` tween) so the browser only repaints a transform, not every
 * ancestor's layout each frame. Starts collapsed to a sliver and grows from
 * the centre outward, evenly, both edges moving at once — not anchored to
 * one side, which reads as the image being dragged/stretched open rather
 * than spreading.
 */
export function StoryImage({ image }: { image: SanityImage }) {
  const reducedMotion = useReducedMotion()

  return (
    <motion.div
      className="rounded-card relative aspect-[4/3] overflow-hidden"
      style={{ transformOrigin: 'center' }}
      initial={reducedMotion ? undefined : { scaleX: 0.02, opacity: 0 }}
      whileInView={reducedMotion ? undefined : { scaleX: 1, opacity: 1 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ type: 'tween', duration: 0.7, ease: 'easeInOut' }}
    >
      <Image
        src={image.url}
        alt={image.alt}
        fill
        sizes="(min-width: 768px) 50vw, 100vw"
        className="object-cover"
      />
    </motion.div>
  )
}
