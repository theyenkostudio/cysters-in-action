import type { PageBuilderBlock, RichTextValue, SeoValue } from '../types'

function paragraph(key: string, text: string): RichTextValue[number] {
  return {
    _type: 'block',
    _key: key,
    style: 'normal',
    children: [{ _type: 'span', _key: `${key}-span`, text }],
  }
}

function heading(key: string, text: string): RichTextValue[number] {
  return {
    _type: 'block',
    _key: key,
    style: 'h2',
    children: [{ _type: 'span', _key: `${key}-span`, text }],
  }
}

function richTextSection(key: string, body: RichTextValue): PageBuilderBlock {
  return { _type: 'richTextBlock', _key: key, content: body, width: 'narrow', animation: 'none' }
}

export type PageFixture = {
  _id: string
  _type: 'page'
  _placeholder: true
  title: string
  slug: { current: string }
  sections: PageBuilderBlock[]
  seo?: SeoValue
}

export const pages: PageFixture[] = [
  {
    _id: 'page-privacy',
    _type: 'page',
    _placeholder: true,
    title: 'Privacy Policy',
    slug: { current: 'privacy' },
    sections: [
      richTextSection('s1', [
        paragraph(
          'p1',
          'Placeholder privacy policy. This page must be replaced with a policy reviewed by the client’s legal counsel before launch — it is not real legal advice.',
        ),
        paragraph(
          'p2',
          'Cysters In Action collects only the information needed to run the forms on this site: newsletter sign-ups, event RSVPs, contact messages and story submissions. Processors used include Vercel (hosting), Sanity (content), and an email provider (Section 7 of the build spec).',
        ),
        paragraph(
          'p3',
          'Personal data from stories and RSVPs is kept only as long as described in the build spec’s retention schedule, and is never included in public content without consent.',
        ),
      ]),
    ],
  },
  {
    _id: 'page-terms',
    _type: 'page',
    _placeholder: true,
    title: 'Terms of Use',
    slug: { current: 'terms' },
    sections: [
      richTextSection('s1', [
        paragraph(
          'p1',
          'Placeholder terms of use. Replace with real terms reviewed by legal counsel before launch.',
        ),
        paragraph(
          'p2',
          'By using this site you agree not to misuse the forms (Share Your Story, RSVP, contact, newsletter) and to provide accurate information when you submit them.',
        ),
      ]),
    ],
  },
  {
    _id: 'page-medical-disclaimer',
    _type: 'page',
    _placeholder: true,
    title: 'Medical Disclaimer',
    slug: { current: 'medical-disclaimer' },
    sections: [
      richTextSection('s1', [
        paragraph(
          'p1',
          'The content on this site, including every Learn hub article, is for general information only and is not medical advice. It does not replace a consultation with a qualified healthcare provider.',
        ),
        paragraph(
          'p2',
          'Always speak with a doctor or other qualified clinician about your own diagnosis, symptoms and treatment. Medically-reviewed articles show a reviewer and a last-reviewed date — if you think something is out of date, please contact us.',
        ),
      ]),
    ],
  },
  {
    _id: 'page-accessibility',
    _type: 'page',
    _placeholder: true,
    title: 'Accessibility Statement',
    slug: { current: 'accessibility' },
    sections: [
      richTextSection('s1', [
        paragraph(
          'p1',
          'Cysters In Action aims to meet WCAG 2.2 AA across this site: keyboard-operable navigation, visible focus states, alt text on every image, captions on video, and support for reduced motion.',
        ),
        paragraph(
          'p2',
          'If you hit an accessibility barrier anywhere on this site, please let us know — placeholder contact details will be added here once the Contact page ships in Phase 3.',
        ),
      ]),
    ],
  },
  {
    _id: 'page-community-guidelines',
    _type: 'page',
    _placeholder: true,
    title: 'Community Guidelines',
    slug: { current: 'community-guidelines' },
    sections: [
      richTextSection('s1', [
        heading('h-purpose', 'Why these guidelines exist'),
        paragraph(
          'p1',
          'These guidelines apply to every community space on this site: shared stories, event attendance and any future comment or forum feature.',
        ),
        paragraph(
          'p1b',
          'Living with cysts can feel isolating. This is a place to feel heard, so everyone here is asked to help keep it that way.',
        ),
        heading('h-kind', 'Be kind'),
        paragraph(
          'p2',
          'Treat every member with respect and assume good intent. Disagreement is fine; dismissiveness, mockery and personal attacks are not.',
        ),
        paragraph(
          'p2b',
          'Everyone’s experience is different. What worked, or didn’t work, for one person says nothing about what is true for someone else.',
        ),
        heading('h-privacy', 'Respect privacy and anonymity'),
        paragraph(
          'p3',
          'Never try to identify someone who has chosen to stay anonymous, and never share another person’s story, name or details outside this community without their permission.',
        ),
        paragraph(
          'p3b',
          'Take care with your own details too. Avoid posting contact information, addresses or anything you wouldn’t want kept public.',
        ),
        heading('h-medical', 'Support, not medical advice'),
        paragraph(
          'p4',
          'This is a space for support, not medical debate. If you have a medical question, bring it to a clinician, not another community member.',
        ),
        paragraph(
          'p4b',
          'Share what you’ve experienced, but please don’t recommend treatments, doses or changes to someone else’s care.',
        ),
        heading('h-share', 'Sharing stories and content'),
        paragraph(
          'p5',
          'Stories can touch on difficult subjects. Add a content warning where it’s appropriate, and keep descriptions factual rather than graphic.',
        ),
        paragraph(
          'p5b',
          'Only share what is yours to share. Do not post copyrighted material, advertising or links to products.',
        ),
        heading('h-moderation', 'How moderation works'),
        paragraph(
          'p6',
          'Moderators may edit lightly for clarity or remove content that breaks these guidelines.',
        ),
        paragraph(
          'p6b',
          'If something doesn’t feel right, let us know through the contact page and a moderator will take a look.',
        ),
      ]),
    ],
  },
  {
    _id: 'page-newsletter',
    _type: 'page',
    _placeholder: true,
    title: 'Newsletter',
    slug: { current: 'newsletter' },
    sections: [
      {
        _type: 'newsletterBlock',
        _key: 'newsletter-1',
        heading: 'Join the newsletter',
        body: 'Occasional emails about new Learn hub articles, events and ways to get involved. No spam, unsubscribe any time.',
        buttonLabel: 'Subscribe',
        successMessage: 'Check your inbox to confirm your subscription.',
        variant: 'card',
        animation: 'subtle',
      },
    ],
  },
]

export function getPageBySlug(slug: string) {
  return pages.find((p) => p.slug.current === slug)
}
