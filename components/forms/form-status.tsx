'use client'

import { motion } from 'motion/react'

/** Success state with a draw-on tick (Section 4, Forms motion). */
export function FormSuccess({ message }: { message: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-card bg-success-bg text-success-text flex items-start gap-3 p-4"
    >
      <svg viewBox="0 0 24 24" className="mt-0.5 h-5 w-5 flex-shrink-0" fill="none" aria-hidden>
        <motion.path
          d="M4 12.5l5 5L20 6.5"
          stroke="currentColor"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        />
      </svg>
      <p>{message}</p>
    </motion.div>
  )
}

export function FormError({ message }: { message: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      role="alert"
      className="rounded-card bg-error-bg text-error-text p-4 text-sm"
    >
      {message}
    </motion.div>
  )
}
