// Font loading per theme/theme.config.ts (Section 4). next/font/google requires
// a static import per family, so swapping the pairing means editing both
// theme.config.ts (for documentation/env override) and the imports below.
import { Instrument_Serif, Figtree } from 'next/font/google'

// Instrument Serif only ships a single weight (400) on Google Fonts — there
// is no 500/700 cut, so any font-bold/font-semibold on font-display text
// renders as the browser's synthetic bold instead of a real weight.
export const fontDisplay = Instrument_Serif({
  variable: '--font-display-family',
  subsets: ['latin'],
  weight: ['400'],
  style: ['normal', 'italic'],
  display: 'swap',
})

export const fontBody = Figtree({
  variable: '--font-body-family',
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  display: 'swap',
})

export const fontVariables = `${fontDisplay.variable} ${fontBody.variable}`
