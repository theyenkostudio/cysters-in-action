// @vitest-environment node
import { afterEach, describe, expect, it, vi } from 'vitest'
import { verifyTurnstile } from './turnstile'

describe('verifyTurnstile', () => {
  afterEach(() => {
    delete process.env.TURNSTILE_SECRET_KEY
    vi.unstubAllGlobals()
  })

  it('skips verification (returns true) when TURNSTILE_SECRET_KEY is unset', async () => {
    delete process.env.TURNSTILE_SECRET_KEY
    await expect(verifyTurnstile('')).resolves.toBe(true)
  })

  it('calls the Cloudflare siteverify endpoint when a secret is configured', async () => {
    process.env.TURNSTILE_SECRET_KEY = 'secret'
    const fetchMock = vi.fn().mockResolvedValue({ json: async () => ({ success: true }) })
    vi.stubGlobal('fetch', fetchMock)

    const result = await verifyTurnstile('a-token')

    expect(result).toBe(true)
    expect(fetchMock).toHaveBeenCalledWith(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      expect.objectContaining({ method: 'POST' }),
    )
  })

  it('returns false when Cloudflare reports failure', async () => {
    process.env.TURNSTILE_SECRET_KEY = 'secret'
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ json: async () => ({ success: false }) }))

    await expect(verifyTurnstile('a-token')).resolves.toBe(false)
  })

  it('returns false for an empty token when a secret is configured', async () => {
    process.env.TURNSTILE_SECRET_KEY = 'secret'
    await expect(verifyTurnstile('')).resolves.toBe(false)
  })
})
