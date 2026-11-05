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
 * When no Sanity project is configured yet (NEXT_PUBLIC_SANITY_PROJECT_ID
 * unset — see .env.example), returns `fixture` instead of hitting the
 * network at all. Pass the already-shaped placeholder value (or a function
 * of `params`, for parameterised queries like "get article by slug").
 * Callers never see the difference between a fixture and a real result —
 * connecting a real Sanity project later means setting the env vars, not
 * touching any component.
 */
export async function sanityFetch<QueryResponse>({
  query,
  params = {},
  tags = [],
  fixture,
  skipDraftMode = false,
}: {
  query: string
  params?: Record<string, unknown>
  tags?: string[]
  fixture?: QueryResponse | ((params: Record<string, unknown>) => QueryResponse)
  // generateStaticParams and sitemap.ts run at build time with no HTTP
  // request — Next.js 16 throws if draftMode() is called from there at all
  // (there's no request to read it from). Draft content is never relevant
  // to enumerating static params anyway, so those callers pass this to skip
  // the check entirely instead of hitting that throw.
  skipDraftMode?: boolean
}): Promise<QueryResponse> {
  if (!hasSanityProject) {
    if (fixture === undefined) return null as QueryResponse
    return typeof fixture === 'function'
      ? (fixture as (params: Record<string, unknown>) => QueryResponse)(params)
      : fixture
  }

  if (!skipDraftMode) {
    const { isEnabled: isDraftMode } = await draftMode()

    if (isDraftMode) {
      return draftClient.fetch<QueryResponse>(query, params, { cache: 'no-store' })
    }
  }

  return client.fetch<QueryResponse>(query, params, {
    cache: 'force-cache',
    next: { tags },
  })
}
