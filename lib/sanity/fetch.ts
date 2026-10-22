import 'server-only'
import { draftMode } from 'next/headers'
import { client, draftClient, hasSanityProject } from './client'

/**
 * Typed fetch helper for Server Components. Public pages are statically
 * rendered and cached by tag (page, article, event, story, siteSettings...);
 * the Sanity webhook hits /api/revalidate on publish and revalidates the
 * matching tags. Draft mode (Presentation tool) bypasses the cache entirely
 * and reads unpublished content.
 *
 * Returns `null` when no Sanity project is configured yet (see
 * NEXT_PUBLIC_SANITY_PROJECT_ID in .env.example) so pages can render their
 * empty states instead of crashing during local scaffolding.
 */
export async function sanityFetch<QueryResponse>({
  query,
  params = {},
  tags = [],
}: {
  query: string
  params?: Record<string, unknown>
  tags?: string[]
}): Promise<QueryResponse | null> {
  if (!hasSanityProject) return null

  const { isEnabled: isDraftMode } = await draftMode()

  if (isDraftMode) {
    return draftClient.fetch<QueryResponse>(query, params, { cache: 'no-store' })
  }

  return client.fetch<QueryResponse>(query, params, {
    cache: 'force-cache',
    next: { tags },
  })
}
