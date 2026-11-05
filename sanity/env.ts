export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2025-01-01'
// `process.env.NEXT_PUBLIC_X` must appear literally at each call site (not as
// `process.env[key]` inside envOrEmpty) — Next.js/Turbopack only inlines
// NEXT_PUBLIC_ vars into the browser bundle when it can statically see the
// literal member expression. Dynamic bracket access can't be analyzed at
// build time, so it silently resolved to nothing in the browser (Studio,
// a Client Component) even though the server always had the real value.
export const dataset = envOrEmpty(
  process.env.NEXT_PUBLIC_SANITY_DATASET,
  'NEXT_PUBLIC_SANITY_DATASET',
)
export const projectId = envOrEmpty(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  'NEXT_PUBLIC_SANITY_PROJECT_ID',
)

// Allows the app to boot without a real Sanity project during local
// scaffolding — see .env.example and lib/sanity/client.ts's hasSanityProject.
function envOrEmpty(value: string | undefined, key: string): string {
  if (!value && process.env.NODE_ENV !== 'production') {
    console.warn(`[sanity] ${key} is not set — Sanity-backed content will be empty.`)
  }
  return value ?? ''
}
