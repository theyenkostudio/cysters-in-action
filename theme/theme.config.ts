// theme/theme.config.ts — single source of truth for colour and type.
// Edit seeds, anchors, ladders, the semantic map or fonts here; everything
// else (scales, CSS variables, Tailwind tokens) is derived from this file
// by build-theme.ts. Do not hand-edit app/theme.generated.css.

const env = (key: string, fallback: string) => process.env[key]?.trim() || fallback

export type ScaleStep = 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950
export type SeedName = 'teal' | 'plum' | 'lagoon' | 'orchid' | 'blush' | 'lilac'

export const SCALE_STEPS: ScaleStep[] = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]

export const themeConfig = {
  seeds: {
    teal: { hex: env('NEXT_PUBLIC_THEME_TEAL', '#134D64'), anchor: 800 }, // wordmark ink
    plum: { hex: env('NEXT_PUBLIC_THEME_PLUM', '#4E1F4C'), anchor: 900 }, // dark waves
    lagoon: { hex: env('NEXT_PUBLIC_THEME_LAGOON', '#0394A2'), anchor: 500 }, // bright wave
    orchid: { hex: env('NEXT_PUBLIC_THEME_ORCHID', '#9F71BA'), anchor: 500 }, // dot over the y
    blush: { hex: env('NEXT_PUBLIC_THEME_BLUSH', '#F3D3DE'), anchor: 200 }, // pill
    lilac: { hex: env('NEXT_PUBLIC_THEME_LILAC', '#D0BBD5'), anchor: 300 }, // mist wave
  } satisfies Record<SeedName, { hex: string; anchor: ScaleStep }>,

  neutral: {
    hueFrom: 'plum' as SeedName,
    chroma: { 50: 0.006, 100: 0.006, 200: 0.012, 300: 0.012, 400: 0.012, rest: 0.016 },
    canvas: env('NEXT_PUBLIC_THEME_CANVAS', '#FDFDF8'),
  },

  lightness: {
    50: 0.975,
    100: 0.945,
    200: 0.89,
    300: 0.82,
    400: 0.73,
    500: 0.635,
    600: 0.55,
    700: 0.465,
    800: 0.385,
    900: 0.31,
    950: 0.235,
  } satisfies Record<ScaleStep, number>,

  chromaCurve: {
    50: 0.12,
    100: 0.25,
    200: 0.45,
    300: 0.7,
    400: 0.9,
    500: 1,
    600: 1,
    700: 0.95,
    800: 0.85,
    900: 0.75,
    950: 0.6,
  } satisfies Record<ScaleStep, number>,

  themes: {
    default: {
      'bg-canvas': 'neutral-0',
      'bg-subtle': 'blush-50',
      'bg-muted': 'lilac-100',
      'bg-highlight': 'blush-200',
      'bg-surface': '#FFFFFF',
      'fg-default': 'neutral-950',
      'fg-heading': 'teal-800',
      // Not redefined per-theme (unlike fg-heading): bg-highlight itself
      // never changes with data-theme, so its paired text colour must stay
      // fixed too, or the pill fails contrast inside inverse/brand sections.
      'fg-on-highlight': 'teal-800',
      'fg-muted': 'neutral-700',
      'fg-subtle': 'neutral-600',
      'fg-link': 'teal-700',
      'fg-link-hover': 'teal-800',
      'border-default': 'neutral-200',
      'border-input': 'neutral-500',
      'focus-ring': 'orchid-500',
      'action-primary-bg': 'teal-800',
      'action-primary-bg-hover': 'teal-900',
      'action-primary-fg': '#FFFFFF',
      'action-secondary': 'teal-800',
      'bg-deep': 'plum-950',
      'action-accent-bg': 'lagoon-700',
      'action-accent-fg': '#FFFFFF',
      'accent-lagoon': 'lagoon-500',
      'accent-orchid': 'orchid-500',
      'accent-lagoon-text': 'lagoon-700',
      'accent-orchid-text': 'orchid-700',
    },
    inverse: {
      'bg-canvas': 'plum-900',
      'bg-deep': 'plum-950',
      'fg-default': 'neutral-0',
      'fg-heading': 'neutral-0',
      'fg-muted': 'blush-200',
      'fg-link': 'lagoon-300',
      'fg-link-hover': 'neutral-0',
      'accent-lagoon': 'lagoon-300',
      'accent-orchid': 'orchid-300',
      'action-primary-bg': 'neutral-0',
      'action-primary-fg': 'plum-900',
      'action-secondary': 'neutral-0',
    },
    brand: {
      'bg-canvas': 'teal-800',
      'fg-default': '#FFFFFF',
      'fg-heading': '#FFFFFF',
      'fg-muted': 'teal-100',
      'fg-link': 'lagoon-300',
      'fg-link-hover': '#FFFFFF',
      'action-primary-bg': 'lagoon-300',
      'action-primary-fg': 'plum-950',
    },
  },

  status: {
    success: { text: '#016D3C', bg: '#E3F8E9', solid: '#00884D' },
    warning: { text: '#7E4F04', bg: '#FFEFDE', solid: '#9D6304' },
    error: { text: '#92393E', bg: '#FEEDED', solid: '#B5494E' },
    info: { text: '#026484', bg: '#E2F5FF', solid: '#027DA3' },
  },

  pillars: { learn: 'teal', connect: 'orchid', act: 'lagoon' } satisfies Record<string, SeedName>,

  overlay: { color: 'plum-950', maxOpacity: 0.8 },

  fonts: {
    display: {
      family: env('NEXT_PUBLIC_FONT_DISPLAY', 'Bricolage Grotesque'),
      source: 'google',
      weights: [500, 700],
    },
    body: {
      family: env('NEXT_PUBLIC_FONT_BODY', 'Figtree'),
      source: 'google',
      weights: [400, 500, 600],
    },
  },
} as const

export type ThemeName = keyof typeof themeConfig.themes
