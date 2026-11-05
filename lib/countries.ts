// Free-text country/location names (as entered in the CMS) -> ISO 3166-1
// alpha-2 code. Extend as new countries show up in team member / story data.
const COUNTRY_TO_ISO: Record<string, string> = {
  ghana: 'GH',
  'greater accra': 'GH', // a region within Ghana, not a country
  'united states of america': 'US',
  'united states': 'US',
  usa: 'US',
  kenya: 'KE',
  nigeria: 'NG',
  philippines: 'PH',
}

function isoToFlagEmoji(iso2: string): string {
  return [...iso2.toUpperCase()]
    .map((char) => String.fromCodePoint(127397 + char.charCodeAt(0)))
    .join('')
}

/** Best-effort flag emoji for a free-text country/location name. Returns
 * undefined for anything unrecognised rather than guessing. */
export function countryFlagEmoji(country: string): string | undefined {
  const iso2 = COUNTRY_TO_ISO[country.trim().toLowerCase()]
  return iso2 ? isoToFlagEmoji(iso2) : undefined
}
