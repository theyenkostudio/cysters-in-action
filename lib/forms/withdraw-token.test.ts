// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { createWithdrawToken, verifyWithdrawToken } from './withdraw-token'

describe('withdraw token', () => {
  it('verifies a token it created for the same story id', () => {
    const token = createWithdrawToken('story-123')
    expect(verifyWithdrawToken('story-123', token)).toBe(true)
  })

  it('rejects a token created for a different story id', () => {
    const token = createWithdrawToken('story-123')
    expect(verifyWithdrawToken('story-456', token)).toBe(false)
  })

  it('rejects a tampered token', () => {
    const token = createWithdrawToken('story-123')
    expect(verifyWithdrawToken('story-123', token.slice(0, -1) + 'x')).toBe(false)
  })
})
