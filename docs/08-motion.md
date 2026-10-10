# Motion

Status: **built in the app** (home page and Donate). Not in the design canvas, because it can't be baked into a static design.

## Intent
Subtle motion that gives a premium, human feel. Noticeable if you look, never distracting. The test: if someone points it out, they should say "oh, nice", not "why is that moving?".

One move everywhere: **settle in**. Slow ease-out, no bounce, no overshoot, plays once. See decision D-002 in [04-decisions.md](04-decisions.md).

## What's built
| Move | Where | Detail |
|------|-------|--------|
| Settle in | Section text, cards, Voices, FAQ, support band, forms | Fade in and rise 16px, 600ms, ease-out. Siblings staggered by 70ms. |
| Photos develop | Photo containers below the fold | Container fades in (800ms) while the photo eases from 3% zoomed to full size (1000ms). |
| Hive ripple | Join hive (desktop and mobile) | Cells fade in and scale from 94%, outward from the "You?" cell. Delay is about 0.9ms per pixel of distance. |
| Hero settle | Home hero photo | Eases from 4% zoomed to full size over 1.4s on load. Text and nav are visible immediately. |
| FAQ easing | FAQ answers | Height eases open and closed (CSS only). Opening one closes the others. |
| Header | Home | Fixed. Transparent over the hero, solid off-white once you scroll. |
| Small touches | Links, buttons | Underline offset shifts on hover (200ms). The Join/Continue buttons darken slightly. Photos in the hive zoom on hover. |
| Smooth anchors | Whole site | Links to `#sections` glide, and land clear of the fixed header. |
| Page cross-fade | Between pages | Old page fades out in 200ms, new page fades in over 300ms. Needs two or more pages to see. |

Values live as tokens: `--ease-settle: cubic-bezier(0.22, 1, 0.36, 1)` and `--duration-settle: 600ms` in `app/globals.css`.

## Where not to use it
- The hero text and nav, forms, and controls. Nothing important should arrive late.
- Anything that moves the layout. Only transform and opacity animate.
- No parallax, no scroll-jacking, no pinned sections, nothing that loops or pulses. (The always-on pulse on the "You?" cell was removed for this reason.)

## Rules
- **Content is visible without JavaScript or animation support.** The server renders everything visible. After load, `Reveal` hides only blocks that are below the fold, then shows them once as they scroll into view. Anything already on screen, or scrolled past, is never hidden.
- **Reduced motion:** all of the above is inside `prefers-reduced-motion: no-preference`. Users who've asked for less motion get no animation, and nothing is hidden.
- Once shown, a block never hides again.

## How it's built
- `components/ui/reveal.tsx` (client component, IntersectionObserver). Kinds: `rise`, `photo`, `hive`. Takes a `delay` in ms.
- The CSS is in `app/globals.css` under "Motion".
- **Change from the original plan:** I first planned CSS scroll-driven animations (`animation-timeline: view()`). Those tie the animation to scroll position, so it plays backwards when you scroll up. That isn't "plays once", so I used an IntersectionObserver instead.
- Page cross-fade uses React's `<ViewTransition>` in `app/layout.tsx`, styled by `.page-fade`.
- FAQ easing uses `::details-content` and `interpolate-size`. It works in recent Chrome and Edge. In other browsers the FAQ opens and closes instantly, and everything still works.

## Open items
- If a photo has its own hover zoom (as in the hive), check it doesn't clash with the reveal transition on the same element.
- Check performance on low-end phones and slow connections (photo-heavy pages).
- Revisit the reveal values on a real device. These numbers are starting points.
