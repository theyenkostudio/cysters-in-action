import 'server-only'
import { hasSanityProject, writeClient } from './client'

/**
 * Creates a document with the server-only write token. No-ops (logs instead)
 * when no real Sanity project is configured, matching sanityFetch's
 * fixture-fallback pattern — forms still "work" during local scaffolding.
 */
export async function sanityCreate(doc: Record<string, unknown> & { _type: string }) {
  if (!hasSanityProject) {
    console.log(`[sanity] would create ${doc._type} — no project configured:`, doc)
    return null
  }
  return writeClient.create(doc)
}
