// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from 'vitest'

describe('checkRateLimit (in-memory fallback, no Upstash configured)', () => {
  beforeEach(() => {
    vi.resetModules()
    delete process.env.UPSTASH_REDIS_REST_URL
    delete process.env.UPSTASH_REDIS_REST_TOKEN
  })

  it('allows the first 5 submissions for a key and blocks the 6th', async () => {
    const { checkRateLimit } = await import('./rate-limit')
    const key = 'test:allow-then-block'

    for (let i = 0; i < 5; i++) {
      expect(await checkRateLimit(key)).toBe(true)
    }
    expect(await checkRateLimit(key)).toBe(false)
  })

  it('tracks different keys independently', async () => {
    const { checkRateLimit } = await import('./rate-limit')

    for (let i = 0; i < 5; i++) await checkRateLimit('test:key-a')
    expect(await checkRateLimit('test:key-a')).toBe(false)
    expect(await checkRateLimit('test:key-b')).toBe(true)
  })
})

describe('hashIp', () => {
  it('produces a stable, non-reversible-looking hash', async () => {
    const { hashIp } = await import('./rate-limit')
    const a = await hashIp('203.0.113.1')
    const b = await hashIp('203.0.113.1')
    const c = await hashIp('203.0.113.2')

    expect(a).toBe(b)
    expect(a).not.toBe(c)
    expect(a).not.toContain('203.0.113.1')
  })
})
