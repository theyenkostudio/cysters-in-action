import { logError } from '@/lib/log-error'

// Next.js's built-in server-error hook (Section 8: "error monitoring").
// Catches anything uncaught by a route handler, Server Action or render
// that app/error.tsx / app/global-error.tsx don't — e.g. errors thrown
// during streaming after the shell has already sent. `errorRequest` carries
// only the path/method/headers, never the request body, so there's nothing
// here to redact beyond what logError already guards against.
export function onRequestError(
  error: unknown,
  errorRequest: Readonly<{ path: string; method: string }>,
  errorContext: Readonly<{ routerKind: string; routeType: string }>,
) {
  logError('request', error, {
    path: errorRequest.path,
    method: errorRequest.method,
    routeType: errorContext.routeType,
  })
}
