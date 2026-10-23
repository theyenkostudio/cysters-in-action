import { describe, expect, it } from 'vitest'
import { resolveAuthorName, stories } from './stories'

describe('resolveAuthorName', () => {
  it('never returns a name for an anonymous story, even if authorName is set on the fixture', () => {
    const anonymous = stories.filter((s) => s.isAnonymous)
    expect(anonymous.length).toBeGreaterThan(0)
    for (const story of anonymous) {
      expect(resolveAuthorName(story)).toBeUndefined()
    }
  })

  it('returns the display name for a non-anonymous story', () => {
    const named = stories.find((s) => !s.isAnonymous)
    expect(named).toBeDefined()
    expect(resolveAuthorName(named!)).toBe(named!.authorName)
  })
})
