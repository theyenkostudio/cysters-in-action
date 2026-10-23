import type { GlossaryTermRef, RichTextValue } from '../types'
import { articles } from './articles'

function paragraph(key: string, text: string): RichTextValue[number] {
  return {
    _type: 'block',
    _key: key,
    style: 'normal',
    children: [{ _type: 'span', _key: `${key}-span`, text }],
  }
}

const whatIsPmos = articles.find((a) => a.slug.current === 'what-is-pmos-a-plain-language-guide')!
const howDiagnosed = articles.find((a) => a.slug.current === 'how-pmos-is-diagnosed')!

type GlossaryFixture = GlossaryTermRef & { _placeholder: true }

export const glossaryTerms: GlossaryFixture[] = [
  {
    _id: 'glossary-anovulation',
    _type: 'glossaryTerm',
    _placeholder: true,
    term: 'Anovulation',
    slug: { current: 'anovulation' },
    pronunciation: 'an-ov-yoo-LAY-shun',
    shortDefinition: 'A menstrual cycle in which an egg is not released from the ovary.',
    fullExplanation: [
      paragraph(
        'p1',
        'Anovulation means a cycle where ovulation doesn’t happen. It can cause irregular or missed periods and is one of the reasons PMOS can make conceiving take longer for some people.',
      ),
    ],
    relatedArticles: [whatIsPmos],
  },
  {
    _id: 'glossary-androgen',
    _type: 'glossaryTerm',
    _placeholder: true,
    term: 'Androgen',
    slug: { current: 'androgen' },
    alsoKnownAs: ['Androgens'],
    shortDefinition:
      'A group of hormones, including testosterone, present in everyone but often elevated in PMOS.',
    fullExplanation: [
      paragraph(
        'p1',
        'Androgens are sometimes called "male hormones," but everyone produces them. Higher-than-typical androgen levels are one of the patterns clinicians look for when considering a PMOS diagnosis.',
      ),
    ],
    relatedArticles: [whatIsPmos],
  },
  {
    _id: 'glossary-insulin-resistance',
    _type: 'glossaryTerm',
    _placeholder: true,
    term: 'Insulin resistance',
    slug: { current: 'insulin-resistance' },
    shortDefinition:
      'When cells respond less to insulin, often prompting the body to produce more of it.',
    fullExplanation: [
      paragraph(
        'p1',
        'Insulin resistance is common alongside PMOS, though not everyone with PMOS has it. It’s one of several things a clinician may test for as part of a fuller picture of your health.',
      ),
    ],
    relatedTerms: [],
  },
  {
    _id: 'glossary-endocrinologist',
    _type: 'glossaryTerm',
    _placeholder: true,
    term: 'Endocrinologist',
    slug: { current: 'endocrinologist' },
    shortDefinition: 'A doctor who specialises in hormones and the glands that produce them.',
    fullExplanation: [
      paragraph(
        'p1',
        'An endocrinologist treats conditions related to hormones — thyroid, diabetes, and sometimes PMOS, often alongside a gynaecologist.',
      ),
    ],
    relatedArticles: [howDiagnosed],
  },
  {
    _id: 'glossary-transvaginal-ultrasound',
    _type: 'glossaryTerm',
    _placeholder: true,
    term: 'Transvaginal ultrasound',
    slug: { current: 'transvaginal-ultrasound' },
    alsoKnownAs: ['Pelvic ultrasound'],
    shortDefinition: 'An internal ultrasound scan used to look at the ovaries and uterus.',
    fullExplanation: [
      paragraph(
        'p1',
        'This scan can show the appearance of the ovaries, but it’s only one part of a PMOS diagnosis — plenty of people without PMOS have ovaries that look similar on a scan.',
      ),
    ],
    relatedArticles: [howDiagnosed],
  },
  {
    _id: 'glossary-metabolic-syndrome',
    _type: 'glossaryTerm',
    _placeholder: true,
    term: 'Metabolic syndrome',
    slug: { current: 'metabolic-syndrome' },
    shortDefinition:
      'A cluster of conditions — blood pressure, blood sugar, weight — that raise other health risks.',
    fullExplanation: [
      paragraph(
        'p1',
        'People with PMOS have a higher chance of some of the factors that make up metabolic syndrome. It’s a reason routine check-ups matter, not a diagnosis in itself.',
      ),
    ],
  },
  {
    _id: 'glossary-amenorrhea',
    _type: 'glossaryTerm',
    _placeholder: true,
    term: 'Amenorrhea',
    slug: { current: 'amenorrhea' },
    pronunciation: 'ay-men-oh-REE-uh',
    shortDefinition: 'The absence of a menstrual period.',
    fullExplanation: [
      paragraph(
        'p1',
        'Amenorrhea means periods have stopped or never started. It has many possible causes, and PMOS is one of them — worth raising with a clinician rather than waiting it out.',
      ),
    ],
  },
]

export function getGlossaryTermBySlug(slug: string) {
  return glossaryTerms.find((t) => t.slug.current === slug)
}

export function letterFor(term: string): string {
  return term.charAt(0).toUpperCase()
}
