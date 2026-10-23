import type { ArticleRef, RichTextValue } from '../types'
import { getAuthorById } from './authors'
import { getCategoryBySlug } from './categories'

const placeholderSource = {
  title: 'Placeholder source — replace with a reviewed clinical reference before launch',
  publisher: 'Cysters In Action editorial team',
  year: 2026,
}

function paragraph(key: string, text: string): RichTextValue[number] {
  return {
    _type: 'block',
    _key: key,
    style: 'normal',
    children: [{ _type: 'span', _key: `${key}-span`, text }],
  }
}

const writer = getAuthorById('author-nana-adjei')!
const reviewer = getAuthorById('author-dr-efua-mensah')!
const communityWriter = getAuthorById('author-kwesi-owusu')!
const understandingPmos = getCategoryBySlug('understanding-pmos')!
const mythBusting = getCategoryBySlug('myth-busting')!
const talkingToYourDoctor = getCategoryBySlug('talking-to-your-doctor')!
const livingWell = getCategoryBySlug('living-well')!

type ArticleFixture = ArticleRef & { _placeholder: true }

export const articles: ArticleFixture[] = [
  {
    _id: 'article-what-is-pmos',
    _type: 'article',
    _placeholder: true,
    title: 'What Is PMOS? A Plain-Language Guide',
    slug: { current: 'what-is-pmos-a-plain-language-guide' },
    articleType: 'explainer',
    category: understandingPmos,
    tags: ['basics', 'diagnosis'],
    standfirst:
      'A starting point if you’ve just heard the term PMOS — what it is, common signs, and why a clear diagnosis matters.',
    mainImage: {
      url: '/placeholder/category-explainer.jpg',
      alt: 'A hand gently cradling a small green seedling',
      credit: 'Akil Mazumder / Pexels',
    },
    body: [
      paragraph(
        'b1',
        'PMOS is a hormonal condition that can affect periods, fertility, skin and weight. It’s common, but it still takes many people years to get a clear diagnosis — often because symptoms show up differently from person to person.',
      ),
      paragraph(
        'b2',
        'There is no single test for PMOS. Instead, a clinician usually looks at your symptoms, a physical exam, blood tests and sometimes an ultrasound together, over more than one appointment.',
      ),
      paragraph(
        'b3',
        'None of this is a substitute for seeing a doctor about your own symptoms — think of this page as a starting point for the conversation, not the end of it.',
      ),
    ],
    author: writer,
    medicalReviewer: reviewer,
    publishedAt: '2026-02-03T09:00:00.000Z',
    lastReviewedAt: '2026-02-03T09:00:00.000Z',
    sources: [placeholderSource],
    featured: true,
  },
  {
    _id: 'article-how-pmos-is-diagnosed',
    _type: 'article',
    _placeholder: true,
    title: 'How PMOS Is Diagnosed',
    slug: { current: 'how-pmos-is-diagnosed' },
    articleType: 'explainer',
    category: understandingPmos,
    tags: ['diagnosis', 'appointments'],
    standfirst:
      'What to expect across the appointments, tests and questions that usually lead to a diagnosis.',
    mainImage: {
      url: '/placeholder/learn-hub-hero.jpg',
      alt: 'A stack of books on a table',
      credit: 'Darya Grey_Owl / Pexels',
    },
    body: [
      paragraph(
        'b1',
        'Getting diagnosed usually isn’t a single visit. Clinicians build a picture over time — your cycle history, any symptoms you’ve noticed, a physical exam, and some blood work.',
      ),
      paragraph(
        'b2',
        'An ultrasound can help, but it isn’t required for everyone, and having ovaries that look polycystic on a scan doesn’t automatically mean a diagnosis — plenty of people without PMOS have that too.',
      ),
      paragraph(
        'b3',
        'If something doesn’t feel resolved after an appointment, it’s reasonable to ask what happens next, or to ask for a referral.',
      ),
    ],
    author: writer,
    medicalReviewer: reviewer,
    publishedAt: '2026-02-10T09:00:00.000Z',
    lastReviewedAt: '2026-02-10T09:00:00.000Z',
    sources: [placeholderSource],
    relatedArticles: [],
  },
  {
    _id: 'article-five-myths-about-pmos',
    _type: 'article',
    _placeholder: true,
    title: '5 Myths About PMOS We Need to Retire',
    slug: { current: '5-myths-about-pmos-we-need-to-retire' },
    articleType: 'mythBuster',
    category: mythBusting,
    tags: ['myths', 'stigma'],
    standfirst:
      'Some of the most common misconceptions about PMOS, and what the evidence actually says.',
    mainImage: {
      url: '/placeholder/category-mythbuster.jpg',
      alt: 'A clear lightbulb against a bright background',
      credit: 'Eric Anada / Pexels',
    },
    body: [
      paragraph(
        'b1',
        'Misinformation about PMOS travels fast, and a lot of it adds unnecessary shame to an already frustrating diagnosis. Here are five claims worth questioning.',
      ),
    ],
    myths: [
      {
        myth: 'PMOS only affects people who are overweight.',
        fact: 'PMOS affects bodies of every size. Weight can influence symptoms, but it isn’t the cause and it isn’t a requirement for diagnosis.',
      },
      {
        myth: 'If your scan looks normal, you don’t have PMOS.',
        fact: 'Diagnosis looks at the whole picture — symptoms and blood work matter as much as, or more than, what shows up on a scan.',
      },
      {
        myth: 'There’s nothing you can do about it.',
        fact: 'Treatment and day-to-day management vary by person, but there are real options — from medical treatment to lifestyle support — worth discussing with a clinician.',
      },
    ],
    author: writer,
    medicalReviewer: reviewer,
    publishedAt: '2026-02-17T09:00:00.000Z',
    lastReviewedAt: '2026-02-17T09:00:00.000Z',
    sources: [placeholderSource],
    featured: true,
  },
  {
    _id: 'article-myth-pmos-and-fertility',
    _type: 'article',
    _placeholder: true,
    title: 'Myth: PMOS Means You Can’t Have Children',
    slug: { current: 'myth-pmos-means-you-cant-have-children' },
    articleType: 'mythBuster',
    category: mythBusting,
    tags: ['myths', 'fertility'],
    standfirst:
      'PMOS can make conceiving take longer for some people — it doesn’t mean it won’t happen.',
    mainImage: {
      url: '/placeholder/problem-solution.jpg',
      alt: 'A hand holding a small plant against the sky',
      credit: 'Victor Santos / Pexels',
    },
    body: [
      paragraph(
        'b1',
        'This is one of the first things many people hear after a diagnosis, and it isn’t the full story. PMOS is one of several factors that can affect fertility, not a guarantee against it.',
      ),
      paragraph(
        'b2',
        'Many people with PMOS conceive without medical help; others need support from a fertility specialist. Either way, it’s worth talking to a doctor early rather than assuming the worst.',
      ),
    ],
    myths: [
      {
        myth: 'A PMOS diagnosis means fertility treatment is inevitable.',
        fact: 'Some people need support, many don’t. It depends on the person, not the diagnosis alone.',
      },
    ],
    author: writer,
    medicalReviewer: reviewer,
    publishedAt: '2026-02-24T09:00:00.000Z',
    lastReviewedAt: '2026-02-24T09:00:00.000Z',
    sources: [placeholderSource],
    contentWarning: 'Mentions fertility and conception.',
  },
  {
    _id: 'article-questions-for-your-first-appointment',
    _type: 'article',
    _placeholder: true,
    title: 'Questions to Ask at Your First PMOS Appointment',
    slug: { current: 'questions-to-ask-at-your-first-pmos-appointment' },
    articleType: 'doctorGuide',
    category: talkingToYourDoctor,
    tags: ['appointments', 'checklist'],
    standfirst:
      'A printable checklist of questions to bring with you — because it’s easy to forget them in the room.',
    mainImage: {
      url: '/placeholder/category-doctorguide.jpg',
      alt: 'Close-up of a hand writing notes in a notebook',
      credit: 'Анна Саталова / Pexels',
    },
    body: [
      paragraph(
        'b1',
        'Appointments can go quickly, and it’s normal to leave with more questions than you walked in with. Writing questions down beforehand — and bringing a copy for your notes — helps.',
      ),
    ],
    doctorQuestions: [
      {
        question: 'What led you to this diagnosis, specifically?',
        whyItMatters:
          'Understanding which symptoms and tests mattered most helps you track changes over time.',
      },
      {
        question: 'What are my options, and what would you recommend first?',
        whyItMatters:
          'Treatment is rarely one-size-fits-all — it helps to know the full menu, not just one option.',
      },
      {
        question: 'What should I expect in the next 6–12 months?',
        whyItMatters:
          'Knowing what "normal" looks like for your treatment plan makes it easier to spot when something needs attention.',
      },
      {
        question: 'Who do I contact between appointments if something changes?',
        whyItMatters:
          'Having a clear next step reduces the anxiety of waiting for your next scheduled visit.',
      },
    ],
    author: writer,
    medicalReviewer: reviewer,
    publishedAt: '2026-03-03T09:00:00.000Z',
    lastReviewedAt: '2026-03-03T09:00:00.000Z',
    sources: [placeholderSource],
    featured: true,
  },
  {
    _id: 'article-living-well-small-habits',
    _type: 'article',
    _placeholder: true,
    title: 'Living Well with PMOS: Small Habits That Help',
    slug: { current: 'living-well-with-pmos-small-habits-that-help' },
    articleType: 'personalInsight',
    category: livingWell,
    tags: ['lifestyle', 'wellbeing'],
    standfirst:
      'One community member’s honest account of the small, sustainable changes that made daily life easier.',
    mainImage: {
      url: '/placeholder/category-livingwell.jpg',
      alt: 'A warm cup of tea in soft sunlight',
      credit: 'Derya Nur / Pexels',
    },
    body: [
      paragraph(
        'b1',
        'When my sister was diagnosed, the advice she got online was overwhelming — strict diets, expensive supplements, a lot of guilt. What actually helped her was much smaller.',
      ),
      paragraph(
        'b2',
        'Regular meals instead of skipped ones. A short walk most days, not a punishing routine. A doctor she trusted enough to call with the small questions, not just the big ones.',
      ),
      paragraph(
        'b3',
        'None of this is medical advice — it’s just what made an overwhelming diagnosis feel more livable for one family. Your own small habits might look completely different.',
      ),
    ],
    author: communityWriter,
    medicalReviewer: reviewer,
    publishedAt: '2026-03-10T09:00:00.000Z',
    lastReviewedAt: '2026-03-10T09:00:00.000Z',
    sources: [placeholderSource],
  },
]

export function getArticleBySlug(slug: string) {
  return articles.find((a) => a.slug.current === slug)
}

export function getArticlesByCategory(categorySlug: string) {
  return articles.filter((a) => a.category.slug.current === categorySlug)
}

// Wire up relatedArticles now that every article exists.
articles[0].relatedArticles = [articles[1], articles[2]]
articles[1].relatedArticles = [articles[0], articles[4]]
articles[2].relatedArticles = [articles[3], articles[0]]
articles[3].relatedArticles = [articles[2]]
articles[4].relatedArticles = [articles[0], articles[1]]
articles[5].relatedArticles = [articles[0], articles[2]]
