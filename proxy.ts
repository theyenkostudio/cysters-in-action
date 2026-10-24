import { NextResponse, type NextRequest } from 'next/server'

// Nonce-based CSP for the public frontend (Section 8: "Security headers/CSP").
// Next.js auto-applies this nonce to every script/style tag it injects once
// it sees a `nonce-` value in the response's Content-Security-Policy header —
// no per-component wiring needed. `strict-dynamic` lets those trusted
// scripts load further scripts (e.g. the Turnstile widget, inserted via
// next/script) without listing every host.
//
// /studio is excluded on purpose: Sanity Studio is a separate, much more
// permissive app (eval, web sockets to the Sanity API, etc.) that already
// sits behind Sanity's own auth (Section 8) — it doesn't need, and would
// likely break under, the frontend's policy.
//
// `frame-ancestors 'self'` (not 'none') is deliberate: the Presentation
// tool at /studio embeds the live frontend in an iframe for preview, and
// that's a same-origin frame since both are served from this one app.
function buildCsp(nonce: string) {
  // Turbopack's dev server evaluates code for HMR/fast refresh, which a
  // strict script-src blocks — relax only in development, never in a
  // deployed (production) build.
  const devOnly = process.env.NODE_ENV === 'development' ? ` 'unsafe-eval'` : ''
  return [
    `default-src 'self'`,
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic' https://challenges.cloudflare.com${devOnly}`,
    `style-src 'self' 'unsafe-inline'`,
    `img-src 'self' https://cdn.sanity.io data: blob:`,
    `font-src 'self' data:`,
    `media-src 'self' https://cdn.sanity.io`,
    `connect-src 'self' https://challenges.cloudflare.com${devOnly ? ' ws://localhost:* http://localhost:*' : ''}`,
    `frame-src https://challenges.cloudflare.com`,
    `frame-ancestors 'self'`,
    `worker-src 'self' blob:`,
    `object-src 'none'`,
    `base-uri 'self'`,
    `form-action 'self'`,
    `upgrade-insecure-requests`,
  ].join('; ')
}

export function proxy(request: NextRequest) {
  const nonce = btoa(crypto.randomUUID())
  const csp = buildCsp(nonce)

  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-nonce', nonce)

  const response = NextResponse.next({ request: { headers: requestHeaders } })
  response.headers.set('Content-Security-Policy', csp)
  return response
}

export const config = {
  matcher: ['/((?!studio|api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)'],
}
