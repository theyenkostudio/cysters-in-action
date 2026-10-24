// @vitest-environment node
import { describe, expect, it, vi, afterEach } from 'vitest'
import { assertAboutStatsReady, assertHomePageReady } from './content-guards'
import type { AboutStatValue, PageBuilderBlock } from './types'

const readyStat: AboutStatValue = {
  value: 120,
  decimals: 0,
  plusSign: true,
  label: 'Community members',
  source: 'Internal membership count, reviewed 2026-01-01',
}

describe('assertAboutStatsReady', () => {
  it('does not throw for stats with a real source and no _placeholder flag', () => {
    expect(() => assertAboutStatsReady([readyStat])).not.toThrow()
  })

  it('throws for a stat still marked _placeholder: true', () => {
    expect(() => assertAboutStatsReady([{ ...readyStat, _placeholder: true }])).toThrow(
      /_placeholder/,
    )
  })

  it('throws for a stat with an empty source', () => {
    expect(() => assertAboutStatsReady([{ ...readyStat, source: '' }])).toThrow(/source/)
  })

  it('throws for a stat with a whitespace-only source', () => {
    expect(() => assertAboutStatsReady([{ ...readyStat, source: '   ' }])).toThrow(/source/)
  })

  it('does nothing when stats is undefined', () => {
    expect(() => assertAboutStatsReady(undefined)).not.toThrow()
  })
})

describe('assertHomePageReady', () => {
  const originalEnv = process.env.NODE_ENV

  afterEach(() => {
    vi.stubEnv('NODE_ENV', originalEnv ?? 'test')
  })

  const sectionsWithPlaceholderStat: PageBuilderBlock[] = [
    {
      _type: 'aboutIntroBlock',
      _key: 'home-about-intro',
      stats: [{ ...readyStat, _placeholder: true }],
    },
  ]

  it('is a no-op outside production, even with placeholder stats', () => {
    vi.stubEnv('NODE_ENV', 'development')
    expect(() => assertHomePageReady(sectionsWithPlaceholderStat)).not.toThrow()
  })

  it('throws in production when the homepage still ships a placeholder stat', () => {
    vi.stubEnv('NODE_ENV', 'production')
    expect(() => assertHomePageReady(sectionsWithPlaceholderStat)).toThrow(/_placeholder/)
  })

  it('does not throw in production once every stat is real', () => {
    vi.stubEnv('NODE_ENV', 'production')
    const sections: PageBuilderBlock[] = [
      { _type: 'aboutIntroBlock', _key: 'home-about-intro', stats: [readyStat] },
    ]
    expect(() => assertHomePageReady(sections)).not.toThrow()
  })

  it('is a no-op when there is no aboutIntroBlock section at all', () => {
    vi.stubEnv('NODE_ENV', 'production')
    expect(() => assertHomePageReady([{ _type: 'heroBlock', _key: 'hero' }])).not.toThrow()
  })
})
