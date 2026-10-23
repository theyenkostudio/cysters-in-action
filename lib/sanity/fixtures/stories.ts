import type { RichTextValue, StoryRef } from '../types'

function paragraph(key: string, text: string): RichTextValue[number] {
  return {
    _type: 'block',
    _key: key,
    style: 'normal',
    children: [{ _type: 'span', _key: `${key}-span`, text }],
  }
}

// All status: 'approved' (only status the public fixtures/queries ever
// return). Two are anonymous — isAnonymous: true means authorName is never
// read by any component, even though a couple of these fixtures happen to
// carry one in the data (see getStories' resolveAuthorName below, which
// mirrors the GROQ projection's `select(isAnonymous => null, authorName)`).
// Named stories use the same obviously-fictional naming convention as
// teamMembers.ts, for the same reason: this is demo content, not a real
// submission.
export const stories: (StoryRef & { _placeholder: true })[] = [
  {
    _id: 'story-anonymous-diagnosis',
    _type: 'story',
    _placeholder: true,
    title: 'Three years, four doctors, one answer',
    slug: { current: 'three-years-four-doctors-one-answer' },
    isAnonymous: true,
    authorName: 'Should never render — isAnonymous is true',
    themes: ['diagnosis', 'mental health'],
    pullQuote: 'I stopped believing I was exaggerating once I finally had a name for it.',
    body: [
      paragraph(
        'b1',
        'For three years I was told it was stress, then my weight, then "just one of those things." Every doctor had a different theory and none of them stuck around long enough to follow up.',
      ),
      paragraph(
        'b2',
        'The fourth doctor actually looked at the pattern across all my notes instead of starting from zero. Having a name for what was happening to my body changed how I talked about it — to doctors, to my family, to myself.',
      ),
      paragraph(
        'b3',
        'If you’re still in the "four doctors" stage: it’s not in your head, and it’s worth the fourth appointment.',
      ),
    ],
    submittedAt: '2026-01-12T10:00:00.000Z',
    approvedAt: '2026-01-15T09:00:00.000Z',
    featured: true,
  },
  {
    _id: 'story-priscilla-sampleton-fertility',
    _type: 'story',
    _placeholder: true,
    title: 'What I wish someone had told me about trying to conceive',
    slug: { current: 'what-i-wish-someone-had-told-me-about-trying-to-conceive' },
    isAnonymous: false,
    authorName: 'Priscilla Sampleton',
    ageRange: '25-34',
    country: 'Ghana',
    themes: ['fertility', 'relationships'],
    contentWarning: 'Mentions pregnancy loss.',
    pullQuote: 'Nobody warned me that the waiting would be harder than the appointments.',
    body: [
      paragraph(
        'b1',
        'We tried for a year before anyone suggested PMOS might be part of the picture. In that year I learned more about my own cycle than I had in the previous decade, mostly out of necessity.',
      ),
      paragraph(
        'b2',
        'We had a loss early on, and almost nobody talks about how common that is or how to carry it alongside hope for next time. My husband and I found our footing by being honest with each other about the bad days, not just the good ones.',
      ),
      paragraph(
        'b3',
        'We’re still trying. I’m sharing this because the silence around this part of PMOS made everything harder than it needed to be.',
      ),
    ],
    submittedAt: '2026-02-02T10:00:00.000Z',
    approvedAt: '2026-02-05T09:00:00.000Z',
    featured: true,
  },
  {
    _id: 'story-anonymous-work',
    _type: 'story',
    _placeholder: true,
    title: 'Explaining a flare-up to my manager',
    slug: { current: 'explaining-a-flare-up-to-my-manager' },
    isAnonymous: true,
    authorName: 'Should never render — isAnonymous is true',
    themes: ['work', 'nutrition'],
    pullQuote: 'I practised the sentence in my car for ten minutes before I said it out loud.',
    body: [
      paragraph(
        'b1',
        'Flare-ups don’t care about deadlines. I spent years pushing through pain at my desk because I didn’t know how to explain a condition most people have never heard of without it turning into a whole seminar.',
      ),
      paragraph(
        'b2',
        'Eventually I wrote one sentence and practised it until it felt normal to say: "I have a hormonal condition that sometimes needs a sick day, no different from a migraine." That was enough. Most people didn’t need the whole explanation — they needed permission to not ask for one.',
      ),
    ],
    submittedAt: '2026-02-18T10:00:00.000Z',
    approvedAt: '2026-02-20T09:00:00.000Z',
  },
  {
    _id: 'story-yaw-draftworth-nutrition',
    _type: 'story',
    _placeholder: true,
    title: 'Cooking for one diagnosis in a house that cooks for six',
    slug: { current: 'cooking-for-one-diagnosis-in-a-house-that-cooks-for-six' },
    isAnonymous: false,
    authorName: 'Yaw Draftworth',
    ageRange: '35-44',
    country: 'Ghana',
    themes: ['nutrition', 'relationships'],
    pullQuote:
      'I stopped trying to eat differently from my family and started cooking differently, together.',
    body: [
      paragraph(
        'b1',
        'When my partner was diagnosed, every article we found assumed someone with a lot of spare time and a kitchen to themselves. We have four kids and one stove.',
      ),
      paragraph(
        'b2',
        'What actually worked was small substitutions in meals we already made, not a separate diet. Nobody in the house noticed when dinner changed slightly; they just noticed that she had more good days than bad ones.',
      ),
    ],
    submittedAt: '2026-03-01T10:00:00.000Z',
    approvedAt: '2026-03-04T09:00:00.000Z',
  },
]

export function getStoryBySlug(slug: string) {
  return stories.find((s) => s.slug?.current === slug)
}

/** Mirrors the GROQ projection's `select(isAnonymous => null, authorName)`. */
export function resolveAuthorName(story: StoryRef): string | undefined {
  return story.isAnonymous ? undefined : story.authorName
}
