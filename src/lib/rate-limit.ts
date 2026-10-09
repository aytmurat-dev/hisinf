import { headers } from 'next/headers'
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const url =
  process.env.UPSTASH_REDIS_REST_URL ||
  process.env.KV_REST_API_URL
const token =
  process.env.UPSTASH_REDIS_REST_TOKEN ||
  process.env.KV_REST_API_TOKEN

const isConfigured = Boolean(url && token)

if (!isConfigured && process.env.NODE_ENV !== 'test') {
  console.warn(
    '[rate-limit] Upstash Redis credentials not found. Using in-memory/allow-all fallback stub for local dev.',
  )
}

// In-memory / allow-all fallback limiter
class FallbackLimiter {
  async limit(_identifier: string) {
    return {
      success: true,
      limit: 1000,
      remaining: 999,
      reset: Date.now() + 60000,
    }
  }
}

const redis = isConfigured ? new Redis({ url: url!, token: token! }) : null

export const limiters = {
  register: isConfigured && redis
    ? new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(3, '1 h'), prefix: 'rl:register' })
    : new FallbackLimiter(),
  login: isConfigured && redis
    ? new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(10, '10 m'), prefix: 'rl:login' })
    : new FallbackLimiter(),
  comment: isConfigured && redis
    ? new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(5, '10 m'), prefix: 'rl:comment' })
    : new FallbackLimiter(),
  like: isConfigured && redis
    ? new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(60, '1 m'), prefix: 'rl:like' })
    : new FallbackLimiter(),
  contact: isConfigured && redis
    ? new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(3, '1 h'), prefix: 'rl:contact' })
    : new FallbackLimiter(),
  subscribe: isConfigured && redis
    ? new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(3, '1 h'), prefix: 'rl:subscribe' })
    : new FallbackLimiter(),
  search: isConfigured && redis
    ? new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(60, '1 m'), prefix: 'rl:search' })
    : new FallbackLimiter(),
  track: isConfigured && redis
    ? new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(120, '1 m'), prefix: 'rl:track' })
    : new FallbackLimiter(),
}

export async function getClientIp(): Promise<string> {
  try {
    const h = await headers()
    const xForwardedFor = h.get('x-forwarded-for')
    if (xForwardedFor) {
      return xForwardedFor.split(',')[0].trim()
    }
    const xRealIp = h.get('x-real-ip')
    if (xRealIp) {
      return xRealIp.trim()
    }
    return '127.0.0.1'
  } catch {
    return '127.0.0.1'
  }
}
