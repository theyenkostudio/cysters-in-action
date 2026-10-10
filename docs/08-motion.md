# Motion: Scroll Reveals

Status: **direction agreed, not in the prototype.** Motion can't be baked into the design canvas, so this file is the spec for the build.

## Intent
Subtle scroll-driven reveals that give a premium, human feel. Noticeable if you look, never distracting. The test: if someone points it out, they should say "oh, nice", not "why is that moving?".

Language: **settle into view**, not pop. No bounce, no overshoot, no spring.

## Starting values (tune in the browser, not on paper)
| Property | Value |
|----------|-------|
| Effect | Fade in (opacity 0 to 1) plus rise (translateY about 12 to 16px to 0) |
| Duration | About 500 to 700ms |
| Easing | Ease-out (for example cubic-bezier(0.22, 1, 0.36, 1)). No bounce. |
| Trigger | When about 15 to 20% of the element is in view |
| Repeat | Once only. Never re-animate on scroll back up. |
| Stagger | 60 to 80ms between siblings, capped at about 5 items. Beyond that, reveal as a group. |
| Photos | Fade plus a very slight scale (about 1.03 to 1). Slightly slower than text. |

One motion language everywhere: same easing, same distance, same duration family.

## Where to use it
- Section headings and intro text
- Learn / Connect / Act cards (staggered)
- Voices cards
- Photo tiles in the community "hive" (stagger by distance from the centre so it ripples outward)

## Where not to
- **The hero and anything above the fold.** It should be there immediately.
- **The nav, forms and the FAQ.** Controls shouldn't appear late or shift.
- Long body copy that people are already reading.
- Anything that moves the layout. Animate only transform and opacity, so nothing jumps.

## Rules
- **Content is visible without JavaScript or animation support.** Reveals are an enhancement, not a requirement. Never hide content by default with no fallback.
- **Respect reduced-motion settings.** With `prefers-reduced-motion: reduce`, show everything immediately with no movement.
- **No parallax, no scroll-jacking, no pinned sections.** Scrolling stays normal.
- Keep it cheap: transform and opacity only, no layout-triggering properties.
- Make sure nothing delays reading or reaching content, especially on slow phones.

## Implementation notes
- Preferred: CSS scroll-driven animations (`animation-timeline: view()`), which run off the main thread. Browser support isn't universal, so verify current support before relying on it.
- Fallback: a small IntersectionObserver that adds a class once, or no animation at all. The page must work either way.
- Build the reveal as one shared utility (a class or attribute), not per-element code, so the motion stays consistent.

## Review items in the current prototype
The prototype already has some always-on motion in the community sections (a pulsing "You?" cell, floating and rotating nodes in the hive concepts). That's more motion than this spec allows. Decide whether to tone those down or keep them only on hover, so the site has one calm motion language.

## Open questions
- Which sections reveal at launch (all, or only cards and photos)?
- Do we want a very light touch of motion on hover for photos (current prototype zooms slightly)? Keep it consistent with the reveal.
- Performance budget on low-end phones and slow connections (photo-heavy pages).
