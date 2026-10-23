// `server-only` deliberately throws unless imported inside Next.js's own
// bundler (it checks a Next-specific marker, not just `typeof window`), so
// it can't be imported directly in Vitest. Aliased here to a no-op — the
// real guard still runs for every actual `next build`/`next dev`.
export {}
