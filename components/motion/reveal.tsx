'use client'

import { motion, type Variants } from 'motion/react'
import type { ReactNode } from 'react'
import { useReducedMotion } from './use-reduced-motion'

const variants: Variants = {
  hidden: { opacity: 0, filter: 'blur(8px)', y: 6 },
  visible: { opacity: 1, filter: 'blur(0px)', y: 0 },
}

/**
 * Subtle section-entry animation (Section 4): blur focus — arrives
 * softly out of focus, settles sharp. Children can be staggered by
 * wrapping them in <Stagger> and giving each a Reveal.
 */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode
  delay?: number
  className?: string
}) {
  const reducedMotion = useReducedMotion()

  if (reducedMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      variants={variants}
      transition={{ duration: 0.7, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}

export function Stagger({
  children,
  staggerDelay = 0.06,
  className,
}: {
  children: ReactNode
  staggerDelay?: number
  className?: string
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      variants={{ visible: { transition: { staggerChildren: staggerDelay } } }}
    >
      {children}
    </motion.div>
  )
}
