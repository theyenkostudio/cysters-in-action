'use client'

import { motion } from 'motion/react'

/** Field error with a 3px shake (Section 4, Forms motion). */
export function FieldError({ message }: { message?: string }) {
  if (!message) return null

  return (
    <motion.p
      role="alert"
      initial={{ x: 0 }}
      animate={{ x: [0, -3, 3, -3, 3, 0] }}
      transition={{ duration: 0.3 }}
      className="text-error-text mt-1 text-sm"
    >
      {message}
    </motion.p>
  )
}
