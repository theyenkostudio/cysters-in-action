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

export async function sanityPatch(id: string, patch: Record<string, unknown>) {
  if (!hasSanityProject) {
    console.log(`[sanity] would patch ${id} — no project configured:`, patch)
    return null
  }
  return writeClient.patch(id).set(patch).commit()
}

/**
 * Uploads a buffer as a Sanity image asset and returns an `image` field
 * value ready to attach to a document. No-ops when no project is
 * configured — the caller still completes, it just won't have a real asset
 * reference (see submitStory in lib/forms/actions.ts).
 */
export async function sanityUploadImage(
  buffer: Buffer,
  filename: string,
  contentType: string,
): Promise<{ _type: 'image'; asset: { _type: 'reference'; _ref: string } } | null> {
  if (!hasSanityProject) {
    console.log(
      `[sanity] would upload image "${filename}" (${buffer.length} bytes) — no project configured.`,
    )
    return null
  }
  const asset = await writeClient.assets.upload('image', buffer, { filename, contentType })
  return { _type: 'image', asset: { _type: 'reference', _ref: asset._id } }
}
