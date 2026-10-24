import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { SubtleAutoShuffle } from './SubtleAutoShuffle'
import type { WaysWeShowUpCardValue } from '@/lib/sanity/types'

vi.mock('next/image', () => ({
  default: (props: Record<string, unknown>) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @next/next/no-img-element -- test stub, not real img semantics
    return <img alt={props.alt as string} {...(props as any)} />
  },
}))

class MockIntersectionObserver {
  callback: IntersectionObserverCallback
  constructor(callback: IntersectionObserverCallback) {
    this.callback = callback
  }
  observe() {
    this.callback(
      [{ isIntersecting: true } as IntersectionObserverEntry],
      this as unknown as IntersectionObserver,
    )
  }
  disconnect() {}
  unobserve() {}
  takeRecords() {
    return []
  }
}

function makeCard(i: number): WaysWeShowUpCardValue {
  return {
    pillar: 'educate',
    word: `Word${i}`,
    image: { url: `https://example.com/${i}.jpg`, alt: `Card ${i}` },
    description: [],
    link: undefined,
  } as unknown as WaysWeShowUpCardValue
}

describe('SubtleAutoShuffle pause button', () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true })
    vi.stubGlobal('IntersectionObserver', MockIntersectionObserver)
  })

  afterEach(() => {
    cleanup()
    vi.useRealTimers()
    vi.unstubAllGlobals()
  })

  it('toggles aria-pressed and stops auto-advance on click', async () => {
    const cards = [makeCard(1), makeCard(2), makeCard(3)]
    render(<SubtleAutoShuffle cards={cards} showSticker={false} />)

    const button = screen.getByTestId('shuffle-pause-button')
    expect(button).toHaveAttribute('aria-pressed', 'false')
    expect(button).toHaveAccessibleName('Pause automatic preview')

    fireEvent.click(button)

    expect(button).toHaveAttribute('aria-pressed', 'true')
    expect(button).toHaveAccessibleName('Resume automatic preview')

    const indexMatcher = /\d{2}\s*\/\s*\d{2}/
    const indexBefore = screen.getByText(indexMatcher).textContent
    await vi.advanceTimersByTimeAsync(10_000)
    const indexAfter = screen.getByText(indexMatcher).textContent
    expect(indexAfter).toBe(indexBefore)

    fireEvent.click(button)
    expect(button).toHaveAttribute('aria-pressed', 'false')
    expect(button).toHaveAccessibleName('Pause automatic preview')
  })
})
