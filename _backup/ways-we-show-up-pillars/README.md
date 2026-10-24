# Backup — "Ways we show up" (pillars) before the shuffling-card-stack rebuild

Taken 2026-10-24, before replacing the homepage's "Three ways we show up" section
(the `pillarsBlock` scroll-pinned stack, exaggerated motion moment 3) with the new
`waysWeShowUpBlock` (`components/blocks/WaysWeShowUp/`).

**Note:** `pillars-block.tsx`, `scroll-pin.tsx`, and the `pillarsBlock` Sanity schema were
**not deleted** from the live codebase — `app/(site)/about/page.tsx` still renders
`PillarsBlock` directly (its own `aboutPage.pillars` data, `animation: 'subtle'`, no
images/scroll-pin), and `pillarsBlock` remains a registered page-builder block generically
available to any page's `sections[]`. Only the **homepage's specific usage** (the fixture
entry, and its `/dev/motion` demo slot) was replaced. These copies are a snapshot for
reference/restore regardless.

## Files

- `pillars-block.tsx` — the component as of this backup (`components/blocks/pillars-block.tsx`)
- `scroll-pin.tsx` — the scroll-pin GSAP helper it used (`components/motion/scroll-pin.tsx`)
- `pillarsBlock.schema.ts` — the Sanity schema (`sanity/schemaTypes/blocks/pillarsBlock.ts`)
- `homePage.fixture.ts` — the full homepage fixture file, including the `pillarsBlock` section
  entry that was replaced (`lib/sanity/fixtures/homePage.ts`)
- `dev-motion-page.tsx` — `/dev/motion` as of this backup, including "Moment 3 — Pillars"
  (`app/dev/motion/page.tsx`)
- `block-renderer.tsx` — `components/blocks/block-renderer.tsx` at this point (the
  `pillarsBlock` case is unchanged going forward; kept here for completeness)

## To restore the homepage's old pillars section

1. Copy `homePage.fixture.ts` back over `lib/sanity/fixtures/homePage.ts`.
2. Copy `dev-motion-page.tsx` back over `app/dev/motion/page.tsx`.
3. `components/blocks/pillars-block.tsx`, `components/motion/scroll-pin.tsx`, the
   `pillarsBlock` schema, and its `BlockRenderer` case should still be present and unchanged
   in the live tree — confirm before assuming you need to restore those copies too.
