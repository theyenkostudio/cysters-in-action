# Design Tokens

Source: the design prototype. Wired into the app in `app/globals.css` (Tailwind 4 `@theme`) and `app/layout.tsx` (Hanken Grotesk via `next/font`). If a value changes, change it here and in `globals.css` together.

Light theme only. There is no dark design.

## Colour
| Token | Value | Use |
|-------|-------|-----|
| `ground` | #FAF8F5 | Page background |
| `panel` | #EFEAE4 | Tinted full-width sections |
| `ink` | #2B2128 | Main text |
| `muted` | #5E5360 | Secondary text |
| `accent` | #5A2D5F | Headings, links, primary button |
| `accent-ink` | #FFFFFF | Text on accent |
| `tint-blush` | #EBCFCB | Photo-slot and cell tints. Dark text only. |
| `tint-teal` | #B5CFCB | As above |
| `tint-lilac` | #C9BDD6 | As above |
| `quiet` | #857A88 | Decorative glyphs such as the open-seat "+" |
| `rule` | ink at 25% | Hairlines. Decorative only. |

The accent is a tweak in the prototype. Alternatives tried: teal #1F5656 and berry #7A2E4D, both pass.

## Contrast check (WCAG, measured)
| Pair | Ratio | Result |
|------|-------|--------|
| ink on ground | 14.7 | Pass |
| muted on ground | 6.9 | Pass |
| muted on panel | 6.1 | Pass |
| accent on ground / panel | 10.0 / 8.9 | Pass |
| white on accent | 10.6 | Pass |
| ink on blush / teal / lilac | 10.6 / 9.4 / 8.7 | Pass |
| accent on blush | 7.3 | Pass |
| open-seat "+" (#B9AEBB, original) on panel | 1.8 | **Fail**, replaced by `quiet` (3.0) |
| hive ring colours (#7FB5AF, #A593BD, #E0A9A3) on ground | 1.9 to 2.6 | **Fail** as meaningful UI. Only used in the hive concept boards, not the main pages. If those rings carry meaning, darken them or add a text label. |

All text pairs pass AA. Hairlines are decorative and don't need to pass.

Rules:
- Never put white or pale text on the tints.
- Never convey information by colour alone.

## Type
Font: **Hanken Grotesk** (variable, self-hosted by Next). One typeface throughout.

| Token | Size | Line height | Tracking | Weight | Use |
|-------|------|-------------|----------|--------|-----|
| `display` | 64px (mobile 40px) | 1.05 | -0.025em | 500 | Page H1 |
| `h2` | 44px (mobile 32px) | 1.1 | -0.02em | 500 | Section headings |
| `h3` | 26px (mobile 24px) | 1.15 | -0.01em | 500 | Card titles |
| `lead` | 18px (mobile 17px) | 1.6 | | 400 | Intro paragraphs |
| `body` | 16px | 1.6 | | 400 | Body text |
| `link` | 14px (mobile 13px) | 1.2 | 0.08em, uppercase | 500 | Text links such as "Join the community" |
| `eyebrow` | 12px (mobile 11px) | 1.2 | 0.12em, uppercase | 500 | Small section label |

Every size has a mobile twin named with `-sm` (for example `text-h2-sm md:text-h2`). Further tokens added while building the home page, from the prototype:

| Token | Size (mobile) | Use |
|-------|---------------|-----|
| `hero` | 60px (36px) | Home hero headline |
| `hero-lead` | 19px (16px) | Home hero sub-line |
| `statement` | 40px (28px) | "Why we exist" statement |
| `pullquote` | 34px (26px) | Founding Circle and support-band lines |
| `card` | 28px (26px, uses `h3`) | Learn / Connect / Act card titles |
| `quote` | 22px (20px) | Member quotes |
| `question` | 20px (17px) | FAQ questions |

## Layout
| Token | Value |
|-------|-------|
| `gutter` | 32px desktop, 20px mobile (`gutter-sm`) |
| `section` | 96px between sections desktop, 64px mobile (`section-sm`) |
| Shape | Square corners. No border radius on cards, buttons or photos. |

## Motion
| Token | Value |
|-------|-------|
| `ease-settle` | cubic-bezier(0.22, 1, 0.36, 1) |
| `duration-settle` | 600ms |

See [08-motion.md](08-motion.md). Reduced-motion is handled globally in `globals.css`.

## Component inventory (to build)
Header and nav, mobile menu, footer, eyebrow plus section heading, text link, filled button, photo card, photo band, tinted section, topic card, Voices card, Founding Circle member card, hive cells, form fields, donation amount and frequency chips, FAQ accordion.

Use headless primitives (Radix UI or React Aria) for the accordion, the mobile menu and the chip groups.
