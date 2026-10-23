import type { TeamMemberRef } from '../types'

// Names are deliberately obviously-fictional (Lorem/Ipsum/Sample/Fixture/Draft)
// rather than realistic ones, per instruction — and no photo is attached (see
// components/ui/avatar.tsx, which renders initials instead). A stock photo
// paired with a semi-realistic name on an official "About" page could read
// as a real person; this avoids that entirely. Replace both name and photo
// with the real Founding Circle once the client provides them.
export const teamMembers: (TeamMemberRef & { _placeholder: true })[] = [
  {
    _id: 'team-adwoa-lorem',
    _type: 'teamMember',
    _placeholder: true,
    name: 'Adwoa Lorem',
    role: 'Founder & Executive Director',
    group: 'foundingCircle',
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
    bio: 'Placeholder bio — runs events and the volunteer programme.',
    quote: 'The best events are the ones where people stop performing okay-ness.',
    order: 5,
  },
]
