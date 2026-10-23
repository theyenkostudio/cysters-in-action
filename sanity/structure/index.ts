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
  'event',
  'eventRsvp',
  'story',
  'glossaryTerm',
])

// Desk structure (Phase 1 shell + Phase 2 content + Phase 3 forms + Phase 4
// community features): Site singletons, Pages, Learn (articles, categories,
// authors, glossary), People, Testimonials, Connect (events, RSVPs), Stories
// inbox (grouped by status, with the custom Approve & publish / Request
// changes / Reject actions — see sanity/actions/storyActions.tsx), Inbox.
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
                .title('Share your story page')
                .child(S.document().schemaType('shareStoryPage').documentId('shareStoryPage')),
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
              S.listItem()
                .title('Glossary')
                .child(S.documentTypeList('glossaryTerm').title('Glossary')),
            ]),
        ),
      S.listItem()
        .title('Connect')
        .child(
          S.list()
            .title('Connect')
            .items([
              S.listItem()
                .title('Upcoming events')
                .child(
                  S.documentList()
                    .title('Upcoming events')
                    .schemaType('event')
                    .filter('_type == "event" && startDateTime >= now()')
                    .defaultOrdering([{ field: 'startDateTime', direction: 'asc' }]),
                ),
              S.listItem()
                .title('Past events')
                .child(
                  S.documentList()
                    .title('Past events')
                    .schemaType('event')
                    .filter('_type == "event" && startDateTime < now()')
                    .defaultOrdering([{ field: 'startDateTime', direction: 'desc' }]),
                ),
              S.listItem().title('RSVPs').child(S.documentTypeList('eventRsvp').title('RSVPs')),
            ]),
        ),
      S.listItem()
        .title('Testimonials')
        .child(S.documentTypeList('testimonial').title('Testimonials')),
      S.divider(),
      S.listItem()
        .title('Stories inbox')
        .child(
          S.list()
            .title('Stories inbox')
            .items([
              S.listItem()
                .title('New submissions')
                .child(
                  S.documentList()
                    .title('New submissions')
                    .schemaType('story')
                    .filter('_type == "story" && status == "submitted"'),
                ),
              S.listItem()
                .title('In review')
                .child(
                  S.documentList()
                    .title('In review')
                    .schemaType('story')
                    .filter('_type == "story" && status in ["inReview", "changesRequested"]'),
                ),
              S.listItem()
                .title('Approved')
                .child(
                  S.documentList()
                    .title('Approved')
                    .schemaType('story')
                    .filter('_type == "story" && status == "approved"'),
                ),
              S.listItem()
                .title('Rejected / withdrawn')
                .child(
                  S.documentList()
                    .title('Rejected / withdrawn')
                    .schemaType('story')
                    .filter('_type == "story" && status in ["rejected", "withdrawn"]'),
                ),
              S.divider(),
              S.listItem()
                .title('All stories')
                .child(S.documentTypeList('story').title('All stories')),
            ]),
        ),
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
