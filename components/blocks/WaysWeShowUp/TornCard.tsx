import Image from 'next/image'
import { forwardRef } from 'react'
import type { SanityImage } from '@/lib/sanity/types'
import { tornCardClipPoints } from './torn-edge'
import { DistressedWord } from './DistressedWord'

export type TornCardProps = {
  index: number
  image: SanityImage
  word: string
  priority?: boolean
}

/**
 * One photo card: black-and-white photo with torn top/bottom edges (an SVG
 * clip-path, same seed -> same tear every load), a thin paper-coloured
 * backing peeking out from under the tear, a drop shadow that follows the
 * clipped silhouette (not a rectangle), and the big distressed word on top.
 *
 * Purely presentational/static — CardStack positions instances of this via
 * the forwarded ref; it never animates itself.
 */
export const TornCard = forwardRef<HTMLDivElement, TornCardProps>(function TornCard(
  { index, image, word, priority },
  ref,
) {
  const clipId = `torn-edge-${index}`
  const clipPoints = tornCardClipPoints(index)

  return (
    <div
      ref={ref}
      data-card-index={index}
      className="absolute inset-0 will-change-transform"
      style={{ filter: 'drop-shadow(0 18px 28px rgb(0 0 0 / 0.28))' }}
    >
      <svg width="0" height="0" aria-hidden="true" focusable="false" className="absolute">
        <defs>
          <clipPath id={clipId} clipPathUnits="objectBoundingBox">
            <polygon points={clipPoints} />
          </clipPath>
        </defs>
      </svg>

      {/* Off-white paper backing, very slightly larger than the photo, so a
          thin border peeks out all along the torn edge. */}
      <div
        aria-hidden="true"
        className="bg-canvas absolute inset-0 scale-[1.015]"
        style={{ clipPath: `url(#${clipId})` }}
      />

      <div className="absolute inset-0 overflow-hidden" style={{ clipPath: `url(#${clipId})` }}>
        <Image
          src={image.url}
          alt={image.alt ?? ''}
          fill
          priority={priority}
          sizes="(min-width: 768px) 520px, 88vw"
          className="object-cover"
          style={{ filter: 'grayscale(1) contrast(1.15)' }}
        />
        <div
          data-card-word
          className="absolute inset-0 flex items-center justify-center overflow-hidden px-4"
        >
          <DistressedWord word={word} />
        </div>
      </div>
    </div>
  )
})
