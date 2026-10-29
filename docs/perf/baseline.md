# Performance baseline — 2026-10-29

Measured against a production build (`npm run build` + `npm run start`, `ALLOW_PLACEHOLDER_CONTENT=true`),
on `localhost:4100`, no other load on the machine. Lighthouse: 3 runs per page per
form factor, median reported, `throttlingMethod: simulate` (mobile throttling profile:
4x CPU, 1.6 Mbps down / 675 Kbps up / 150ms RTT — Lighthouse's standard "Slow 4G"-ish
mobile profile; desktop: no throttling). Trace runs: real Playwright + CDP, 4x CPU
throttle + an explicit Fast 4G network emulation (1.6 Mbps down / 750 Kbps up / 150ms
RTT), scrolling the full page in 40 steps then hovering each top-level nav item on a
1440×900 viewport.

**Scope note on `/dev/motion`:** this route calls `notFound()` whenever
`NODE_ENV === 'production'`, so it cannot be reached on a production build at all (not
just gated by the placeholder-content flag). It has not been measured here. Its content
is the same Hero/AboutIntroBlock/WaysWeShowUp/StoriesCarouselDemo components, forced to
`animation="exaggerated"`, so the Home numbers below are a reasonable proxy for two of
its three real moments (Hero, WaysWeShowUp) — the stats/count-up moment is currently
disabled on Home (see note below) and `exaggerated` WaysWeShowUp (CardStack) is heavier
than what Home currently ships (`subtle`, i.e. `SubtleAutoShuffle`). If an exact
`/dev/motion` number is wanted, say so and I'll spin up a dev server (`NODE_ENV`
override) just for that measurement.

## Lighthouse

| Page          | Form factor | Perf score | LCP    | TBT        | CLS | Speed Index | Total bytes | Script bytes (transferred) | Image bytes (transferred) |
| ------------- | ----------- | ---------- | ------ | ---------- | --- | ----------- | ----------- | -------------------------- | ------------------------- |
| Home (`/`)    | Mobile      | **50**     | 4701ms | **2559ms** | 0   | 4313ms      | 676 KB      | 403 KB                     | 168 KB                    |
| Home (`/`)    | Desktop     | **31**     | 5024ms | **3120ms** | 0   | 4295ms      | 688 KB      | 403 KB                     | 179 KB                    |
| Learn article | Mobile      | 59         | 4680ms | 1174ms     | 0   | 2069ms      | 524 KB      | 314 KB                     | 114 KB                    |
| Learn article | Desktop     | 40         | 4785ms | 1049ms     | 0   | 2425ms      | 494 KB      | 314 KB                     | 83 KB                     |

