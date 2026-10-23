import 'server-only'
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const LIMIT = 5
const WINDOW = '10 m'

const hasUpstash = Boolean(
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN,
)

const upstashLimiter = hasUpstash
  ? new Ratelimit({
      redis: new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL!,
        token: process.env.UPSTASH_REDIS_REST_TOKEN!,
      }),
      limiter: Ratelimit.slidingWindow(LIMIT, WINDOW),
      prefix: 'ratelimit:forms',
    })
  : null

// In-memory fallback for local dev without Upstash configured. Not safe for
// a multi-instance production deployment — real limiting needs real Redis.
const memoryHits = new Map<string, number[]>()
const WINDOW_MS = 10 * 60 * 1000

function checkMemoryLimit(key: string): boolean {
  const now = Date.now()
  const hits = (memoryHits.get(key) ?? []).filter((t) => now - t < WINDOW_MS)
  if (hits.length >= LIMIT) {
    memoryHits.set(key, hits)
    return false
  }
  hits.push(now)
  memoryHits.set(key, hits)
  return true
}

/** 5 submissions / 10 min / form, keyed by `${formName}:${ipHash}` (Section 7). */
export async function checkRateLimit(key: string): Promise<boolean> {
  if (upstashLimiter) {
    const { success } = await upstashLimiter.limit(key)
    return success
  }
  return checkMemoryLimit(key)
}

export async function hashIp(ip: string): Promise<string> {
  const { createHash } = await import('node:crypto')
  return createHash('sha256').update(ip).digest('hex').slice(0, 16)
}
