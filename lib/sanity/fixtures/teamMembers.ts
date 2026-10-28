import type { TeamMemberRef } from '../types'

// Names are deliberately obviously-fictional (Lorem/Ipsum/Sample/Fixture/Draft)
// rather than realistic ones, per instruction. Photos point at the existing
// abstract/thematic images under public/placeholder (not stock headshots —
// pairing a real-looking face with a fictional name on an official "About"
// page could read as a real person), just to give the Founding Circle slider
// cards something to render. Replace both name and photo with the real
// Founding Circle once the client provides them.
const placeholderPhoto = (file: string, alt: string) => ({
  url: `/placeholder/${file}.jpg`,
  alt,
})

export const teamMembers: (TeamMemberRef & { _placeholder: true })[] = [
  {
    _id: 'team-adwoa-lorem',
    _type: 'teamMember',
    _placeholder: true,
    name: 'Adwoa Lorem',
    role: 'Founder & Executive Director',
    group: 'foundingCircle',
    photo: placeholderPhoto('pillar-learn', ''),
    bio: 'Placeholder bio — founding story and background to be supplied by the client.',
    quote:
      'We started Cysters In Action because no one should have to Google their diagnosis alone.',
    order: 1,
  },
  {
    _id: 'team-kofi-ipsum',
    _type: 'teamMember',
    _placeholder: true,
    name: 'Kofi Ipsum',
    role: 'Head of Community',
    group: 'foundingCircle',
    photo: placeholderPhoto('pillar-connect', ''),
    bio: 'Placeholder bio — leads moderation and the Share Your Story programme.',
    quote: 'Every story we publish is someone’s first time saying it out loud.',
    order: 2,
  },
  {
    _id: 'team-esi-sample',
    _type: 'teamMember',
    _placeholder: true,
    name: 'Esi Sample',
    role: 'Medical Advisor',
    group: 'foundingCircle',
    photo: placeholderPhoto('pillar-act', ''),
    bio: 'Placeholder bio — oversees medical review of Learn hub content.',
    quote: 'Good information shouldn’t be harder to find than bad information.',
    order: 3,
  },
  {
    _id: 'team-yaw-fixture',
    _type: 'teamMember',
    _placeholder: true,
    name: 'Yaw Fixture',
    role: 'Partnerships Lead',
    group: 'foundingCircle',
    photo: placeholderPhoto('wwsu-learn', ''),
    bio: 'Placeholder bio — builds relationships with clinics and partner organisations.',
    quote: 'Collective action means nobody carries this alone.',
    order: 4,
  },
  {
    _id: 'team-abena-draft',
    _type: 'teamMember',
    _placeholder: true,
    name: 'Abena Draft',
    role: 'Programmes Coordinator',
    group: 'foundingCircle',
    photo: placeholderPhoto('wwsu-connect', ''),
    bio: 'Placeholder bio — runs events and the volunteer programme.',
    quote: 'The best events are the ones where people stop performing okay-ness.',
    order: 5,
  },
]
