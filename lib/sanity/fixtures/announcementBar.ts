import { routeLink } from './links'

export const announcementBar = {
  _placeholder: true as const,
  label: 'PREVIEW',
  message:
    'This site is a content preview — articles, bios and copy are placeholders until launch.',
  link: routeLink('Learn more', '/about'),
  dismissible: true,
  tone: 'brand' as const,
}
