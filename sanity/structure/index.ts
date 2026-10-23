import type { StructureResolver } from 'sanity/structure'
import { SINGLETON_TYPES } from '../schemaTypes'

const EXCLUDED_FROM_OTHER = new Set([
  ...SINGLETON_TYPES,
  'page',
  'article',
  'category',
  'author',
  'teamMember',
  'testimonial',
  'contactSubmission',
])

// Desk structure (Phase 1 shell + Phase 2 content + Phase 3 forms): Site
// singletons, Pages (Home/About/Learn hub/Contact singletons + generic
// pages), Learn (articles, categories, authors), People (team),
// Testimonials, Inbox (contact submissions). Connect / Stories inbox
// groups are added as their document types ship in Phase 4.
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Site')
        .child(
          S.list()
            .title('Site')
            .items([
              S.listItem()
                .title('Settings')
                .child(S.document().schemaType('siteSettings').documentId('siteSettings')),
              S.listItem()
                .title('Navigation')
                .child(S.document().schemaType('navigation').documentId('navigation')),
              S.listItem()
                .title('Footer')
                .child(S.document().schemaType('footer').documentId('footer')),
              S.listItem()
                .title('Announcement bar')
                .child(S.document().schemaType('announcementBar').documentId('announcementBar')),
            ]),
        ),
      S.divider(),
      S.listItem()
        .title('Pages')
        .child(
          S.list()
            .title('Pages')
            .items([
              S.listItem()
                .title('Home page')
                .child(S.document().schemaType('homePage').documentId('homePage')),
              S.listItem()
                .title('About page')
                .child(S.document().schemaType('aboutPage').documentId('aboutPage')),
              S.listItem()
                .title('Learn hub page')
                .child(S.document().schemaType('learnHubPage').documentId('learnHubPage')),
              S.listItem()
                .title('Contact page')
                .child(S.document().schemaType('contactPage').documentId('contactPage')),
              S.divider(),
              S.listItem()
                .title('Other pages')
                .child(S.documentTypeList('page').title('Other pages')),
            ]),
        ),
      S.listItem()
        .title('Learn')
        .child(
          S.list()
            .title('Learn')
            .items([
              S.listItem().title('Articles').child(S.documentTypeList('article').title('Articles')),
              S.listItem()
                .title('Categories')
                .child(S.documentTypeList('category').title('Categories')),
              S.listItem().title('Authors').child(S.documentTypeList('author').title('Authors')),
            ]),
        ),
      S.listItem().title('People').child(S.documentTypeList('teamMember').title('Team members')),
      S.listItem()
        .title('Testimonials')
        .child(S.documentTypeList('testimonial').title('Testimonials')),
      S.divider(),
      S.listItem()
        .title('Inbox')
        .child(
          S.list()
            .title('Inbox')
            .items([
              S.listItem()
                .title('Contact submissions')
                .child(S.documentTypeList('contactSubmission').title('Contact submissions')),
            ]),
        ),
      S.divider(),
      ...S.documentTypeListItems().filter(
        (item) => item.getId() && !EXCLUDED_FROM_OTHER.has(item.getId() as string),
      ),
    ])
