import type { HeroValue, PageBuilderBlock, RichTextValue, SanityImage } from '../types'

export const aboutPageHero: HeroValue = {
  eyebrow: 'About us',
  headline: 'Born from the need for better.\nBuilt for change.',
  subline:
    'Cysters in Action is a PMOS advocacy initiative committed to making reliable health information, meaningful community and collective action more accessible to people living with PMOS.',
  heroMedia: {
    mediaType: 'image',
    image: {
      url: '/placeholder/about-hero.jpg',
      alt: 'Close-up of several hands held together in a show of unity',
      credit: 'Thirdman / Pexels',
    },
  },
  overlayStrength: 50,
  overlayDirection: 'left',
  height: 'medium',
  textAlign: 'left',
}

// A plain-text paragraph + optional heading, as a portable-text block pair —
// keeps the fixture below from repeating this shape six times over.
function paragraph(key: string, text: string) {
  return {
    _type: 'block',
    _key: key,
    style: 'normal',
    children: [{ _type: 'span', _key: `${key}-span`, text }],
  }
}
function heading(key: string, text: string) {
  return {
    _type: 'block',
    _key: key,
    style: 'h3',
    children: [{ _type: 'span', _key: `${key}-span`, text }],
  }
}

export const aboutPageStory: RichTextValue = [
  paragraph(
    'story-belief',
    'We believe no one should have to navigate PMOS alone, and that lived experiences deserve a place in shaping the conversations, care and change that affect us.',
  ),
  heading('story-heading', 'Our Story'),
  paragraph(
    'story-1',
    'Cysters in Action was born out of a recognition that the experience of living with PMOS deserves better.',
  ),
  paragraph(
    'story-2',
    'For many people, navigating PMOS comes with unanswered questions, misinformation, stigma and the challenge of finding reliable information and meaningful support. Too often, people are left to figure things out on their own, with limited opportunities to have their experiences heard and understood.',
  ),
  paragraph('story-3', 'We believe this experience should be different.'),
  paragraph(
    'story-4',
    'Cysters in Action was established to help bridge these gaps by creating a space where people living with PMOS can learn from reliable information, connect through shared experiences and contribute to conversations that influence how the condition is understood and addressed.',
  ),
  paragraph(
    'story-5',
    'What began as a desire to make a difference is growing into a community built on shared learning, collective voices and purposeful action.',
  ),
  paragraph(
    'story-6',
    'We are building this initiative with the PMOS community, not simply for it. Because the people who live with PMOS should have a meaningful role in shaping the conversations, support and change that affect their lives.',
  ),
  heading('story-mission-heading', 'Our Mission'),
  paragraph(
    'story-mission-body',
    'To empower people living with Polyendocrine Metabolic Ovarian Syndrome (PMOS), formerly known as PCOS, through reliable health education, peer support, meaningful action and collective advocacy. We aim to create a community where people can learn about their health, share experiences, support one another and use their collective voices to contribute to better awareness, understanding and health outcomes.',
  ),
  heading('story-vision-heading', 'Our Vision'),
  paragraph(
    'story-vision-body',
    'To build an informed, connected and empowered community of people living with PMOS, whose collective experiences and voices drive greater awareness, better support and meaningful change in PMOS care and advocacy, both locally and globally.',
  ),
  paragraph(
    'story-founders-1',
    'Every meaningful movement begins with people who believe that things can be better.',
  ),
  paragraph(
    'story-founders-2',
    'The Cysters in Action Founders Circle brings together the founder and 15 individuals united by a shared commitment to improving the PMOS experience. Coming from different backgrounds, experiences and parts of the world, these individuals are part of the foundation upon which this initiative is being built.',
  ),
  paragraph(
    'story-founders-3',
    'They represent the voices, perspectives and collective commitment that make Cysters in Action more than an idea. We are grateful to have them as part of this beginning.',
  ),
]

// Same photo as this page's own Hero (aboutPageHero above) — no dedicated
// "our story" photo exists yet, so this reuses it rather than inventing a
// new placeholder image.
export const aboutPageStoryImage: SanityImage = {
  url: '/placeholder/about-hero.jpg',
  alt: 'Close-up of several hands held together in a show of unity',
  credit: 'Thirdman / Pexels',
}

export const aboutPagePillars = [
  {
    title: 'Learn',
    icon: 'learn' as const,
    body: 'Clear, medically-reviewed health information, kept up to date.',
    image: {
      url: '/placeholder/pillar-learn.jpg',
      alt: 'Woman reading her notes',
      credit: 'Pixabay / Pexels',
    } satisfies SanityImage,
  },
  {
    title: 'Connect',
    icon: 'connect' as const,
    body: 'Stories and events that remind you you’re not the only one.',
    image: {
      url: '/placeholder/pillar-connect.jpg',
      alt: 'Photo of women sitting while talking',
      credit: 'RF._.studio / Pexels',
    } satisfies SanityImage,
  },
  {
    title: 'Act',
    icon: 'act' as const,
    body: 'Turning community into pressure for better care, together.',
    image: {
      url: '/placeholder/pillar-act.jpg',
      alt: 'Smiling woman carrying a donation box',
      credit: 'Gustavo Fring / Pexels',
    } satisfies SanityImage,
  },
]

export const aboutPageValues = [
  {
    title: 'Evidence over anecdote',
    body: 'Every Learn hub article carries a medical reviewer and a last-reviewed date.',
  },
  { title: 'Privacy by default', body: 'Anonymous means anonymous — no exceptions, ever.' },
  {
    title: 'Nothing about us without us',
    body: 'People living with PMOS shape what we publish and how we run events.',
  },
]

// Same `hive` component as the homepage's closing section, with About-
// specific heading/body — HiveNewsletter already takes these as props
// (eyebrow/heading/body), so no component changes were needed, just
// different fixture copy.
export const aboutPageSections: PageBuilderBlock[] = [
  {
    _type: 'newsletterBlock',
    _key: 'about-newsletter',
    eyebrow: 'Join us',
    heading: 'Want to be part of this?',
    body: 'Join the newsletter to hear from the community, get first word on events, and stay close to what we’re building.',
    buttonLabel: 'Join',
    variant: 'hive',
    animation: 'exaggerated',
  },
]
