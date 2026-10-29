import { act, cleanup, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { SubtleAutoShuffle } from './SubtleAutoShuffle'
import type { WaysWeShowUpCardValue } from '@/lib/sanity/types'

vi.mock('next/image', () => ({
  default: (props: Record<string, unknown>) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @next/next/no-img-element -- test stub, not real img semantics
    return <img alt={props.alt as string} {...(props as any)} />
  },
}))

let intersectionCallback: IntersectionObserverCallback = () => {}

class MockIntersectionObserver {
  constructor(callback: IntersectionObserverCallback) {
    intersectionCallback = callback
  }
  observe() {}
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

function setRectTop(el: Element, top: number, height: number) {
  vi.spyOn(el, 'getBoundingClientRect').mockReturnValue({
    top,
    height,
    bottom: top + height,
    left: 0,
    right: 0,
    width: 0,
    x: 0,
    y: top,
    toJSON() {
      return {}
    },
  })
}

function nextFrame() {
  return new Promise<void>((resolve) => requestAnimationFrame(() => resolve()))
}

describe('SubtleAutoShuffle', () => {
  beforeEach(() => {
    vi.stubGlobal('IntersectionObserver', MockIntersectionObserver)
    Object.defineProperty(window, 'innerHeight', { value: 800, configurable: true })
  })

  afterEach(() => {
    cleanup()
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('derives the active card from scroll position and does not move on its own', async () => {
    const cards = [makeCard(1), makeCard(2), makeCard(3)]
    const { container } = render(<SubtleAutoShuffle cards={cards} />)
    const root = container.firstElementChild as HTMLElement
    const indexMatcher = /\d{2}\s*\/\s*\d{2}/

    // Section just entering at the bottom of the viewport: progress ~0.
    setRectTop(root, 800, 400)
    await act(async () => {
      intersectionCallback(
        [{ isIntersecting: true } as IntersectionObserverEntry],
        null as unknown as IntersectionObserver,
      )
      await nextFrame()
    })
    expect(screen.getByText(indexMatcher).textContent).toBe('01 / 03')

    // Idle with no scroll event: the active card must not change by itself.
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 50))
    })
    expect(screen.getByText(indexMatcher).textContent).toBe('01 / 03')

    // Scrolled roughly halfway through the section.
    setRectTop(root, 200, 400)
    await act(async () => {
      window.dispatchEvent(new Event('scroll'))
      await nextFrame()
    })
    expect(screen.getByText(indexMatcher).textContent).toBe('02 / 03')

    // Scrolled all the way past: clamps to the last card.
    setRectTop(root, -400, 400)
    await act(async () => {
      window.dispatchEvent(new Event('scroll'))
      await nextFrame()
    })
    expect(screen.getByText(indexMatcher).textContent).toBe('03 / 03')
  })

  it('stops listening to scroll once the section leaves the viewport', async () => {
    const cards = [makeCard(1), makeCard(2), makeCard(3)]
    const { container } = render(<SubtleAutoShuffle cards={cards} />)
    const root = container.firstElementChild as HTMLElement
    const indexMatcher = /\d{2}\s*\/\s*\d{2}/

    setRectTop(root, 800, 400)
    await act(async () => {
      intersectionCallback(
        [{ isIntersecting: false } as IntersectionObserverEntry],
        null as unknown as IntersectionObserver,
      )
      await nextFrame()
    })

    setRectTop(root, 200, 400)
    await act(async () => {
      window.dispatchEvent(new Event('scroll'))
      await nextFrame()
    })
    expect(screen.getByText(indexMatcher).textContent).toBe('01 / 03')
  })
})