Against the budgets in the brief (≥90 perf, LCP <2.5s, INP <200ms, first-load JS <180KB
gzipped): every number here misses, Home worst of all. CLS is already ≈0 everywhere —
nothing to do there. Desktop scoring _worse_ than mobile on the 0–100 scale is a
Lighthouse quirk (desktop's performance score curve is harsher on TBT/LCP in absolute ms
than mobile's), not a sign mobile is fine.

## Throttled scroll + nav-dropdown trace (4x CPU, Fast 4G, CDP `Tracing`)

| Page          | Long tasks (>50ms) | Longest task | Total blocking |
| ------------- | ------------------ | ------------ | -------------- |
| Home          | **126**            | **4330ms**   | **26185ms**    |
| Learn article | 36                 | 390ms        | 3770ms         |

Home's worst single task (4.3s) breaks down, by time spent inside it, as: `FunctionCall`
2626ms, `Layout` 1250ms, `UpdateLayoutTree` 1178ms, plus GC and paint work. A
`FunctionCall` followed by repeated `Layout`/`UpdateLayoutTree` inside the _same_ task is
the signature of forced synchronous layout — something reading layout (offset/rect) in a
loop during scroll, each read forcing the browser to flush the pending style/layout work
immediately instead of batching it once per frame. This is the single biggest thing to
fix in Step 2/Step 10 and almost certainly explains most of the 2.5–3.1s TBT above. It
did not come from one isolated call during code reading — `useShuffleTimeline`,
`FoundingCircleRow`, and `useGsapScope`'s `settleOnSteps` do not call
`getBoundingClientRect` inside their scroll-tied code paths (confirmed by reading all of
them), so this needs a trace-level `Layout` initiator check (DevTools "Layout" event ⇒
"Initiators" in a real profiler, not just this script) before assuming which call is
responsible — logged here as the top investigation for Step 2/10, not yet fixed.

## Bundle composition (built chunks, `.next/static/chunks`, production build)

681 JS chunk files, 24.3 MB total (uncompressed, on disk). Signature search across all
chunks:

| Library                 | Chunks containing it | Raw bytes (uncompressed, summed across those chunks)  |
| ----------------------- | -------------------- | ----------------------------------------------------- |
| `gsap`                  | 7                    | 255 KB                                                |
| `lenis`                 | 6                    | 205 KB                                                |
| `motion` (motion/react) | —                    | not found as a literal string (minified export names) |
| `embla-carousel`        | —                    | not found as a literal string (minified export names) |
| `@radix-ui`             | —                    | not found as a literal string (minified export names) |

Turbopack's chunk splitting means gsap/lenis are each spread across several chunks
rather than one isolated bundle — consistent with Step 9's ask for stricter boundaries
(the `no-restricted-imports` ESLint rule). The motion/embla/radix libraries couldn't be
located by string search because Turbopack's minifier doesn't keep the package name as a
literal in the output; a size-by-module breakdown will need `@next/bundle-analyzer`'s
treemap (not installed — skipped per the no-CI-wiring decision, but it's a local-only dev
dependency if wanted for this specific step; separate from the CI budget check that was
declined).

## Code-level findings (read, not yet changed)

Ordered roughly by where they land in the brief's steps.

1. **Two independent rAF loops site-wide (Step 2).** `LenisProvider`
   (`components/motion/lenis-provider.tsx`) drives Lenis from its own
   `requestAnimationFrame` loop; GSAP's `gsap.ticker` runs its own internal rAF loop the
   moment any GSAP code imports it (every animated section). Per the brief, Lenis should
   be driven from `gsap.ticker` instead, collapsing to one loop.
2. **`Nav`'s scroll listener is unthrottled (Step 2/10).** `components/layout/nav.tsx`
   adds a raw `scroll` listener that calls `setState` synchronously on every scroll
   event (no rAF gate, no IntersectionObserver), to toggle the "scrolled" shadow/sizing.
   Cheap in isolation, but it's exactly the kind of extra scroll listener Step 2 asks to
   remove, and it re-renders `Nav` far more often than the visual change needs.
3. **Pillars' `ScrollPin` animates clip-path, CSS filter, and backgroundColor every
   frame during a scrub (Step 3 — no exceptions).** `components/motion/scroll-pin.tsx`
   (used by `PillarsBlock` only when `animation === 'exaggerated'`) tweens
   `clipPath: inset(...)` for the wipe, `filter: grayscale(...)` on the image, and
   `backgroundColor` on the overlay, all inside a pinned/scrubbed ScrollTrigger timeline.
   Reproducing the exact same look with transform/opacity only is possible (e.g. a
   translating mask panel instead of a clip-path inset; a stacked grayscale+colour image
   pair crossfaded by opacity instead of an animated filter; a stacked solid-colour
   overlay pair crossfaded by opacity instead of animated backgroundColor) but is a real
   rewrite of this component's internals, not a one-line change — flagging before I touch
   it, since "no exceptions" came from your correction and I want to confirm the
   transform-only rebuild approach before doing it.
4. **Grayscale photos are a live CSS filter, not a CDN param (Step 6).**
   `components/blocks/WaysWeShowUp/TornCard.tsx` applies
   `filter: grayscale(1) contrast(1.12) brightness(0.82)` in CSS to a full-colour source
   image. Fix is server-side: request the desaturated image from Sanity directly.
5. **Sanity images never get Sanity's own resize/format/quality treatment (Step 6,
   bigger than the brief assumed).** `lib/sanity/queries.ts` projects every image as the
   raw, full-resolution `asset->url` (GROQ: `"url": asset->url`). The `@sanity/image-url`
   builder (`lib/sanity/image.ts`, `urlFor()`) exists but is never called anywhere in the
   app. Today, Next's own image optimizer is the _only_ processing step, and it has to
   fetch the full-resolution original from Sanity's CDN on every cache miss before it can
   resize it — the opposite problem from the brief's "don't double-process" worry (there's
   no double-processing; there's a maximally expensive single process). The fix the brief
   describes (a custom Next `images.loader` that calls Sanity's own CDN transform API
   with `auto=format&fit=max&q=75&w=<width>`, with Next's own optimizer bypassed for
   these sources) is the right shape for this and is a bit more structural than "swap a
   filter prop" — one place to change (`lib/sanity/image.ts` + a new loader file), but
   touches every Sanity `<Image>` call's effective behavior.
