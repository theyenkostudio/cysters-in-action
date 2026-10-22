import type { StructureResolver } from 'sanity/structure'
import { SINGLETON_TYPES } from '../schemaTypes'

// Desk structure skeleton (Phase 1): Site singletons + generic Pages.
// Learn / Connect / Stories inbox / Inbox / People sections are added as
// their document types ship in later phases.
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
      S.listItem().title('Pages').child(S.documentTypeList('page').title('Pages')),
      ...S.documentTypeListItems().filter(
        (item) =>
          item.getId() && !SINGLETON_TYPES.has(item.getId() as string) && item.getId() !== 'page',
      ),
    ])
