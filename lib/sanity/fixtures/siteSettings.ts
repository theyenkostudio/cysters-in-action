import type { RichTextValue } from '../types'

export type SiteSettingsFixture = {
  _placeholder: true
  siteName: string
  tagline: string
  contactEmail: string
  phone: string
  address: {
    organisationName: string
    line1: string
    line2?: string
    city: string
    country: string
  }
  medicalDisclaimer: RichTextValue
}

export const siteSettings: SiteSettingsFixture = {
  _placeholder: true,
  siteName: 'Cysters In Action',
  tagline: 'Health information, community and collective action for people living with PMOS.',
  contactEmail: 'hello@cystersinaction.org',
  phone: '+233501234000',
  address: {
    organisationName: 'Cysters In Action',
    line1: '14 Dzorwulu Crescent',
    city: 'Accra',
    country: 'Ghana',
  },
  medicalDisclaimer: [
    {
      _type: 'block',
      _key: 'disclaimer-1',
      style: 'normal',
      children: [
        {
          _type: 'span',
          _key: 'disclaimer-1-span',
          text: 'Cysters In Action shares health information to support you, not to replace a consultation with a qualified clinician. Always speak with a doctor about your own diagnosis and treatment.',
        },
      ],
    },
  ],
}
