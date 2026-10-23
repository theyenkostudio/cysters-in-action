// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

describe('getEmailProvider', () => {
  beforeEach(() => {
    vi.resetModules()
    delete process.env.EMAIL_PROVIDER
    delete process.env.BREVO_API_KEY
    delete process.env.BREVO_LIST_ID
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('defaults to NullProvider (logs only) when EMAIL_PROVIDER is unset', async () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    const { getEmailProvider } = await import('./email-provider')

    const provider = getEmailProvider()
    await provider.subscribe({ email: 'a@example.com', tags: ['footer'], source: 'footer' })

    expect(logSpy).toHaveBeenCalledWith(
      '[email-provider:null] subscribe',
      expect.objectContaining({ email: 'a@example.com' }),
    )
  })

  it('falls back to NullProvider with a warning when EMAIL_PROVIDER=brevo but credentials are missing', async () => {
    process.env.EMAIL_PROVIDER = 'brevo'
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    const { getEmailProvider } = await import('./email-provider')

    const provider = getEmailProvider()
    await provider.subscribe({ email: 'a@example.com', tags: [], source: 'footer' })

    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('falling back to NullProvider'))
    expect(logSpy).toHaveBeenCalledWith('[email-provider:null] subscribe', expect.anything())
  })

  it('returns the same cached provider instance on repeated calls', async () => {
    const { getEmailProvider } = await import('./email-provider')
    expect(getEmailProvider()).toBe(getEmailProvider())
  })
})
