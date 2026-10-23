import type { AuthorRef } from '../types'

export const authors: (AuthorRef & { _placeholder: true })[] = [
  {
    _id: 'author-nana-adjei',
    _type: 'author',
    _placeholder: true,
    name: 'Nana Adjei',
    slug: { current: 'nana-adjei' },
    role: 'writer',
    credentials: 'Health writer',
    bio: 'Nana writes the Learn hub’s explainers and myth-busters, translating research into plain language.',
  },
  {
    _id: 'author-dr-efua-mensah',
    _type: 'author',
    _placeholder: true,
    name: 'Dr. Efua Mensah',
    slug: { current: 'dr-efua-mensah' },
    role: 'medicalReviewer',
    credentials: 'MD, Gynaecologist',
    bio: 'Dr. Mensah reviews every Learn article for medical accuracy before it is published.',
  },
  {
    _id: 'author-kwesi-owusu',
    _type: 'author',
    _placeholder: true,
    name: 'Kwesi Owusu',
    slug: { current: 'kwesi-owusu' },
    role: 'communityMember',
    credentials: 'Community contributor',
    bio: 'Kwesi contributes personal-insight pieces drawing on his family’s experience with PMOS.',
  },
]

export function getAuthorById(id: string) {
  return authors.find((a) => a._id === id)
}
