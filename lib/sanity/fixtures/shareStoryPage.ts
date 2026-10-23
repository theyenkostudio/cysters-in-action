import type { HeroValue, RichTextValue } from '../types'

export const shareStoryPageHero: HeroValue = {
  eyebrow: 'Connect',
  headline: 'Share your story',
  subline:
    'However you want to tell it — named or anonymous — your story can help someone else feel less alone.',
  heroMedia: {
    mediaType: 'image',
    image: {
      url: '/placeholder/cta-closing.jpg',
      alt: 'Close-up of several hands held together',
      credit: 'Shane / Pexels',
    },
  },
  overlayStrength: 50,
  overlayDirection: 'left',
  height: 'medium',
  textAlign: 'left',
}

export const shareStoryPageIntro: RichTextValue = [
  {
    _type: 'block',
    _key: 'intro-1',
    style: 'normal',
    children: [
      {
        _type: 'span',
        _key: 'intro-1-span',
        text: 'Every story here was shared by someone living with PMOS. You can share yours with your name attached or completely anonymously — it’s entirely your choice, and you can change your mind later.',
      },
    ],
  },
]

export const shareStoryWhatHappensNext = [
  {
    title: 'A moderator reads it',
    body: 'Every submission is read by a real person before anything happens with it.',
  },
  {
    title: 'We check in if we need to',
    body: 'If something needs a light edit or more context, we’ll ask — nothing changes without your okay.',
  },
  {
    title: 'It goes live once approved',
    body: 'Your story joins the community stories page, exactly as you intended it.',
  },
]

export const shareStoryConsentText: RichTextValue = [
  {
    _type: 'block',
    _key: 'consent-1',
    style: 'normal',
    children: [
      {
        _type: 'span',
        _key: 'consent-1-span',
        text: 'By submitting, you confirm this is your own story and agree to the consent choices below. You can request removal at any time — see the confirmation email we send you.',
      },
    ],
  },
]

export const shareStoryPrivacyNote =
  'Your email is used only to confirm your submission and, if you agreed, to follow up — it is never shown publicly.'

export const shareStorySuccessHeading = 'Thank you for sharing.'
export const shareStorySuccessMessage =
  'A moderator will read your story soon. We’ll email you once it’s reviewed.'
export const shareStorySubmissionsOpen = true
