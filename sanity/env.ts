export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2025-01-01'
export const dataset = envOrEmpty('NEXT_PUBLIC_SANITY_DATASET')
export const projectId = envOrEmpty('NEXT_PUBLIC_SANITY_PROJECT_ID')

// Allows the app to boot without a real Sanity project during local
// scaffolding — see .env.example and lib/sanity/client.ts's hasSanityProject.
function envOrEmpty(key: string): string {
  const value = process.env[key]
  if (!value && process.env.NODE_ENV !== 'production') {
    console.warn(`[sanity] ${key} is not set — Sanity-backed content will be empty.`)
  }
  return value ?? ''
}
