import { createClient } from 'next-sanity'
import { apiVersion, dataset, projectId } from '@/sanity/env'

// No real Sanity project is configured yet during local scaffolding
// (NEXT_PUBLIC_SANITY_PROJECT_ID unset) — fall back to a placeholder ID so
// `createClient` doesn't throw at import time. sanityFetch() short-circuits
// to `null` in that case rather than making a doomed network request; see
// hasSanityProject below.
export const hasSanityProject = Boolean(projectId)

const config = { projectId: projectId || 'placeholder', dataset, apiVersion }

export const client = createClient({ ...config, useCdn: true, perspective: 'published' })

// Server-only: sees drafts, used behind draft mode / Presentation.
export const draftClient = createClient({
  ...config,
  useCdn: false,
  perspective: 'previewDrafts',
  token: process.env.SANITY_API_READ_TOKEN,
})

// Server-only: creates documents from form submissions (story, RSVP, contact...).
export const writeClient = createClient({
  ...config,
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
})
