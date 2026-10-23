/**
 * Pushes the placeholder fixtures (lib/sanity/fixtures/*.ts) into a real
 * Sanity dataset as actual documents, so a client/editor sees realistic
 * starting content instead of an empty Studio. Run once, whenever a real
 * Sanity project exists:
 *
 *   SANITY_API_WRITE_TOKEN=... npx tsx sanity/seed/seed.ts
 *
 * Needs NEXT_PUBLIC_SANITY_PROJECT_ID/DATASET and SANITY_API_WRITE_TOKEN set
 * (see .env.example). Safe to re-run — every document uses a fixed `_id`
 * and is written with `createOrReplace`, so re-running just re-syncs content
 * rather than duplicating it.
 *
 * This script has not been run against a real dataset (none exists yet in
 * this environment) — it is type-checked but not integration-tested. Do a
 * dry run on a throwaway dataset before pointing it at production.
 */
import { createReadStream } from 'node:fs'
import path from 'node:path'
import type { SanityDocument } from 'sanity'
import { writeClient } from '../../lib/sanity/client'
import { hasSanityProject } from '../../lib/sanity/client'
import * as fixtures from '../../lib/sanity/fixtures'

const PUBLIC_DIR = path.resolve(__dirname, '../../public')
const assetIdCache = new Map<string, string>()

async function uploadImageAsset(localUrl: string): Promise<string> {
  const cached = assetIdCache.get(localUrl)
  if (cached) return cached

  const filePath = path.join(PUBLIC_DIR, localUrl.replace(/^\//, ''))
  const asset = await writeClient.assets.upload('image', createReadStream(filePath), {
    filename: path.basename(filePath),
  })
  assetIdCache.set(localUrl, asset._id)
  return asset._id
}

function isResolvedLink(obj: Record<string, unknown>): boolean {
  return (
    typeof obj.label === 'string' &&
    typeof obj.type === 'string' &&
    ['internal', 'external', 'email', 'phone', 'anchor'].includes(obj.type as string)
  )
}

function isSanityImageLike(obj: Record<string, unknown>): boolean {
  return typeof obj.url === 'string' && typeof obj.alt !== 'undefined'
}

function isDocumentReference(obj: Record<string, unknown>): boolean {
  return (
    typeof obj._id === 'string' &&
    typeof obj._type === 'string' &&
    !('asset' in obj) &&
    !('url' in obj)
  )
}

async function transformLink(link: Record<string, unknown>): Promise<Record<string, unknown>> {
  if (link.type !== 'internal') {
    return {
      label: link.label,
      type: link.type,
      external: link.external,
      openInNewTab: link.openInNewTab,
    }
  }
  const internal = link.internal as { _id?: string } | null | undefined
  if (!internal?._id) return { label: link.label, type: 'internal' }
  return {
    label: link.label,
    type: 'internal',
    internal: { _type: 'reference', _ref: internal._id },
  }
}

async function transformImage(obj: Record<string, unknown>): Promise<Record<string, unknown>> {
  const assetId = await uploadImageAsset(obj.url as string)
  const { url, ...rest } = obj
  void url
  return { ...rest, asset: { _type: 'reference', _ref: assetId } }
}

/** Walks any fixture value, resolving embedded documents/links/images into
 * the raw Sanity-reference shapes `createOrReplace` expects. */
async function deepTransform(value: unknown): Promise<unknown> {
  if (Array.isArray(value)) return Promise.all(value.map((v) => deepTransform(v)))
  if (value && typeof value === 'object') {
    const obj = value as Record<string, unknown>

    if (isDocumentReference(obj)) return { _type: 'reference', _ref: obj._id }
    if (isSanityImageLike(obj)) return transformImage(obj)
    if (isResolvedLink(obj)) return transformLink(obj)

    // `_placeholder` passes through deliberately — it isn't in any schema,
    // but Sanity stores unknown fields anyway, so `*[_placeholder == true]`
    // in Vision finds every document this script created.
    const result: Record<string, unknown> = {}
    for (const [key, val] of Object.entries(obj)) {
      result[key] = await deepTransform(val)
    }
    return result
  }
  return value
}

async function writeDoc(doc: Record<string, unknown>) {
  const transformed = (await deepTransform(doc)) as SanityDocument
  await writeClient.createOrReplace(transformed)
  console.log(`✓ ${transformed._type} ${transformed._id}`)
}

async function main() {
  if (!hasSanityProject) {
    console.error('NEXT_PUBLIC_SANITY_PROJECT_ID is not set — nothing to seed. See .env.example.')
    process.exit(1)
  }
  if (!process.env.SANITY_API_WRITE_TOKEN) {
    console.error('SANITY_API_WRITE_TOKEN is not set — required to write documents.')
    process.exit(1)
  }

  console.log('Seeding categories...')
  for (const doc of fixtures.categories) await writeDoc(doc)

  console.log('Seeding authors...')
  for (const doc of fixtures.authors) await writeDoc(doc)

  console.log('Seeding team members...')
  for (const doc of fixtures.teamMembers) await writeDoc(doc)

  console.log('Seeding articles...')
  for (const doc of fixtures.articles) await writeDoc(doc)

  console.log('Seeding testimonials...')
  for (const doc of fixtures.testimonials) await writeDoc(doc)

  console.log('Seeding legal/generic pages...')
  for (const doc of fixtures.pages) await writeDoc(doc)

  console.log('Seeding site shell singletons...')
  await writeDoc({ _id: 'siteSettings', _type: 'siteSettings', ...fixtures.siteSettings })
  await writeDoc({ _id: 'navigation', _type: 'navigation', ...fixtures.navigation })
  await writeDoc({ _id: 'footer', _type: 'footer', ...fixtures.footer })
  await writeDoc({
    _id: 'announcementBar',
    _type: 'announcementBar',
    enabled: true,
    ...fixtures.announcementBar,
  })

  console.log('Seeding home / about / learn hub...')
  await writeDoc({
    _id: 'homePage',
    _type: 'homePage',
    _placeholder: true,
    hero: fixtures.homePageHero,
    sections: fixtures.homePageSections,
  })
  await writeDoc({
    _id: 'aboutPage',
    _type: 'aboutPage',
    _placeholder: true,
    hero: fixtures.aboutPageHero,
    story: fixtures.aboutPageStory,
    pillars: fixtures.aboutPagePillars,
    values: fixtures.aboutPageValues,
    foundingCircleHeading: 'The Founding Circle',
    foundingCircle: fixtures.teamMembers.filter((m) => m.group === 'foundingCircle'),
  })
  await writeDoc({
    _id: 'learnHubPage',
    _type: 'learnHubPage',
    _placeholder: true,
    hero: fixtures.learnHubPageHero,
    introText: fixtures.learnHubIntroText,
    featuredArticles: fixtures.learnHubFeaturedArticles,
  })

  console.log(
    '\nDone. Every document is tagged _placeholder: true (except the hand-written singletons) — find them in Studio’s Vision tool with `*[_placeholder == true]`.',
  )
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
