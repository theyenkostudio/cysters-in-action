'use client'

import { motion, useScroll, useTransform } from 'motion/react'
import Image from 'next/image'
import { useRef, useState } from 'react'
import { ButtonLink } from '@/components/ui/button'
import { Eyebrow } from '@/components/ui/eyebrow'
import { Parallax } from '@/components/motion/parallax'
import { SplitHeadline } from '@/components/motion/split-headline'
import { useReducedMotion } from '@/components/motion/use-reduced-motion'
import { resolveHref } from '@/lib/link'
import type { HeroValue } from '@/lib/sanity/types'
import { cn } from '@/lib/utils'

const HEIGHT_CLASSES: Record<string, string> = {
  full: 'min-h-screen',
  large: 'min-h-[85vh]',
  medium: 'min-h-[60vh]',
}

const OVERLAY_GRADIENTS: Record<string, string> = {
  left: 'linear-gradient(90deg, var(--plum-950) 0%, transparent 70%)',
  bottom: 'linear-gradient(to top, var(--plum-950) 0%, transparent 70%)',
  full: 'linear-gradient(180deg, color-mix(in srgb, var(--plum-950) 60%, transparent) 0%, var(--plum-950) 100%)',
}

function getSaveData() {
  if (typeof navigator === 'undefined') return false
  const connection = (navigator as unknown as { connection?: { saveData?: boolean } }).connection
  return Boolean(connection?.saveData)
}

/** Uses the Save-Data header/hint, when available, to skip loading video. */
function useSaveData() {
  const [saveData] = useState(getSaveData)
  return saveData
}

export function Hero({
  data,
  animation = 'subtle',
}: {
  data: HeroValue
  animation?: 'none' | 'subtle' | 'exaggerated'
}) {
  const reducedMotion = useReducedMotion()
  const saveData = useSaveData()
  const exaggerated = animation === 'exaggerated' && !reducedMotion
  const media = data.heroMedia
  const showVideo = media?.mediaType === 'video' && media.videoUrl && !reducedMotion && !saveData

  const sectionRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })
  const baseOverlay = data.overlayStrength ?? 50
  const overlayOpacity = useTransform(
    scrollYProgress,
    [0, 1],
    [baseOverlay / 100, Math.min(baseOverlay + 25, 90) / 100],
  )

  return (
    <section
      ref={sectionRef}
      data-theme="inverse"
      className={cn(
        // Nav is `position: sticky`, which still reserves its own box in
        // normal flow — this negative margin pulls the hero up to collapse
        // through <main>'s top edge so the hero's background (not plain
        // canvas) fills the area the floating nav pill sits over.
        'bg-canvas relative -mt-20 flex items-end overflow-hidden',
        HEIGHT_CLASSES[data.height ?? 'large'],
      )}
    >
      <Parallax className="absolute inset-0">
        <motion.div
          initial={exaggerated ? { scale: 1.15 } : undefined}
          animate={exaggerated ? { scale: 1 } : undefined}
          transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0"
        >
          {showVideo ? (
            <video
              className="h-full w-full object-cover"
              autoPlay
              muted={media.autoplayMuted ?? true}
              loop={media.loop ?? true}
              playsInline
              poster={media.poster?.url}
            >
              <source src={media.videoUrl} type="video/mp4" />
              {media.captionsUrl && <track kind="captions" src={media.captionsUrl} />}
            </video>
          ) : media?.image ? (
            <Image
              src={media.image.url}
              alt={media.image.alt}
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          ) : null}
        </motion.div>
      </Parallax>

      <motion.div
        className="pointer-events-none absolute inset-0"
        style={{
          background: OVERLAY_GRADIENTS[data.overlayDirection ?? 'left'],
          opacity: overlayOpacity,
        }}
      />

      <div
        className={cn(
          'relative z-10 w-full px-4 pt-32 pb-16 sm:px-8',
          data.textAlign === 'center' && 'text-center',
        )}
      >
        <div
          className={cn(
            'mx-auto max-w-5xl',
            data.textAlign === 'center' && 'flex flex-col items-center',
          )}
        >
          {data.eyebrow && (
            <motion.div
              initial={exaggerated ? { opacity: 0, y: 8 } : undefined}
              animate={exaggerated ? { opacity: 1, y: 0 } : undefined}
              transition={{ delay: 0.9, duration: 0.5 }}
            >
              <Eyebrow>{data.eyebrow}</Eyebrow>
            </motion.div>
          )}

          {exaggerated ? (
            <SplitHeadline
              text={data.headline}
              className="font-display text-fg mt-4 text-4xl leading-[1.05] font-semibold sm:text-6xl md:text-7xl"
            />
          ) : (
            <h1 className="font-display text-fg mt-4 text-4xl leading-[1.05] font-semibold whitespace-pre-line sm:text-6xl md:text-7xl">
              {data.headline}
            </h1>
          )}

          {data.subline && (
            <motion.p
              initial={exaggerated ? { opacity: 0, y: 12 } : undefined}
              animate={exaggerated ? { opacity: 1, y: 0 } : undefined}
              transition={{ delay: 1.1, duration: 0.6 }}
              className="text-fg-muted mt-5 max-w-xl text-lg"
            >
              {data.subline}
            </motion.p>
          )}

          {data.ctas && data.ctas.length > 0 && (
            <motion.div
              initial={exaggerated ? { opacity: 0, y: 12 } : undefined}
              animate={exaggerated ? { opacity: 1, y: 0 } : undefined}
              transition={{ delay: 1.3, duration: 0.6 }}
              className="mt-8 flex flex-wrap gap-3"
            >
              {data.ctas.map((cta, i) => (
                <ButtonLink
                  key={i}
                  href={resolveHref(cta.link)}
                  variant={cta.style === 'outline' ? 'outline' : 'on-dark'}
                >
                  {cta.link.label}
                </ButtonLink>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  )
}
