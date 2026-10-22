// Font loading per theme/theme.config.ts (Section 4). next/font/google requires
// a static import per family, so swapping the pairing means editing both
// theme.config.ts (for documentation/env override) and the imports below.
import { Bricolage_Grotesque, Figtree } from 'next/font/google'

export const fontDisplay = Bricolage_Grotesque({
  variable: '--font-display-family',
  subsets: ['latin'],
  weight: ['500', '700'],
  display: 'swap',
})

export const fontBody = Figtree({
  variable: '--font-body-family',
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  display: 'swap',
})

export const fontVariables = `${fontDisplay.variable} ${fontBody.variable}`
