# Decisions

Record each decision once it's made. Format:

```
## D-001: Title
- Date:
- Status: proposed | accepted | superseded
- Decision:
- Why:
- Alternatives considered:
```

## D-001: Photography-led visual direction
- Date: 2026-10-10
- Status: accepted
- Decision: The visual identity is led by photography, not illustration. Layouts give images room (full-bleed heroes, portrait cards, generous whitespace), and everything around them stays quiet so the photos carry the page.
- Why: This is a community-driven application, and community is about people and photos. The feel we want is easy on the eye, intentional, curated, chosen (see the SIHA reference in [06-design-research.md](06-design-research.md)).
- Alternatives considered: Illustration-led (for example Wandering Wombs). It is warmer and cheaper to produce but less personal, and it doesn't put real people at the centre.
- Consequences to resolve: where photos come from, consent, representation, contrast over images, and image weight on mobile and low bandwidth. See "Imagery" in [02-open-questions.md](02-open-questions.md).

## D-002: Subtle scroll reveals
- Date: 2026-10-10
- Status: accepted (direction), values to tune in build
- Decision: Use subtle scroll-driven reveals (fade plus a short rise, ease-out, once only) to give a premium, human feel. Details in [08-motion.md](08-motion.md).
- Why: Adds polish without distracting an often anxious audience. It supports the "intentional, curated, chosen" feel.
- Alternatives considered: No motion (safe but flatter); heavy parallax or animated sections (impressive but distracting, harder to make accessible).
- Constraints: Content must work without JS or animation support, and must respect reduced-motion settings. Not in the design prototype.