6. **Fonts already look correct.** `lib/fonts.ts` uses `next/font/google` for both
   families with `display: 'swap'`, Latin subset only, and only the weights actually
   used (Instrument Serif 400 normal+italic only — it doesn't ship more; Figtree
   400/500/600). `next/font` auto-preloads and auto-applies fallback metric adjustment by
   default in this Next version — I'll confirm the generated `<head>` shows the preload
   and an adjusted fallback (`adjustFontFallback`) rather than adding anything redundant.
7. **The hero headline's "visible without JS" requirement is already met, by a different
   mechanism than the brief's suggested one.** `SplitHeadline` renders fully visible SSR
   markup and only hides words via `useLayoutEffect` (so if JS never runs, nothing is
   stuck invisible) — it does not rely on a pre-hidden CSS state keyed to an `html.js`
   class. Adding the brief's inline-script/`html.js` pattern on top would be redundant;
   flagging instead of silently adding unused scaffolding.
8. **Hero `<video>` has no `preload="none"`, no idle/viewport gating, and no lite-tier
   check yet (Step 7).** `components/blocks/hero.tsx` renders `<video autoPlay muted
loop playsInline poster={...}>` directly with a `<source>`, no `preload` attribute
   (defaults to `auto` in most browsers), no `requestIdleCallback`/`window.load` gate, and
   no viewport-width-based source selection. It does already skip video under
   `prefers-reduced-motion` and Save-Data.
9. **The stats/count-up moment is currently disabled, not just unoptimized.**
   `components/blocks/about-intro-block.tsx` has `const SHOW_STATS = false` with a comment
   that the boxed-card look is being redesigned. Its own count-up (a hand-rolled GSAP
   tween onto a counter object, not the separate `CountUp` component in
   `components/motion/count-up.tsx`) is dead code on every real page right now — worth
   confirming you still want it included in this pass given it doesn't render anywhere,
   versus deferring it to whenever stats come back.
10. **"Brand waves" doesn't exist as a component yet.** The only occurrence of the name
    in the codebase is a comment in `app/globals.css` (`/* decorative use only (e.g.
<BrandWaves />) */`) reserving some raw colour tokens for a future use — there's no
    `BrandWaves` component, no drift animation, nothing currently rendering it anywhere.
    Nothing to optimize here; flagging so it isn't assumed done or silently skipped.
11. **"Stories carousel" is two different things.** The homepage's "Community stories"
    section (`components/blocks/stories/StoryPostcards.tsx`) is a 3-card flip grid, not a
    carousel — already a one-shot `once: true` reveal plus a `rotationY` flip, both
    transform-only, nothing ambient running. The actual Embla carousel
    (`components/connect/stories-carousel.tsx`, `embla-carousel-react`) lives on
    `/connect/stories`, not the homepage, and isn't covered by this baseline's measured
    routes — it animates `scale`/`opacity` via Motion (fine) but has a static, redundant
    inline `clipPath: inset(0 0 0 0 round 24px)` style doing nothing a plain `rounded-xl
overflow-hidden` class wouldn't already do.
12. **Every page is server-rendered on demand, nothing is statically prerendered —
    including Home.** `app/layout.tsx` calls `await connection()` so the per-request CSP
    nonce reaches inlined scripts; this opts every route into dynamic rendering (the
    production build output confirms it: every route in the table is marked `ƒ`, none
    `○`). This is an existing, deliberate tradeoff from the nonce work (see the
    "Render root layout dynamically" commit), not something this pass should change
    unilaterally, but it does mean TTFB has no static/ISR floor to fall back on — noting
    it as context for why Lighthouse's "server response time" component of the scores
    above can't be improved by prerendering without revisiting that nonce approach.

## What I haven't done yet

Per the agreed phasing, this is baseline measurement only — no code changed. Findings
1–12 above are the input to Steps 2–10; I'll work through them in order and check in
after each, per your pacing choice, flagging anything (like #3, #5, #9) where the "right"
fix is bigger than a one-line change or touches something currently unused/disabled.
