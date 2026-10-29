# Performance guidelines

Short rules for anyone adding or touching animated/scroll-tied components. See
`docs/perf/baseline.md` and `docs/perf/after.md` for the measurements behind these.

## Scroll and animation loop

- There is exactly **one** `requestAnimationFrame` loop driving scroll/animation:
  `gsap.ticker`. Lenis (`components/motion/lenis-provider.tsx`) is ticked from it
  (`gsap.ticker.add(t => lenis.raf(t * 1000))`), not its own rAF loop. Don't add a new
  `requestAnimationFrame` loop for scroll-position or animation work — hook into
  `gsap.ticker` or, for a one-shot "appear once" effect, use an `IntersectionObserver`
  (Motion's `whileInView` already does this and is fine as-is).
- Any component that creates a `ScrollTrigger` must call
  `ScrollTrigger.config({ ignoreMobileResize: true })` once (idempotent — safe to call
  from every such component) and call `refreshOnReady()` from
  `components/motion/use-gsap-scope.ts` to refresh once fonts and `window.load` have
  settled. Both exist so a pin's start/end — measured once at setup, in document
  coordinates — doesn't go stale when content above it reflows later (a font swap, an
  image finishing layout), and so the mobile address bar showing/hiding doesn't trigger a
  pointless refresh. `useGsapScope` already does both internally; anything that sets up
  its own `gsap.context`/`ScrollTrigger` directly (it's the minority case — most things
  should use `useGsapScope`) needs to do both itself.
- Bridge Lenis into `ScrollTrigger.update()` (`window.__lenis?.on('scroll', ...)`) the way
  every existing hook does — don't read `window.scrollY` directly in a new scroll
  listener. `useGsapScope` does this for you.
- Keep GSAP/ScrollTrigger/SplitText as dynamic imports inside the component that uses
  them (`await import('gsap')`, etc.) — not a static import — so pages that don't render
  that component don't pay for it. `components/motion/lenis-provider.tsx` is the one
  deliberate exception: it statically imports plain `gsap` (core only, no
  ScrollTrigger/SplitText) because it mounts on every page and Lenis needs a tick source
  immediately. That's a few KB, not the heavy plugins — don't use it as precedent for
  statically importing ScrollTrigger/SplitText/Motion anywhere else.
- A raw `scroll` or `resize` listener that isn't going through `ScrollTrigger`/Lenis (e.g.
  a simple "has the user scrolled past N px" boolean) must throttle itself to at most one
  update per frame (gate the handler behind a `requestAnimationFrame` flag — see
  `components/layout/nav.tsx`'s `scrolled` state for the pattern). Don't call `setState`
  directly from an unthrottled scroll event.

## Animated properties

- Animate `transform` and `opacity` only. No exceptions (this used to allow an exception
  for the mega menu viewport height; that feature was reverted, and the exception went
  with it). If a design calls for a clip-path wipe, a filter crossfade (e.g.
  grayscale→colour), or an animated background colour, rebuild it as a transform/opacity
  equivalent that produces the same pixels — a translating mask instead of clip-path, two
  stacked layers crossfaded by opacity instead of an animated filter/colour — rather than
  animating the expensive property directly.
- Never set `will-change` in CSS as a static class. Let GSAP/Motion apply it for the
  duration of the tween and remove it after.
- Black-and-white/desaturated photos: request the desaturated image from the CDN, don't
  apply a CSS `grayscale()` filter to a full-colour source.
- An ambient/infinite animation (anything with `repeat: -1` or `yoyo: true` with no
  `once`) must pause when its element is off-screen and when the tab is hidden
  (`visibilitychange`). Prefer not adding one at all unless the design specifically asks
  for a constant idle animation — most of what looked "constantly animating" in this
  codebase turned out to be a one-time entrance that should have been stopped (see
  `after.md` for the hive-newsletter and WaysWeShowUp history).

## Fonts and images

- Fonts: `next/font/google` only, Latin subset, `display: 'swap'`, only the weights
  actually used. Don't add a new weight "just in case."
- Images from Sanity go through the custom loader (once Step 6 lands) rather than a raw
  `asset->url` + Next's own optimizer — see `after.md` once that's done for the exact
  loader location.

## Before adding a new animated component

Ask: does it need to run before the user can see it (no), does it need to run off-screen
(no — gate it on intersection), does it need more than transform/opacity (almost
certainly no), and does it add a second thing ticking the page (no — hook into the
existing `gsap.ticker`/Lenis/IntersectionObserver machinery instead of inventing a new
loop).
