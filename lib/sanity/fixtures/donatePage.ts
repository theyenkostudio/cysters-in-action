import type { HeroValue } from '../types'

/** PLACEHOLDER: every account name and number below is fake until the client
 *  supplies the real details. */
export const donatePage = {
  _placeholder: true as const,
  hero: {
    eyebrow: 'Support our work',
    headline: 'Thank you for\nwanting to give.',
    subline:
      'Every gift, of any size, helps us keep PMOS information free, run support events and reach more people who need to hear they’re not alone.',
    heroMedia: {
      mediaType: 'image',
      image: {
        url: '/placeholder/wwsu-act.jpg',
        alt: 'Many hands reaching in together',
        credit: 'Pexels',
      },
    },
    overlayStrength: 55,
    overlayDirection: 'left',
    height: 'large',
    textAlign: 'left',
  } as HeroValue,
  thanks: 'However you give, thank you.',
  reference: {
    code: 'CIA-DONATE',
    why: 'Some of our accounts may not be dedicated Cysters in Action accounts. Putting this reference on your transfer is how we know your gift is for us, and it keeps it from being mistaken for a personal payment.',
  },
  methods: [
    {
      id: 'mtn-momo',
      name: 'MTN MoMo',
      kind: 'Mobile money',
      description: 'Send from any MTN MoMo wallet, or dial *170#.',
      details: [
        { label: 'Number', value: '024 000 0000', copy: '0240000000' },
        { label: 'Account name', value: 'Account name (placeholder)' },
      ],
      note: 'Enter the reference in the “Reference” field when asked.',
    },
    {
      id: 'telecel-cash',
      name: 'Telecel Cash',
      kind: 'Mobile money',
      description: 'Send from any Telecel Cash wallet, or dial *110#.',
      details: [
        { label: 'Number', value: '020 000 0000', copy: '0200000000' },
        { label: 'Account name', value: 'Account name (placeholder)' },
      ],
      note: 'Enter the reference in the “Reference” field when asked.',
    },
    {
      id: 'bank-transfer',
      name: 'Bank transfer',
      kind: 'Bank',
      description: 'Pay in at a branch or transfer from your banking app.',
      details: [
        { label: 'Bank', value: 'Bank name (placeholder)' },
        { label: 'Account name', value: 'Account name (placeholder)' },
        { label: 'Account number', value: '0000 0000 0000', copy: '000000000000' },
        { label: 'Branch', value: 'Branch (placeholder)' },
      ],
      note: 'Use the reference as the payment narration or description.',
    },
  ],
  steps: [
    { title: 'Choose a method', body: 'Pick whichever is easiest: mobile money or bank transfer.' },
    {
      title: 'Add the reference',
      body: 'Put our reference on your payment so we can match it to us.',
    },
    {
      title: 'Make your payment',
      body: 'Send your gift with the reference. That’s all it takes. Thank you.',
    },
  ],
  transparency:
    'We’ll publish how donations are used once the first reporting period closes. Questions about a gift? Get in touch and we’ll be happy to help.',
}
