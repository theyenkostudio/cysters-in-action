import { describe, expect, it } from 'vitest'
import { buildScales } from './build-theme'

// WCAG 2.2 relative luminance / contrast ratio (sRGB).
function hexToRgb(hex: string) {
  const n = parseInt(hex.slice(1), 16)
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255]
}

function channelLuminance(c: number) {
  return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
}

function relativeLuminance(hex: string) {
  const [r, g, b] = hexToRgb(hex).map(channelLuminance)
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

function contrastRatio(a: string, b: string) {
  const la = relativeLuminance(a)
  const lb = relativeLuminance(b)
  const lighter = Math.max(la, lb)
  const darker = Math.min(la, lb)
  return (lighter + 0.05) / (darker + 0.05)
}

const scales = buildScales()

function resolve(token: string): string {
  if (token.startsWith('#')) return token
  const [name, step] = token.split('-')
  // @ts-expect-error - dynamic lookup against the generated scale map
  return scales[name][name === 'neutral' && step === '0' ? 0 : Number(step)]
}

const AA_BODY = 4.5 // normal text
const AA_UI = 3.0 // large text, icons, UI component borders/focus rings

type Pair = { label: string; fg: string; bg: string; min: number }

const pairs: Pair[] = [
  // Default theme — text pairs
  { label: 'eyebrow/pill text on bg-highlight', fg: 'teal-800', bg: 'blush-200', min: AA_BODY },
  { label: 'fg-default on bg-canvas', fg: 'neutral-950', bg: 'neutral-0', min: AA_BODY },
  { label: 'fg-heading on bg-canvas', fg: 'teal-800', bg: 'neutral-0', min: AA_BODY },
  { label: 'fg-muted on bg-canvas', fg: 'neutral-700', bg: 'neutral-0', min: AA_BODY },
  // bg-surface (pure white, about-intro stat cards on the cream canvas)
  { label: 'fg-default on bg-surface', fg: 'neutral-950', bg: '#FFFFFF', min: AA_BODY },
  { label: 'fg-muted on bg-surface', fg: 'neutral-700', bg: '#FFFFFF', min: AA_BODY },
  {
    label: 'fg-subtle on bg-canvas (meta/caption only)',
    fg: 'neutral-600',
    bg: 'neutral-0',
    min: AA_BODY,
  },
  { label: 'fg-link on bg-canvas', fg: 'teal-700', bg: 'neutral-0', min: AA_BODY },
  { label: 'fg-link-hover on bg-canvas', fg: 'teal-800', bg: 'neutral-0', min: AA_BODY },
  {
    label: 'border-input on bg-canvas (UI, not text)',
    fg: 'neutral-500',
    bg: 'neutral-0',
    min: AA_UI,
  },
  {
    label: 'focus-ring on bg-canvas (UI, not text)',
    fg: 'orchid-500',
    bg: 'neutral-0',
    min: AA_UI,
  },
  { label: 'action-primary-fg on action-primary-bg', fg: '#FFFFFF', bg: 'teal-800', min: AA_BODY },
  {
    label: 'action-secondary text/border on bg-canvas',
    fg: 'teal-800',
    bg: 'neutral-0',
    min: AA_BODY,
  },
  { label: 'action-accent-fg on action-accent-bg', fg: '#FFFFFF', bg: 'lagoon-700', min: AA_BODY },
  { label: 'accent-orchid-text on bg-canvas', fg: 'orchid-700', bg: 'neutral-0', min: AA_BODY },
  { label: 'accent-lagoon-text on bg-canvas', fg: 'lagoon-700', bg: 'neutral-0', min: AA_BODY },

  // Inverse theme (plum sections, footer, dark hero text)
  { label: 'inverse fg-default on plum-900', fg: 'neutral-0', bg: 'plum-900', min: AA_BODY },
  { label: 'inverse fg-default on plum-950', fg: 'neutral-0', bg: 'plum-950', min: AA_BODY },
  { label: 'inverse fg-muted on plum-900', fg: 'blush-200', bg: 'plum-900', min: AA_BODY },
  {
    label: 'inverse accent-lagoon (text-safe) on plum-900',
    fg: 'lagoon-300',
    bg: 'plum-900',
    min: AA_BODY,
  },
  {
    label: 'inverse accent-orchid (text-safe) on plum-900',
    fg: 'orchid-300',
    bg: 'plum-900',
    min: AA_BODY,
  },
  {
    label: 'inverse action-primary-fg on action-primary-bg',
    fg: 'plum-900',
    bg: 'neutral-0',
    min: AA_BODY,
  },
  {
    label: 'inverse action-secondary text/border on plum-900',
    fg: 'neutral-0',
    bg: 'plum-900',
    min: AA_BODY,
  },

  // Brand theme (teal bands)
  { label: 'brand fg-default on bg-canvas', fg: '#FFFFFF', bg: 'teal-800', min: AA_BODY },
  {
    label: 'brand action-primary-fg on action-primary-bg',
    fg: 'plum-950',
    bg: 'lagoon-300',
    min: AA_BODY,
  },

  // Status colours
  { label: 'status success text on canvas', fg: '#016D3C', bg: 'neutral-0', min: AA_BODY },
  { label: 'status success solid (white text)', fg: '#FFFFFF', bg: '#00884D', min: AA_BODY },
  { label: 'status warning text on canvas', fg: '#7E4F04', bg: 'neutral-0', min: AA_BODY },
  { label: 'status warning solid (white text)', fg: '#FFFFFF', bg: '#9D6304', min: AA_BODY },
  { label: 'status error text on canvas', fg: '#92393E', bg: 'neutral-0', min: AA_BODY },
  { label: 'status error solid (white text)', fg: '#FFFFFF', bg: '#B5494E', min: AA_BODY },
  { label: 'status info text on canvas', fg: '#026484', bg: 'neutral-0', min: AA_BODY },
  { label: 'status info solid (white text)', fg: '#FFFFFF', bg: '#027DA3', min: AA_BODY },
]

describe('contrast — WCAG 2.2 AA', () => {
  it.each(pairs)('$label meets its minimum contrast ratio', ({ fg, bg, min }) => {
    const ratio = contrastRatio(resolve(fg), resolve(bg))
    expect(ratio).toBeGreaterThanOrEqual(min)
  })

  it('lagoon-500 and orchid-500 are documented as non-text (white text on them fails AA)', () => {
    // Usage rule (Section 4): these two steps never carry text or white-text
    // buttons. This test documents and locks in *why* — white-on-them fails.
    expect(contrastRatio('#FFFFFF', resolve('lagoon-500'))).toBeLessThan(AA_BODY)
    expect(contrastRatio('#FFFFFF', resolve('orchid-500'))).toBeLessThan(AA_BODY)
  })
})
