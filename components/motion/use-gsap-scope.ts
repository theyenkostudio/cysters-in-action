'use client'

import { useEffect, type RefObject } from 'react'

type Gsap = typeof import('gsap').default
type ScrollTriggerStatic = typeof import('gsap/ScrollTrigger').ScrollTrigger

/**
 * Calls `refresh` once fonts and the window `load` event have settled, so a
 * ScrollTrigger's start/end — measured once at setup, in document
 * coordinates — isn't left stale by content above it reflowing afterwards (a
 * font swap, an image finishing layout). Without this, native wheel/touch
 * scroll can get trapped right at a pin's now-wrong boundary until something
 * else (a scrollbar drag) forces a resync. Returns a cleanup that detaches
 * the pending `load` listener, if one was added.
 */
export function refreshOnReady(refresh: () => void): () => void {
  let onLoad: (() => void) | null = null
  if (document.readyState === 'complete') {
    refresh()
  } else {
    onLoad = refresh
    window.addEventListener('load', onLoad)
  }
  document.fonts?.ready.then(refresh)
  return () => {
    if (onLoad) window.removeEventListener('load', onLoad)
  }
}

/**
 * Runs `setup` inside a gsap.context scoped to `scopeRef`, with GSAP and
 * ScrollTrigger lazy-imported (same bundle-split reasoning as the live block)
 * and Lenis bridged into ScrollTrigger. Everything is torn down with
 * ctx.revert(). Variants split text into spans in React (see RichWords)
 * rather than with SplitText, so GSAP never re-parents React-owned nodes.
 */
export function useGsapScope(
  scopeRef: RefObject<HTMLElement | null>,
  setup: (tools: { gsap: Gsap; ScrollTrigger: ScrollTriggerStatic }) => void | (() => void),
  enabled: boolean,
  deps: unknown[],
) {
  useEffect(() => {
    if (!enabled) return
    let cancelled = false
    let ctx: { revert: () => void } | null = null
    let extraCleanup: void | (() => void)
    let detachLenis: (() => void) | null = null
    let detachRefresh: (() => void) | null = null

    ;(async () => {
      const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([
        import('gsap'),
        import('gsap/ScrollTrigger'),
      ])
      gsap.registerPlugin(ScrollTrigger)
      // The mobile address bar showing/hiding resizes the viewport without
      // any content actually reflowing — without this, that resize alone
      // triggers a ScrollTrigger refresh for no reason.
      ScrollTrigger.config({ ignoreMobileResize: true })
      if (cancelled || !scopeRef.current) return

      const lenis = window.__lenis
      if (lenis) {
        const onScroll = () => ScrollTrigger.update()
        lenis.on('scroll', onScroll)
        detachLenis = () => lenis.off('scroll', onScroll)
      }
      detachRefresh = refreshOnReady(() => ScrollTrigger.refresh())

      ctx = gsap.context(() => {
        extraCleanup = setup({ gsap, ScrollTrigger })
      }, scopeRef)
    })()

    return () => {
      cancelled = true
      detachLenis?.()
      detachRefresh?.()
      if (typeof extraCleanup === 'function') extraCleanup()
      ctx?.revert()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- setup is intentionally keyed by `deps`
  }, [enabled, ...deps])
}

/**
 * After the user stops scrolling, glide Lenis to the next rest (in the direction of travel) of `steps`
 * evenly spaced rests inside `st` (a pinned ScrollTrigger). Replaces
 * ScrollTrigger's own snap, which fights Lenis.
 */
export function settleOnSteps(
  st: { isActive: boolean; start: number; end: number },
  steps: number,
): () => void {
  const lenis = window.__lenis
  if (!lenis) return () => {}
  let timer: ReturnType<typeof setTimeout> | null = null
  const settle = () => {
    if (!st.isActive) return
    const span = st.end - st.start
    // Directional, like ScrollTrigger's own snap: travel forward even a little
    // (past a small dead-zone) and you land on the next rest; travel back and
    // you land on the previous one. Plain "nearest" bounced short scrolls back.
    const x = ((lenis.scroll - st.start) / span) * steps
    const step = Math.max(0, Math.min(steps, Math.floor(x + (lenis.direction >= 0 ? 0.88 : 0.12))))
    const target = st.start + (step / steps) * span
    if (Math.abs(target - lenis.scroll) > 2) {
      lenis.scrollTo(target, { duration: 0.6, easing: (t: number) => 1 - Math.pow(1 - t, 3) })
    }
  }
  const onScroll = () => {
    if (timer) clearTimeout(timer)
    timer = setTimeout(settle, 140)
  }
  lenis.on('scroll', onScroll)
  return () => {
    if (timer) clearTimeout(timer)
    lenis.off('scroll', onScroll)
  }
}
