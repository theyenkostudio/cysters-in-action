import { describe, expect, it } from 'vitest'
import { isPastEvent } from './events'

describe('isPastEvent', () => {
  it('is false for a start time in the future', () => {
    const future = new Date(Date.now() + 60 * 60 * 1000).toISOString()
    expect(isPastEvent(future)).toBe(false)
  })

  it('is true for a start time in the past', () => {
    const past = new Date(Date.now() - 60 * 60 * 1000).toISOString()
    expect(isPastEvent(past)).toBe(true)
  })
})
