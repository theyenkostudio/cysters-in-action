import { describe, expect, it } from 'vitest'
import { buildScales } from './build-theme'
import { themeConfig } from './theme.config'

// Expected output for the default seeds, from spec.md Section 4 ("Tonal scales").
// Generated with the same OKLCH pipeline (culori); anchor steps are exact
// (the seed hex replaces the computed value there). Non-anchor steps are
// asserted within a small per-channel tolerance: OKLCH->sRGB gamut mapping
// differs slightly between implementations/library versions, and nothing in
// this design system depends on byte-exact hex outside the anchors.
const expected = {
  teal: {
    50: '#F0F8FC',
    100: '#E0F0F8',
    200: '#C3E0EE',
    300: '#9FCCE2',
    400: '#76B1CD',
    500: '#5294B2',
    600: '#377A98',
    700: '#20617C',
    800: '#134D64',
    900: '#013649',
    950: '#002230',
  },
  lagoon: {
    50: '#EEF9FB',
    100: '#DAF2F6',
    200: '#B8E4EA',
    300: '#8AD2DC',
    400: '#56B8C5',
    500: '#0394A2',
    600: '#02818D',
    700: '#04666F',
    800: '#044D55',
    900: '#02383D',
    950: '#002328',
  },
  plum: {
    50: '#FDF3FC',
    100: '#FAE6F7',
    200: '#F1CEEE',
    300: '#E5B0E1',
    400: '#D08DCB',
    500: '#B46DB0',
    600: '#995395',
    700: '#7D3D7A',
    800: '#622B5F',
    900: '#4E1F4C',
    950: '#300D2F',
  },
  orchid: {
    50: '#FAF4FE',
    100: '#F4E8FC',
    200: '#E7D1F5',
    300: '#D6B5EB',
    400: '#BE94D8',
    500: '#9F71BA',
    600: '#895BA3',
    700: '#6E4586',
    800: '#55316A',
    900: '#3F2050',
    950: '#291236',
  },
  blush: {
    50: '#FDF4F7',
    100: '#F9E7ED',
    200: '#F3D3DE',
    300: '#E5B5C6',
    400: '#CF94AA',
    500: '#B4758D',
    600: '#995C74',
    700: '#7D455C',
    800: '#613245',
    900: '#492132',
    950: '#30131F',
  },
  lilac: {
    50: '#F9F5FA',
    100: '#F1EAF3',
    200: '#E3D5E6',
    300: '#D0BBD5',
    400: '#B79DBE',
    500: '#9B7FA2',
    600: '#826688',
    700: '#684F6E',
    800: '#503B55',
    900: '#3B293F',
    950: '#261829',
  },
} as const

const neutralExpected = {
  0: '#FDFDF8',
  50: '#F9F5F9',
  100: '#EFEBEF',
  200: '#DFD8DF',
  300: '#C9C1C8',
  400: '#ACA5AB',
  500: '#90878F',
  600: '#776E76',
  700: '#5F565E',
  800: '#494148',
  900: '#352E34',
  950: '#221B22',
}

function hexToRgb(hex: string) {
  const n = parseInt(hex.slice(1), 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

function maxChannelDelta(a: string, b: string) {
  const [ar, ag, ab] = hexToRgb(a)
  const [br, bg, bb] = hexToRgb(b)
  return Math.max(Math.abs(ar - br), Math.abs(ag - bg), Math.abs(ab - bb))
}

describe('build-theme scale generation', () => {
  const scales = buildScales()

  it('forces the exact seed hex at each anchor step', () => {
    for (const [name, seed] of Object.entries(themeConfig.seeds) as [
      keyof typeof expected,
      { hex: string; anchor: number },
    ][]) {
      expect(scales[name][seed.anchor as 50]).toBe(seed.hex.toUpperCase())
    }
  })

  it('reproduces the documented scale table within a small tolerance', () => {
    for (const [name, steps] of Object.entries(expected) as [
      keyof typeof expected,
      Record<number, string>,
    ][]) {
      for (const [step, hex] of Object.entries(steps)) {
        const got = scales[name][Number(step) as 50]
        expect(
          maxChannelDelta(got, hex),
          `${name}-${step}: got ${got}, expected ${hex}`,
        ).toBeLessThanOrEqual(4)
      }
    }
  })

  it('reproduces the documented neutral scale, cream canvas at step 0', () => {
    expect(scales.neutral[0]).toBe(neutralExpected[0])
    for (const [step, hex] of Object.entries(neutralExpected)) {
      if (step === '0') continue
      const got = scales.neutral[Number(step) as 50]
      expect(
        maxChannelDelta(got, hex),
        `neutral-${step}: got ${got}, expected ${hex}`,
      ).toBeLessThanOrEqual(3)
    }
  })

  it('is deterministic across runs', () => {
    expect(buildScales()).toEqual(scales)
  })
})
